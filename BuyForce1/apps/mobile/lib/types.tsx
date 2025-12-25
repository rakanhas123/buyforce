// apps/mobile/lib/types.tsx

export type Category = {
  id: string;
  title: string;
  icon: string; // emoji או אייקון
};

export type Group = {
  id: string;
  title: string;
  price: number;
  image: string;     // URL לתמונה
  members: number;
  goal: number;
  categoryId: string;
};
