export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  currentMembers?: number;
  goalMembers?: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Apple AirPods Pro",
    price: 899,
    imageUrl:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MWP22_AV1",
    currentMembers: 62,
    goalMembers: 100,
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: 449,
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg",
    currentMembers: 91,
    goalMembers: 100,
  },
  {
    id: 3,
    name: "Samsung Galaxy Watch",
    price: 699,
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/01/22/19/12/smart-watch-2001346_1280.jpg",
    currentMembers: 12,
    goalMembers: 50,
  },
];
