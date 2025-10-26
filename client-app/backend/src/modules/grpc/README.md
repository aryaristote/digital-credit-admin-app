# gRPC Module

gRPC API implementation for microservices communication.

## Setup

1. Install dependencies:

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

2. Generate TypeScript from proto files:

```bash
protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --ts_out=./src/modules/grpc/proto \
  --proto_path=./src/modules/grpc/proto \
  ./src/modules/grpc/proto/*.proto
```

## Available Services

- **Credit Service**: Port 50051
- **Savings Service**: Port 50052
- **Users Service**: Port 50053

## Testing

Use tools like:

- **BloomRPC** - GUI client
- **grpcurl** - CLI client
- **Postman** - Supports gRPC
