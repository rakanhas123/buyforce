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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;



  
@Column({ type: "uuid", nullable: true })
productId!: string | null;

  // כמה משתמשים חייבים להצטרף כדי שהקבוצה תיחשב מלאה (100%)
  @Column({ type: 'int' })
  minParticipants!: number;

  // כמה כבר הצטרפו בפועל
  @Column({ type: 'int', default: 0 })
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
  @Column({ type: 'timestamptz' })
  endsAt!: Date;

  // flags כדי שלא נשלח טריגר יותר מפעם אחת
  @Column({ type: 'boolean', default: false })
  notified70!: boolean;

  @Column({ type: 'boolean', default: false })
  notified95!: boolean;

  @Column({ type: 'boolean', default: false })
  notifiedLast12h!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
