import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { GroupStatus } from './group-status.enum';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "integer", nullable: true, name: 'productId' })
  productId!: number | null;

  // כמה משתמשים חייבים להצטרף כדי שהקבוצה תיחשב מלאה (100%)
  @Column({ type: 'int', name: 'min_participants' })
  minParticipants!: number;

  // כמה כבר הצטרפו בפועל
  @Column({ type: 'int', default: 0, name: 'joined_count' })
  joinedCount!: number;

  // אחוז התקדמות (0–100)
  @Column({ type: 'float', default: 0 })
  progress!: number;

  @Column({
    type: 'enum',
    enum: GroupStatus,
    default: GroupStatus.OPEN,
  })
  status!: GroupStatus;

  // מתי הקבוצה נסגרת
  @Index()
  @Column({ type: 'timestamptz', name: 'ends_at' })
  endsAt!: Date;

  // flags כדי שלא נשלח טריגר יותר מפעם אחת
  @Column({ type: 'boolean', default: false, name: 'notified_70' })
  notified70!: boolean;

  @Column({ type: 'boolean', default: false, name: 'notified_95' })
  notified95!: boolean;

  @Column({ type: 'boolean', default: false, name: 'notified_last_12h' })
  notifiedLast12h!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
