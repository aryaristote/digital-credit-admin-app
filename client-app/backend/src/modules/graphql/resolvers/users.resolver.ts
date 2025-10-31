import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User, CreateUserInput, UpdateUserInput } from '../schemas/user.schema';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  async getUser(@Args('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser('id') userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.create(input);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser('id') userId: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(userId, input);
  }
}
