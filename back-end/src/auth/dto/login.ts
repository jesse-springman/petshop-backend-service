import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'João Pedro',
    description: 'Nome do funcionário',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha definida pelo funcionário',
  })
  @IsString()
  password!: string;
}
