import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Product } from "../products/product.entity";
import { Group } from "../groups/group.entity";
import { GroupStatus } from "../groups/group-status.enum";

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(Group) private groupsRepo: Repository<Group>,
  ) {}

  async getSections() {
    // 1) Active products
    const products = await this.productsRepo.find({
      where: { isActive: true } as any,
      order: { createdAt: "DESC" } as any,
    });

    // 2) Groups relevant to home (OPEN/LOCKED)
    const groups = await this.groupsRepo.find({
      where: { status: In([GroupStatus.OPEN, GroupStatus.LOCKED]) } as any,
      // אם יש לך relation בשם product ואתה רוצה גישה ל־g.product.id:
      relations: ["product"] as any,
    });

    // 3) Map productId -> group
    const groupByProductId = new Map<string, Group>();

    for (const g of groups) {
      // תומך גם ב־g.productId וגם ב־g.product.id
      const pid =
        (g as any).productId ??
        ((g as any).product?.id as string | undefined);

      if (pid) groupByProductId.set(String(pid), g);
    }

    // 4) Build cards
    const cards = products.map((p) => {
      const g = groupByProductId.get(String(p.id));

      const regular = Number((p as any).priceRegular);
      const groupPrice = Number((p as any).priceGroup);
      const discountPct =
        regular > 0 ? Math.round(((regular - groupPrice) / regular) * 100) : 0;

      return {
        id: p.id,
        name: (p as any).name,
        description: (p as any).description,
        priceRegular: (p as any).priceRegular,
        priceGroup: (p as any).priceGroup,
        discountPct,
        group: g
          ? {
              id: (g as any).id,
              status: (g as any).status,
              progress: Number((g as any).progress ?? 0),
              joinedCount: Number((g as any).joinedCount ?? 0),
              minParticipants: Number((g as any).minParticipants ?? 0),
              endsAt: (g as any).endsAt ?? null,
              // חשוב: מחזירים גם productId כדי שה־frontend יוכל להשתמש אם צריך
              productId:
                (g as any).productId ??
                ((g as any).product?.id as string | undefined) ??
                null,
            }
          : null,
        createdAt: (p as any).createdAt,
      };
    });

    // Near Goal = הכי קרוב ל-100 ועדיין OPEN/LOCKED
    const nearGoal = [...cards]
      .filter(
        (c) =>
          c.group &&
          (c.group.status === GroupStatus.OPEN ||
            c.group.status === GroupStatus.LOCKED),
      )
      .sort((a, b) => (b.group!.progress ?? 0) - (a.group!.progress ?? 0))
      .slice(0, 6);

    // Top Discounts
    const topDiscounts = [...cards]
      .sort((a, b) => b.discountPct - a.discountPct)
      .slice(0, 6);

    // New Arrivals
    const newArrivals = [...cards].slice(0, 6);

    return { nearGoal, topDiscounts, newArrivals };
  }
}
