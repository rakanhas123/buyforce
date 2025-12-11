import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // POST /wishlist  – הוספת פריט
  @Post()
  addItem(@Body() dto: CreateWishlistItemDto) {
    return this.wishlistService.addItem(dto);
  }

  // GET /wishlist/user/:userId – כל ה-Wishlist של משתמש
  @Get('user/:userId')
  getUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getUserWishlist(userId);
  }

  // DELETE /wishlist/:id – מחיקת פריט בודד
  @Delete(':id')
  removeItem(@Param('id') id: string) {
    return this.wishlistService.removeItem(id);
  }

  // DELETE /wishlist/user/:userId – מחיקת כל ה-Wishlist של משתמש (לא חובה להשתמש)
  @Delete('user/:userId')
  clearUserWishlist(@Param('userId') userId: string) {
    return this.wishlistService.clearUserWishlist(userId);
  }
}
