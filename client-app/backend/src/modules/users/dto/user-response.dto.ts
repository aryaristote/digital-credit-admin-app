import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from '@common/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  dateOfBirth: Date;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  city: string;

  @ApiProperty()
  @Expose()
  country: string;

  @ApiProperty()
  @Expose()
  postalCode: string;

  @ApiProperty({ enum: UserRole })
  @Expose()
  role: UserRole;

  @ApiProperty()
  @Expose()
  isEmailVerified: boolean;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  creditScore: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

