import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { Group } from "../groups/group.entity";
import { GroupStatus } from "../groups/group-status.enum";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(Group) private groupsRepo: Repository<Group>,
  ) {}

  async findAll() {
    return this.productsRepo.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string) {
    const p = await this.productsRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException("Product not found");
    return p;
  }

  async getGroupForProduct(productId: string) {
    const g = await this.groupsRepo.findOne({ where: { productId } });
    if (!g) throw new NotFoundException("Group for product not found");
    return g;
  }

  async seedIfEmpty() {
    const count = await this.productsRepo.count();
    if (count > 0) return { ok: true, seeded: false };

    const p1 = this.productsRepo.create({
      name: "AirPods Pro",
      description: "Noise cancellation, great sound.",
      priceRegular: "999",
      priceGroup: "799",
      isActive: true,
    });

    const p2 = this.productsRepo.create({
      name: "Gaming Mouse",
      description: "Lightweight, high DPI.",
      priceRegular: "249",
      priceGroup: "169",
      isActive: true,
    });

    const saved = await this.productsRepo.save([p1, p2]);

    for (const p of saved) {
      const ends = new Date();
      ends.setDate(ends.getDate() + 3);

      const g = this.groupsRepo.create({
        name: `${p.name} Group`,
        productId: p.id,
        minParticipants: 10,
        joinedCount: 0,
        progress: 0,
        status: GroupStatus.OPEN,
        endsAt: ends,
        notified70: false,
        notified95: false,
        notifiedLast12h: false,
      });

      await this.groupsRepo.save(g);
    }

    return { ok: true, seeded: true };
  }
}
