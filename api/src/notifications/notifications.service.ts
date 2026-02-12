import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private notificationsGateway: NotificationsGateway) { }

  // Yeni sifariş bildirişi
  notifyNewOrder(orderData: any) {
    this.notificationsGateway.notifyNewOrder(orderData);
  }

  // Sifariş statusu dəyişikliyi
  notifyOrderStatusChange(userId: number, orderData: any) {
    this.notificationsGateway.notifyOrderStatusChange(userId, orderData);
  }

  // Yeni kupon bildirişi
  notifyNewCoupon(couponData: any) {
    this.notificationsGateway.notifyNewCoupon(couponData);
  }

  // Xüsusi mesaj göndər
  sendToUser(userId: number, event: string, data: any) {
    this.notificationsGateway.sendToUser(userId, event, data);
  }

  // Admin-lərə mesaj
  sendToAdmins(event: string, data: any) {
    this.notificationsGateway.sendToAdmins(event, data);
  }
}
