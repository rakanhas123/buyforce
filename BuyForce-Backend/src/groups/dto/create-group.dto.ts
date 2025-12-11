import { IsString, IsInt, Min, IsISO8601 } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name!: string;

  // כמה חייבים להצטרף כדי שהקבוצה תצליח
  @IsInt()
  @Min(1)
  minParticipants!: number;

  // תאריך סיום (ISO string, למשל: "2025-12-31T23:59:00Z")
  @IsISO8601()
  endsAt!: string;
}
