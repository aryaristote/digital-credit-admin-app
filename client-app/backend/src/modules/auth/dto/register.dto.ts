import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {
  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password confirmation',
  })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
