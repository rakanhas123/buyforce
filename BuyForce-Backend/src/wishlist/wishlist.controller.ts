import { Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { WishlistService } from "./wishlist.service";

@Controller("wishlist")
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  @Get()
  list(@Req() req: any) {
    return this.service.list(req.user.id);
  }

  @Post(":productId")
  add(@Req() req: any, @Param("productId") productId: string) {
    return this.service.add(req.user.id, productId);
  }

  @Delete(":productId")
  remove(@Req() req: any, @Param("productId") productId: string) {
    return this.service.remove(req.user.id, productId);
  }

  @Get("has/:productId")
  has(@Req() req: any, @Param("productId") productId: string) {
    return this.service.has(req.user.id, productId);
  }
}
