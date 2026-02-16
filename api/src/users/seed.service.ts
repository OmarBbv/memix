import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = 'admin@memix.com';
    const adminExists = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      this.logger.log('Seeding default admin user...');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('admin1234', salt);

      const admin = this.userRepository.create({
        name: 'Admin',
        surname: 'User',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(admin);
      this.logger.log('Default admin user created successfully!');
    } else {
      this.logger.log('Admin user already exists, skipping seed.');
    }
  }
}
