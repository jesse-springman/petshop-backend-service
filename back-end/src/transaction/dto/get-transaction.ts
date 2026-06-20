import { IsString, IsOptional } from 'class-validator';

export class GetTransactionDto {
  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;
}
