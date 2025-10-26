import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersResolver } from './resolvers/users.resolver';
import { CreditResolver } from './resolvers/credit.resolver';
import { SavingsResolver } from './resolvers/savings.resolver';
import { UsersModule } from '../users/users.module';
import { CreditModule } from '../credit/credit.module';
import { SavingsModule } from '../savings/savings.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    UsersModule,
    CreditModule,
    SavingsModule,
  ],
  providers: [UsersResolver, CreditResolver, SavingsResolver],
})
export class GraphQLModule {}
