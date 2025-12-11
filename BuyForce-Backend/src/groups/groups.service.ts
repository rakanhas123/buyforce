import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
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

  // יצירת קבוצה חדשה
  async createGroup(dto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create({
      name: dto.name,
      minParticipants: dto.minParticipants,
      joinedCount: 0,
      progress: 0,
      status: GroupStatus.OPEN,
      endsAt: new Date(dto.endsAt),
    });
    

    return this.groupRepository.save(group);
  }
  // רץ כל דקה (אפשר לשנות ל-EVERY_5_MINUTES אם תרצה)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronForEndedGroups() {
    await this.processEndedGroups();
  }

  // משתמש מצטרף לקבוצה
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

    // עדכון סטייט לפי ההתקדמות
    this.updateStatusOnJoin(group);

    // טריגרים של 70% / 95% / 12 שעות
    this.handleThresholdTriggers(group);

    return this.groupRepository.save(group);
  }

  // מחשב אחוז התקדמות
  private computeProgress(joinedCount: number, minParticipants: number): number {
    if (minParticipants <= 0) return 0;
    const raw = (joinedCount / minParticipants) * 100;
    return Math.min(100, Math.round(raw * 100) / 100); // עיגול ל־2 ספרות אחרי הנקודה
  }

  // לוגיקה של סטייטים על הצטרפות
  private updateStatusOnJoin(group: Group) {
    // לדוגמה: אם הגענו ל־100% – ננעל את הקבוצה (לא מצרפים עוד)
    if (group.progress >= 100 && group.status === GroupStatus.OPEN) {
      group.status = GroupStatus.LOCKED;
    }
  }

  // טריגרים: 70%, 95% ו-12 שעות לפני סיום
  private handleThresholdTriggers(group: Group) {
    // 70%
    if (!group.notified70 && group.progress >= 70) {
      group.notified70 = true;
      // TODO: לקרוא ל-Notifications Service / לשים הודעה בתור
      // this.notificationsService.groupReached70Percent(group);
    }

    // 95%
    if (!group.notified95 && group.progress >= 95) {
      group.notified95 = true;
      // TODO: this.notificationsService.groupReached95Percent(group);
    }

    // 12 שעות לפני סיום
    const now = new Date();
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    const timeToEnd = group.endsAt.getTime() - now.getTime();

    if (!group.notifiedLast12h && timeToEnd <= twelveHoursMs && timeToEnd > 0) {
      group.notifiedLast12h = true;
      // TODO: this.notificationsService.groupLast12Hours(group);
    }
  }

  async processEndedGroups(): Promise<void> {
    const now = new Date();

    const groups = await this.groupRepository.find({
      where: {
        endsAt: LessThan(now),
        status: MoreThan(GroupStatus.FAILED) ? undefined : GroupStatus.OPEN, // נעדכן את כל ה-OPEN/LOCKED
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
}
