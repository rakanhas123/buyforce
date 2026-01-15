import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { Product } from '../products/product.entity';
import { Group } from '../groups/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Group])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
