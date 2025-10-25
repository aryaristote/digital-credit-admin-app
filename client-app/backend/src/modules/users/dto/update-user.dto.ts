import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

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

