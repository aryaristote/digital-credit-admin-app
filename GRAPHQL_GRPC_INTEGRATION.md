# GraphQL & gRPC Integration

Complete guide for GraphQL and gRPC API integration in both applications.

---

## 🎯 Overview

Both applications now support **multiple API protocols**:

- ✅ **REST API** (Primary - existing)
- ✅ **GraphQL API** (Query language)
- ✅ **gRPC API** (High-performance RPC)

---

## 📊 GraphQL Integration

### What is GraphQL?

GraphQL is a query language for APIs that allows clients to request exactly the data they need.

**Benefits**:

- Fetch multiple resources in a single request
- Client specifies exact fields needed
- Strongly typed schema
- Interactive playground for testing

### Setup

**Location**: `client-app/backend/src/modules/graphql/`

**Dependencies**:

```bash
npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
```

### Schema Definitions

GraphQL schemas are defined using decorators:

**User Schema** (`schemas/user.schema.ts`):

```typescript
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;
  // ...
}
```

### Resolvers

Resolvers handle GraphQL queries and mutations:

**Users Resolver** (`resolvers/users.resolver.ts`):

```typescript
@Resolver(() => User)
export class UsersResolver {
  @Query(() => User, { name: "user" })
  async getUser(@Args("id") id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
```

### GraphQL Endpoints

- **Playground**: `http://localhost:3001/graphql`
- **Endpoint**: `http://localhost:3001/graphql`

### Example Queries

#### Get User

```graphql
query {
  user(id: "123") {
    id
    email
    firstName
    lastName
    creditScore
  }
}
```

#### Get My Credits

```graphql
query {
  myCredits {
    id
    requestedAmount
    approvedAmount
    status
    createdAt
  }
}
```

#### Create Credit Request

```graphql
mutation {
  createCreditRequest(
    input: {
      requestedAmount: 10000
      termMonths: 12
      purpose: "Home improvement"
    }
  ) {
    id
    status
    interestRate
  }
}
```

#### Deposit Money

```graphql
mutation {
  deposit(input: { amount: 500, description: "Monthly savings" }) {
    id
    amount
    balanceAfter
  }
}
```

---

## 🔌 gRPC Integration

### What is gRPC?

gRPC is a high-performance RPC framework using Protocol Buffers.

**Benefits**:

- Efficient binary protocol
- Strongly typed contracts
- Streaming support
- Language agnostic

### Setup

**Location**: `client-app/backend/src/modules/grpc/`

**Dependencies**:

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

### Protocol Buffers

Proto files define service contracts:

**Credit Service** (`proto/credit.proto`):

```protobuf
service CreditService {
  rpc GetCreditDetails (GetCreditRequest) returns (CreditResponse);
  rpc CreateCreditRequest (CreateCreditRequestRequest) returns (CreditResponse);
  rpc RepayCredit (RepayCreditRequest) returns (RepayCreditResponse);
}
```

### gRPC Services

Services implement proto definitions:

**Credit gRPC Service** (`services/credit-grpc.service.ts`):

```typescript
@Injectable()
export class CreditGrpcService {
  async getCreditDetails(
    call: ServerUnaryCall<GetCreditRequest, CreditResponse>,
    callback: sendUnaryData<CreditResponse>
  ): Promise<void> {
    // Implementation
  }
}
```

### gRPC Endpoints

- **Credit Service**: `localhost:50051`
- **Savings Service**: `localhost:50052`
- **Users Service**: `localhost:50053`

---

## 🚀 Usage Examples

### GraphQL Client

**Using Apollo Client**:

```typescript
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql",
  cache: new InMemoryCache(),
});

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      creditScore
    }
  }
`;

const { data } = await client.query({
  query: GET_USER,
  variables: { id: "123" },
});
```

### gRPC Client

**Using grpc-js**:

```typescript
import * as grpc from "@grpc/grpc-js";
import { CreditServiceClient } from "./proto/credit_grpc_pb";
import { GetCreditRequest } from "./proto/credit_pb";

