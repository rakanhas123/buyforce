import { Category, Group } from "./types";

/* ================= Categories ================= */
export const CATEGORIES: Category[] = [
  { id: "perfume", title: "Perfume", icon: "🌸" },
  { id: "computer", title: "Computer", icon: "💻" },
  { id: "accessories", title: "Accessories", icon: "🎧" },
  { id: "mobile", title: "Mobile", icon: "📱" },
];

/* ================= Groups / Products ================= */
export const GROUPS: Group[] = [
  {
    id: "g1",
    title: "Luxury Perfume",
    price: 299,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    members: 45,
    goal: 80,
    categoryId: "perfume",
  },
  {
    id: "g2",
    title: "Gaming Laptop",
    price: 4999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    members: 22,
    goal: 50,
    categoryId: "computer",
  },
  {
    id: "g3",
    title: "Wireless Headphones",
    price: 399,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    members: 68,
    goal: 100,
    categoryId: "accessories",
  },
  {
    id: "g4",
    title: "Smartphone Pro",
    price: 3499,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    members: 91,
    goal: 100,
    categoryId: "mobile",
  },
];
