import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  async getAll() {
    return [
      { id: "c1", name: "Electronics", slug: "electronics" },
      { id: "c2", name: "Gaming", slug: "gaming" },
    ];
  }
}