const client = new CreditServiceClient(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const request = new GetCreditRequest();
request.setCreditRequestId("123");
request.setUserId("456");

client.getCreditDetails(request, (error, response) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(response.toObject());
});
```

---

## 📋 Available Services

### GraphQL Queries & Mutations

#### Users

- `user(id: ID!)` - Get user by ID
- `me` - Get current user
- `createUser(input: CreateUserInput!)` - Create user
- `updateUser(input: UpdateUserInput!)` - Update user

#### Credit

- `myCredits` - Get user's credits
- `credit(id: ID!)` - Get credit details
- `createCreditRequest(input: CreateCreditRequestInput!)` - Create request
- `repayCredit(creditRequestId: ID!, input: RepayCreditInput!)` - Repay credit

#### Savings

- `savingsAccount` - Get savings account
- `transactions(limit: Int)` - Get transactions
- `deposit(input: DepositInput!)` - Deposit money
- `withdraw(input: WithdrawInput!)` - Withdraw money

### gRPC Services

#### Credit Service

- `GetCreditDetails` - Get credit details
- `GetUserCredits` - Get all user credits
- `CreateCreditRequest` - Create credit request
- `RepayCredit` - Process repayment

#### Savings Service

- `GetAccount` - Get savings account
- `GetTransactions` - Get transaction history
- `Deposit` - Process deposit
- `Withdraw` - Process withdrawal

#### Users Service

- `GetUser` - Get user by ID
- `GetUserByEmail` - Get user by email
- `UpdateUser` - Update user profile

---

## 🔧 Configuration

### GraphQL Configuration

```typescript
GraphQLModule.forRoot({
  driver: ApolloDriver,
  autoSchemaFile: "schema.gql",
  playground: true,
  introspection: true,
});
```

### gRPC Configuration

```typescript
// In main.ts
const grpcOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: "credit",
    protoPath: join(__dirname, "modules/grpc/proto/credit.proto"),
  },
};
```

---

## 📊 API Comparison

| Feature        | REST              | GraphQL        | gRPC           |
| -------------- | ----------------- | -------------- | -------------- |
| Protocol       | HTTP/JSON         | HTTP/JSON      | HTTP/2 Binary  |
| Data Fetching  | Multiple requests | Single request | Single request |
| Typing         | Weak              | Strong         | Strong         |
| Caching        | Easy              | Complex        | Built-in       |
| Performance    | Good              | Good           | Excellent      |
| Learning Curve | Low               | Medium         | Medium         |

---

## 🎯 When to Use Each

### Use REST When:

- Simple CRUD operations
- HTTP caching is important
- Team is familiar with REST
- Public API documentation needed

### Use GraphQL When:

- Frontend needs flexible queries
- Over-fetching is a concern
- Multiple resources in one request
- Real-time subscriptions needed

### Use gRPC When:

- Microservices communication
- High performance required
- Type safety critical
- Streaming needed

---

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
cd client-app/backend
npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
npm install @grpc/grpc-js @grpc/proto-loader
```

### 2. Generate Proto Files (gRPC)

```bash
# Install protoc compiler
# Then generate TypeScript files
protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --ts_out=./src/modules/grpc/proto \
  --proto_path=./src/modules/grpc/proto \
  ./src/modules/grpc/proto/*.proto
```

### 3. Start Services

```bash
# GraphQL available at /graphql
npm run start:dev

# gRPC services on ports 50051-50053
```

---

## 📚 Example Queries

### GraphQL Examples

#### Complex Query

```graphql
query {
  me {
    id
    email
    creditScore
    savingsAccount {
      balance
      accountNumber
    }
    myCredits {
      id
      requestedAmount
      status
    }
  }
}
```

#### Mutation with Variables

```graphql
mutation CreateCredit($amount: Float!, $term: Int!) {
  createCreditRequest(
    input: {
      requestedAmount: $amount
      termMonths: $term
      purpose: "Business expansion"
    }
  ) {
    id
    status
    interestRate
  }
}
```

---

## 🔍 Testing

### GraphQL Playground

Visit `http://localhost:3001/graphql` for interactive testing.

### gRPC Testing

Use tools like:

- **BloomRPC** - GUI client
- **grpcurl** - CLI client
- **Postman** - Supports gRPC

---

## 📚 Related Documentation

- [GraphQL Documentation](https://graphql.org/)
- [gRPC Documentation](https://grpc.io/)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [NestJS gRPC](https://docs.nestjs.com/microservices/grpc)

---

## ✅ Summary

Both GraphQL and gRPC are now available:

- ✅ **GraphQL API** with schema, resolvers, and playground
- ✅ **gRPC Services** with proto definitions
- ✅ **Multiple protocols** for different use cases
- ✅ **Type-safe** contracts
- ✅ **High performance** options
- ✅ **Complete documentation**

Choose the right API protocol based on your needs!
