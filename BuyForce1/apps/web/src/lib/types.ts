export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;

  // אצלך בדמו זה מספרים, אצלך בDB לפעמים זה string
  priceRegular: number | string;
  priceGroup: number | string;

  imageUrl?: string | null;
  category?: Category | null;
};

export type GroupStatus = "OPEN" | "LOCKED" | "CHARGED" | "FAILED";

export type Group = {
  id: string;
  productId: string;
  minParticipants: number;
  joinedCount: number;
  progress: number;
  status: GroupStatus;
  endsAt: string;
};

export type HomeSection = {
  key: string;
  title: string;
  items: Product[];
};
