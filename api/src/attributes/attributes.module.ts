import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { Attribute } from './entities/attribute.entity';
import { AttributeOption } from './entities/attribute-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute, AttributeOption])],
  providers: [AttributesService],
  controllers: [AttributesController],
  exports: [AttributesService],
})
export class AttributesModule {}
