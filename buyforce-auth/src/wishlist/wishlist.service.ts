import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepository: Repository<WishlistItem>,
  ) {}

  // הוספת פריט ל-Wishlist
  async addItem(dto: CreateWishlistItemDto): Promise<WishlistItem> {
    const item = this.wishlistRepository.create({
      userId: dto.userId,
      productId: dto.productId,
      productName: dto.productName,
    });

    return this.wishlistRepository.save(item);
  }

  // קבלת כל ה-Wishlist של משתמש
  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    return this.wishlistRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // מחיקת פריט ספציפי
  async removeItem(id: string): Promise<void> {
    const result = await this.wishlistRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist item not found');
    }
  }

  // מחיקת כל ה-Wishlist של משתמש (אופציונלי)
  async clearUserWishlist(userId: string): Promise<void> {
    await this.wishlistRepository.delete({ userId });
  }
}
