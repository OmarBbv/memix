import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('cards')
@UseGuards(AuthGuard('jwt'))
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createCardDto: CreateCardDto,
  ) {
    return this.cardsService.create(req.user.id, createCardDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.cardsService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.cardsService.remove(+id, req.user.id);
  }
}
