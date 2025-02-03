# Prisma as a Layer in AWS Lambda using AWS SAM

## Overview

This project demonstrates how to use **Prisma** as a layer in **AWS Lambda** with **AWS Serverless Application Model (SAM)**. By leveraging AWS Lambda Layers, we can optimize function deployment, reduce package size, and ensure a consistent Prisma ORM setup across multiple functions.

## Project Setup

### Prerequisites

- AWS Account
- AWS CLI configured
- AWS SAM installed
- Node.js 18+ installed (recommended: use `.nvmrc` with `18`)
- Yarn (preferred package manager)

### Folder Structure

```
| prisma-lambda-layer
|- layers/  # Contains the Prisma layer
|- scripts/  # Deployment and setup scripts
|- src/  # Lambda function handlers
|-- handlers/
|-- services/
```

### Installing Dependencies

Add the necessary dependencies:

```bash
yarn add @prisma/client aws-lambda
yarn add --dev @types/aws-lambda @types/node prisma typescript
```

### Prisma Configuration

Modify `prisma/schema.prisma` to support AWS Lambda:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x", "linux-arm64-openssl-1.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Building and Deploying

### Preparing the Prisma Layer

Execute the setup script to create the Prisma layer:

```bash
sh scripts/prisma-layer.sh
```

### Deploying with AWS SAM

Run the following command to deploy:

```bash
sh scripts/deploy.sh
```

This will:

1. Install dependencies.
2. Generate the Prisma client.
3. Build the SAM project.
4. Deploy the stack to AWS.

## Testing the API

Once deployed, test the API using **Postman** or **cURL**.

### Create a Country (POST)

```bash
curl -X POST "<API_URL>/v1/countries" \
     -H "Content-Type: application/json" \
     -d '{"name": "Japan"}'
```

### Get All Countries (GET)

```bash
curl -X GET "<API_URL>/v1/countries"
```

### Get a Country by ID (GET)

```bash
curl -X GET "<API_URL>/v1/countries/1"
```

## Cleaning up Resources

To remove all AWS resources, run:

```bash
sam delete --stack-name sample-api --profile codeanding
```

## Next Steps

- Explore **Terraform** as an alternative to AWS SAM.
- Implement API Gateway authentication.
- Optimize cold start performance by tuning Lambda configurations.

## License

This project is licensed under the MIT License.

---

🚀 **Happy coding!**

If you find this useful, feel free to contribute or reach out for improvements.
