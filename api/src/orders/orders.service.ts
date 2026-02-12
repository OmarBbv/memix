import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ProductStock } from '../branches/entities/product-stock.entity';
import { NotificationsService } from '../notifications/notifications.service';

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
  ) { }

  async create(userId: number, address: string, phone: string, branchId: number) {
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
        // Stok yoxlanışı
        const stock = await this.productStockRepository.findOne({
          where: { branchId, productId: item.product.id },
        });

        if (!stock || stock.stock < item.quantity) {
          throw new BadRequestException(`${item.product.name} üçün kifayət qədər stok yoxdur`);
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
        id: savedOrder.id,
        user: { name: 'Müştəri' }, // Real user data əlavə ediləcək
        totalPrice: savedOrder.totalPrice,
        items: orderItems,
        createdAt: savedOrder.createdAt,
      });

      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.orderRepository.find({ relations: ['items', 'items.product', 'user'] });
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
    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);

    // Müştəriyə real-time bildirilir
    this.notificationsService.notifyOrderStatusChange(order.user.id, {
      id: updatedOrder.id,
      status: updatedOrder.status,
    });

    return updatedOrder;
  }
}
