import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WishlistItem } from "./wishlist-item.entity";

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem) private repo: Repository<WishlistItem>,
  ) {}

  list(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: "DESC" } });
  }

  async has(userId: string, productId: string) {
    const found = await this.repo.findOne({ where: { userId, productId } });
    return { has: !!found };
  }

  async add(userId: string, productId: string) {
    const exists = await this.repo.findOne({ where: { userId, productId } });
    if (exists) return exists;
    const item = this.repo.create({ userId, productId });
    return this.repo.save(item);
  }

  async remove(userId: string, productId: string) {
    await this.repo.delete({ userId, productId });
    return { ok: true };
  }
}
