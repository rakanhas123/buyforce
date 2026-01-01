export type Product = {
  id: number;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  currentMembers?: number;
  goalMembers?: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: 899,
    category: "electronics",
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MWP22_AV1",
    currentMembers: 62,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: 449,
    category: "fashion",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg",
    currentMembers: 91,
    goalMembers: 100,
  },
  {
    id: 3,
    name: "Samsung Galaxy Watch",
    price: 699,
    category: "mobile",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/01/22/19/12/smart-watch-2001346_1280.jpg",
    currentMembers: 12,
    goalMembers: 50,
  },

  /* 💻 מחשבים */
  {
    id: 4,
    name: "MacBook Pro M3",
    price: 7999,
    category: "computer",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    currentMembers: 8,
    goalMembers: 40,
  },
  {
    id: 5,
    name: "Gaming PC RTX 4070",
    price: 9999,
    category: "computer",
    imageUrl:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
    currentMembers: 5,
    goalMembers: 30,
  },
];
