import { IsInt, IsISO8601, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  minParticipants!: number;

  @IsISO8601()
  endsAt!: string;
}
