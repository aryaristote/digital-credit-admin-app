# GraphQL Module

GraphQL API implementation for the Digital Credit & Savings Platform.

## Setup

1. Install dependencies:

```bash
npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
```

2. Import the module in `app.module.ts`:

```typescript
import { GraphQLModule } from './modules/graphql/graphql.module';

@Module({
  imports: [
    // ... other modules
    GraphQLModule,
  ],
})
```

## Accessing GraphQL

- **Playground**: `http://localhost:3001/graphql`
- **Endpoint**: `http://localhost:3001/graphql`

## Example Queries

### Get User

```graphql
query {
  user(id: "123") {
    id
    email
    firstName
    creditScore
  }
}
```

### Get My Credits

```graphql
query {
  myCredits {
    id
    requestedAmount
    status
  }
}
```

### Create Credit Request

```graphql
mutation {
  createCreditRequest(input: { requestedAmount: 10000, termMonths: 12 }) {
    id
    status
  }
}
```
