import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) { }

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Memix-ə Xoş Gəlmisiniz! 🎉',
      template: './welcome',
      context: {
        name,
        frontendUrl: this.configService.get('FRONTEND_URL'),
      },
    });
  }

  async sendOrderConfirmation(email: string, orderDetails: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Sifarişiniz Təsdiqləndi - #${orderDetails.orderId}`,
      template: './order-confirmation',
      context: {
        orderId: orderDetails.orderId,
        items: orderDetails.items,
        totalPrice: orderDetails.totalPrice,
        address: orderDetails.address,
        customerName: orderDetails.customerName,
      },
    });
  }

  async sendPasswordReset(email: string, resetToken: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Şifrə Sıfırlama Tələbi',
      template: './password-reset',
      context: {
        resetUrl,
      },
    });
  }

  async sendOrderStatusUpdate(email: string, orderDetails: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Sifarişinizin Statusu Dəyişdi - #${orderDetails.orderId}`,
      template: './order-status',
      context: {
        orderId: orderDetails.orderId,
        status: orderDetails.status,
        customerName: orderDetails.customerName,
      },
    });
  }

  async sendCouponNotification(email: string, coupon: any) {
    await this.mailerService.sendMail({
      to: email,
      subject: `🎁 Yeni Endirim Kuponu: ${coupon.code}`,
      template: './coupon',
      context: {
        code: coupon.code,
        discount: coupon.value,
        type: coupon.type,
        expiresAt: coupon.expiresAt,
        frontendUrl: this.configService.get('FRONTEND_URL'),
      },
    });
  }
}
