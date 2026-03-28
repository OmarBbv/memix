import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ProductStock } from '../products/entities/product-stock.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductStock)
    private productStockRepository: Repository<ProductStock>,
    private dataSource: DataSource,
    private notificationsService: NotificationsService,
    private mailService: MailService,
  ) { }

  async create(
    userId: number,
    address: string,
    phone: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Səbəti tapırıq
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Səbət boşdur');
      }

      // 2. Ümumi məbləği hesablayırıq və stoku yoxlayırıq
      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const item of cart.items) {
        // Stok yoxlanışı — rəng+ölçüyə görə (Trendyol modeli)
        const itemSize = item.variants?.size || null;
        const itemColor = item.variants?.color || null;
        let stock: ProductStock | null = null;

        // 1. Əvvəl rəng+ölçüyə görə axtarırıq
        if (itemColor && itemSize) {
          stock = await this.productStockRepository.findOne({
            where: {
              productId: item.product.id,
              size: itemSize,
              colorVariant: { color: itemColor },
            },
          });
        }

        // 2. Yalnız ölçüyə görə
        if (!stock && itemSize) {
          stock = await this.productStockRepository.findOne({
            where: { productId: item.product.id, size: itemSize },
          });
        }

        // 3. Yalnız rəngə görə
        if (!stock && itemColor) {
          stock = await this.productStockRepository.findOne({
            where: { productId: item.product.id, colorVariant: { color: itemColor } },
          });
        }

        // 4. Ümumi stoku yoxlayırıq
        if (!stock) {
          stock = await this.productStockRepository.findOne({
            where: { productId: item.product.id },
          });
        }

        if (!stock || stock.stock < item.quantity) {
          throw new BadRequestException(
            `${item.product.name} üçün kifayət qədər stok yoxdur`,
          );
        }

        // Stokdan azaldırıq
        stock.stock -= item.quantity;
        await queryRunner.manager.save(stock);

        // OrderItem yaradırıq
        const orderItem = this.orderItemRepository.create({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
          variants: item.variants,
        });
        orderItems.push(orderItem);
        total += Number(item.product.price) * item.quantity;
      }

      // 3. Sifarişi yaradırıq
      const order = this.orderRepository.create({
        user: { id: userId } as any,
        items: orderItems,
        totalPrice: total,
        address,
        contactPhone: phone,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // 4. Səbəti təmizləyirik (cascade: true yoxdursa CartItem-ləri silməliyik)
      await queryRunner.manager.delete('cart_items', { cart: { id: cart.id } });

      await queryRunner.commitTransaction();

      // 5. Admin-ə real-time bildirilir
      this.notificationsService.notifyNewOrder({
        id: (savedOrder as Order).id,
        user: { name: 'Müştəri' },
        totalPrice: (savedOrder as Order).totalPrice,
        items: orderItems,
        createdAt: (savedOrder as Order).createdAt,
      });

      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(search?: string, status?: OrderStatus) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.user', 'user');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(CAST(order.id AS TEXT) ILIKE :search OR user.name ILIKE :search OR user.surname ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    query.orderBy('order.createdAt', 'DESC');

    return query.getMany();
  }

  async findByUserId(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) throw new NotFoundException('Sifariş tapılmadı');
    return order;
  }

  async updateStatus(id: number, status: OrderStatus) {
    const order = await this.findOne(id);
    const oldStatus = order.status;

    // Əgər artıq eyni statusdursa heç nə etmə
    if (oldStatus === status) return order;

    // Stokun qaytarılması loqikası (Yalnız ləğv edildikdə və əvvəl ləğv edilməmişdisə)
    if (status === OrderStatus.CANCELLED && oldStatus !== OrderStatus.CANCELLED) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const item of order.items) {
          const itemSize = item.variants?.size || null;
          const itemColor = item.variants?.color || null;

          // Stok rekordunu axtarırıq (productId və variantlar üzrə)
          let stock = await queryRunner.manager.findOne(ProductStock, {
            where: {
              productId: item.product.id,
              size: itemSize,
              colorVariant: { color: itemColor },
            },
          });

          // Əgər tam eyni variant tapılmasa, daha geniş baxırıq
          if (!stock && itemSize) {
            stock = await queryRunner.manager.findOne(ProductStock, {
              where: { productId: item.product.id, size: itemSize },
            });
          }
          if (!stock && itemColor) {
            stock = await queryRunner.manager.findOne(ProductStock, {
              where: { productId: item.product.id, colorVariant: { color: itemColor } },
            });
          }
          if (!stock) {
            stock = await queryRunner.manager.findOne(ProductStock, {
              where: { productId: item.product.id },
            });
          }

          if (stock) {
            stock.stock += item.quantity;
            await queryRunner.manager.save(stock);
          }
        }

        order.status = status;
        await queryRunner.manager.save(order);
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } else {
      order.status = status;
      await this.orderRepository.save(order);
    }

    const updatedOrder = await this.findOne(id);

    // Müştəriyə real-time bildirilir
    this.notificationsService.notifyOrderStatusChange(order.user.id, {
      id: updatedOrder.id,
      status: updatedOrder.status,
    });

    // Email bildirilişi
    if (order.user?.email) {
      try {
        await this.mailService.sendOrderStatusUpdate(order.user.email, {
          orderId: order.id,
          status: this.getStatusLabel(status),
          customerName: order.user.name,
        });
      } catch (error) {
        console.error('Email göndərilərkən xəta:', error);
      }
    }

    return updatedOrder;
  }

  private getStatusLabel(status: OrderStatus): string {
    const labels = {
      [OrderStatus.PENDING]: 'Gözləyir',
      [OrderStatus.PREPARING]: 'Hazırlanır',
      [OrderStatus.READY]: 'Hazırdır',
      [OrderStatus.ON_WAY]: 'Yoldadır',
      [OrderStatus.DELIVERED]: 'Çatdırıldı',
      [OrderStatus.CANCELLED]: 'Ləğv edildi',
    };
    return labels[status] || status;
  }
}
