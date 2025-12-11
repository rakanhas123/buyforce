import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('wishlist_items')
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // FK למשתמש
  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.wishlistItems, {
    onDelete: 'CASCADE',
  })
  user!: User;

  // מזהה המוצר מה-Catalog (יכול להיות UUID / מספר / string)
  @Column()
  productId!: string;

  // אופציונלי: שם המוצר להצגה מהירה
  @Column({ nullable: true })
  productName?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
