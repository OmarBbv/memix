import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) { }

  async create(userId: number, createCardDto: CreateCardDto): Promise<Card> {
    const { cardNumber, holderName, expMonth, expYear, color } = createCardDto;

    // Simple brand detection
    let brand = 'unknown';
    if (cardNumber.startsWith('4')) brand = 'visa';
    else if (cardNumber.startsWith('5')) brand = 'mastercard';
    else if (cardNumber.startsWith('3')) brand = 'amex';

    const last4 = cardNumber.slice(-4);
    const masked = `**** **** **** ${last4}`;

    const card = this.cardsRepository.create({
      userId,
      holderName,
      cardNumberMasked: masked,
      last4,
      brand,
      expMonth,
      expYear,
      color: color || 'blue',
    });

    return this.cardsRepository.save(card);
  }

  async findAll(userId: number): Promise<Card[]> {
    return this.cardsRepository.find({
      where: { userId },
      order: { id: 'DESC' }
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const card = await this.cardsRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    if (card.userId !== userId) {
      throw new ForbiddenException('You can only delete your own cards');
    }
    await this.cardsRepository.remove(card);
  }
}
