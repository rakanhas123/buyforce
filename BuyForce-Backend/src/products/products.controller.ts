import { Controller, Get, Param, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Get(":id/group")
  getGroup(@Param("id") id: string) {
    return this.service.getGroupForProduct(id);
  }

  @Post("dev/seed")
  seed() {
    return this.service.seedIfEmpty();
  }
}
