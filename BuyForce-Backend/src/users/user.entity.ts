import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WishlistItem } from '../wishlist/wishlist-item.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => WishlistItem, (item) => item.user)
  wishlistItems!: WishlistItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
