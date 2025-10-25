import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'User password (min 8 characters, must include uppercase, lowercase, number, and special character)',
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must include uppercase, lowercase, number, and special character',
    },
  )
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'User date of birth',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'User address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'New York',
    description: 'User city',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'USA',
    description: 'User country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: '10001',
    description: 'User postal code',
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

