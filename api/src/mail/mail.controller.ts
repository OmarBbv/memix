import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // Test endpoint - Sonra silinəcək
  @Post('test/welcome')
  async testWelcome(@Body('email') email: string, @Body('name') name: string) {
    await this.mailService.sendWelcomeEmail(email, name);
    return { message: 'Welcome email sent!' };
  }

  @Post('test/order')
  async testOrder(@Body() data: any) {
    await this.mailService.sendOrderConfirmation(data.email, {
      orderId: 12345,
      items: [{ product: { name: 'Test Məhsul' }, quantity: 2, price: 50 }],
      totalPrice: 100,
      address: 'Test Ünvan',
      customerName: data.name,
    });
    return { message: 'Order confirmation email sent!' };
  }
}
