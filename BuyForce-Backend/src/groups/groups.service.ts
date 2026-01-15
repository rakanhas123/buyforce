import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupStatus } from './group-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  // ✅ יצירת קבוצה חדשה (קשורה למוצר)
  async createGroup(dto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create({
      name: dto.name,
      productId: dto.productId,          // ✅ חדש
      minParticipants: dto.minParticipants,
      joinedCount: 0,
      progress: 0,
      status: GroupStatus.OPEN,
      endsAt: new Date(dto.endsAt),
      notified70: false,
      notified95: false,
      notifiedLast12h: false,
    });

    return this.groupRepository.save(group);
  }

  // ✅ להביא קבוצה לפי מוצר (בשביל /products/:id/group)
  async findByProductId(productId: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { productId } });
    if (!group) throw new NotFoundException('Group for product not found');
    return group;
  }

  // ✅ רץ כל דקה
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronForEndedGroups() {
    await this.processEndedGroups();
  }

  // ✅ משתמש מצטרף לקבוצה
  async joinGroup(groupId: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id: groupId } });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.status !== GroupStatus.OPEN) {
      throw new BadRequestException('Group is not open for joining');
    }

    group.joinedCount += 1;
    group.progress = this.computeProgress(group.joinedCount, group.minParticipants);

    // סטטוסים על הצטרפות
    this.updateStatusOnJoin(group);

    // טריגרים של 70% / 95% / 12 שעות
    this.handleThresholdTriggers(group);

    return this.groupRepository.save(group);
  }

  // ✅ מחשב אחוז התקדמות
  private computeProgress(joinedCount: number, minParticipants: number): number {
    if (minParticipants <= 0) return 0;
    const raw = (joinedCount / minParticipants) * 100;
    return Math.min(100, Math.round(raw * 100) / 100);
  }

  // ✅ לוגיקה של סטייטים על הצטרפות
  private updateStatusOnJoin(group: Group) {
    if (group.progress >= 100 && group.status === GroupStatus.OPEN) {
      group.status = GroupStatus.LOCKED;
    }
  }

  // ✅ טריגרים: 70%, 95% ו-12 שעות לפני סיום
  private handleThresholdTriggers(group: Group) {
    if (!group.notified70 && group.progress >= 70) {
      group.notified70 = true;
      // TODO notifications
    }

    if (!group.notified95 && group.progress >= 95) {
      group.notified95 = true;
      // TODO notifications
    }

    const now = new Date();
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    const timeToEnd = group.endsAt.getTime() - now.getTime();

    if (!group.notifiedLast12h && timeToEnd <= twelveHoursMs && timeToEnd > 0) {
      group.notifiedLast12h = true;
      // TODO notifications
    }
  }

  // ✅ מעבד קבוצות שהסתיימו (תיקון שאילתא)
  async processEndedGroups(): Promise<void> {
    const now = new Date();

    // אנחנו רוצים לעדכן רק OPEN/LOCKED שעברו את הזמן
    const groups = await this.groupRepository.find({
      where: {
        endsAt: LessThan(now),
        status: In([GroupStatus.OPEN, GroupStatus.LOCKED]),
      },
    });

    for (const group of groups) {
      if (group.progress >= 100) {
        group.status = GroupStatus.CHARGED;
      } else {
        group.status = GroupStatus.FAILED;
      }
      await this.groupRepository.save(group);
    }
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  // ✅ בסיס ל-My Groups (כרגע לפי userId שייכנס דרך join table בעתיד)
  // אם עדיין אין לך join table של memberships, תשאיר את זה כרגע “TODO”.
  // בהמשך ניצור GroupMember entity (userId + groupId + paymentStatus).
}
