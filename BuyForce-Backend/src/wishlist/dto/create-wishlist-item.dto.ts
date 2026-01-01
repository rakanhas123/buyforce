import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateWishlistItemDto {
  @IsUUID()
  userId!: string;

  @IsString()
  productId!: string;

  @IsString()
  @IsOptional()
  productName?: string;
}
