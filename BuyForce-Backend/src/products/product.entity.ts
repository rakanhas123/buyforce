import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../categories/category.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "numeric" })
  priceRegular!: string;

  @Column({ type: "numeric" })
  priceGroup!: string;

  @Column({ type: "int", default: 10 })
  minMembers!: number;

  @Column({ default: true })
  isActive!: boolean;
@Column({ nullable: true })
categoryId!: string | null;

@ManyToOne(() => Category, (c) => c.products, { eager: true, nullable: true })
category!: Category | null;
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
