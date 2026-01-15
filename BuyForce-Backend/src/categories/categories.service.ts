import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  getAll() {
    return [
      { id: "c1", name: "Electronics", slug: "electronics" },
      { id: "c2", name: "Gaming", slug: "gaming" },
    ];
  }
}

  async getFeed(slug: string) {
    // אם אין לך category ב-DB, נחזיר פשוט מוצרים פעילים (דמו)
    const products = await this.productsRepo.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
      take: 50,
    });

    // אם בעתיד יהיה לך categorySlug בטבלה:
    // where: { isActive: true, categorySlug: slug }

    return { slug, items: products };
  }
}
