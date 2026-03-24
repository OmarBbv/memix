import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

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

  async sendOtpEmail(email: string, code: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Memix - Email Təsdiqləmə Kodu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9;">
          <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h2 style="margin: 0 0 8px; font-size: 24px; color: #111;">Salam, ${name}! 👋</h2>
            <p style="color: #555; margin: 0 0 24px;">Memix hesabınızı aktivləşdirmək üçün aşağıdakı təsdiqlemə kodunu daxil edin:</p>
            <div style="background: #f4f4f4; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #111;">${code}</span>
            </div>
            <p style="color: #888; font-size: 13px; margin: 0;">Bu kod <strong>5 dəqiqə</strong> ərzində keçərlidir.</p>
            <p style="color: #888; font-size: 13px; margin: 8px 0 0;">Bu emaili siz göndərməmisinizsə, lütfən nəzərə almayın.</p>
          </div>
          <p style="text-align: center; color: #bbb; font-size: 12px; margin-top: 16px;">&copy; 2025 Memix. Bütün hüquqlar qorunur.</p>
        </div>
      `,
    });
  }
}
