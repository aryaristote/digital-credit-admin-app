import { Injectable, Logger } from '@nestjs/common';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import { UsersService } from '../../users/users.service';
import {
  UserResponse,
  GetUserRequest,
  GetUserByEmailRequest,
  UpdateUserRequest,
} from '../proto/users.pb';

@Injectable()
export class UsersGrpcService {
  private readonly logger = new Logger(UsersGrpcService.name);

  constructor(private readonly usersService: UsersService) {}

  async getUser(
    call: ServerUnaryCall<GetUserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): Promise<void> {
    try {
      const { user_id } = call.request;
      const user = await this.usersService.findOne(user_id);

      callback(null, {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phoneNumber || '',
        credit_score: user.creditScore,
        is_active: user.isActive,
      });
    } catch (error) {
      this.logger.error(`gRPC GetUser error: ${error.message}`);
      callback(error, null);
    }
  }

  async getUserByEmail(
    call: ServerUnaryCall<GetUserByEmailRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): Promise<void> {
    try {
      const { email } = call.request;
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        callback(new Error('User not found'), null);
        return;
      }

      callback(null, {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phoneNumber || '',
        credit_score: user.creditScore,
        is_active: user.isActive,
      });
    } catch (error) {
      this.logger.error(`gRPC GetUserByEmail error: ${error.message}`);
      callback(error, null);
    }
  }

  async updateUser(
    call: ServerUnaryCall<UpdateUserRequest, UserResponse>,
    callback: sendUnaryData<UserResponse>,
  ): Promise<void> {
    try {
      const { user_id, first_name, last_name, phone_number } = call.request;
      const user = await this.usersService.update(user_id, {
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phone_number,
      });

      callback(null, {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phoneNumber || '',
        credit_score: user.creditScore,
        is_active: user.isActive,
      });
    } catch (error) {
      this.logger.error(`gRPC UpdateUser error: ${error.message}`);
      callback(error, null);
    }
  }
}
