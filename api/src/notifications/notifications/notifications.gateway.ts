import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers: Map<
    string,
    { userId: number; role: string; socketId: string }
  > = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Online istifadəçilərdən sil
    for (const [key, value] of this.onlineUsers.entries()) {
      if (value.socketId === client.id) {
        this.onlineUsers.delete(key);
        break;
      }
    }

    // Yenilənmiş sayı göndər
    this.broadcastOnlineCount();
  }

  @SubscribeMessage('user:register')
  handleUserRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; role: string },
  ) {
    // İstifadəçini qeyd et
    this.onlineUsers.set(`user-${data.userId}`, {
      userId: data.userId,
      role: data.role,
      socketId: client.id,
    });

    // Admin otağına əlavə et
    if (data.role === 'admin') {
      client.join('admin');
    }

    // Şəxsi otağa əlavə et
    client.join(`user:${data.userId}`);

    console.log(`User registered: ${data.userId} (${data.role})`);

    // Online sayını yenilə
    this.broadcastOnlineCount();

    return { success: true, message: 'Registered successfully' };
  }

  // Yeni sifariş yaradılanda admin-ə bildir
  notifyNewOrder(orderData: any) {
    this.server.to('admin').emit('order:new', {
      orderId: orderData.id,
      customerName: orderData.user?.name,
      totalPrice: orderData.totalPrice,
      itemsCount: orderData.items?.length,
      createdAt: orderData.createdAt,
    });
  }

  // Sifariş statusu dəyişəndə müştəriyə bildir
  notifyOrderStatusChange(userId: number, orderData: any) {
    this.server.to(`user:${userId}`).emit('order:status-changed', {
      orderId: orderData.id,
      status: orderData.status,
      message: this.getStatusMessage(orderData.status),
    });
  }

  // Online istifadəçi sayını yayımla
  private broadcastOnlineCount() {
    const count = this.onlineUsers.size;
    const adminCount = Array.from(this.onlineUsers.values()).filter(
      (u) => u.role === 'admin',
    ).length;
    const userCount = count - adminCount;

    this.server.emit('users:online', {
      total: count,
      admins: adminCount,
      customers: userCount,
    });
  }

  // Status mesajı
  private getStatusMessage(status: string): string {
    const messages = {
      PENDING: 'Sifarişiniz qəbul edildi',
      PREPARING: 'Sifarişiniz hazırlanır',
      READY: 'Sifarişiniz hazırdır',
      ON_WAY: 'Sifarişiniz yoldadır',
      DELIVERED: 'Sifarişiniz çatdırıldı',
      CANCELLED: 'Sifarişiniz ləğv edildi',
    };
    return messages[status] || 'Status yeniləndi';
  }

  // Yeni kupon bildirişi (hamıya)
  notifyNewCoupon(couponData: any) {
    this.server.emit('coupon:new', {
      code: couponData.code,
      discount: couponData.value,
      type: couponData.type,
      message: `Yeni endirim kuponu: ${couponData.code}`,
    });
  }

  // Xüsusi istifadəçiyə mesaj göndər
  sendToUser(userId: number, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Bütün adminlərə mesaj göndər
  sendToAdmins(event: string, data: any) {
    this.server.to('admin').emit(event, data);
  }
}
