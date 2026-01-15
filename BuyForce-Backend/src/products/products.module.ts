import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Product } from "./product.entity";
import { Group } from "../groups/group.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Group])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
