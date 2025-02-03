#!/bin/sh

set -e  # Stop script if there's an error

echo "🧹 Cleaning previous directories..."
rm -rf dist
rm -rf layers/prisma-layer/nodejs/node_modules

echo "📦 Installing project dependencies..."
yarn install

echo "🔄 Running prisma generate for main project..."
npx prisma generate

echo "🔄 Preparing Layers..."
sh $(dirname "$0")/prisma-layers.sh

echo "🔨 Compiling TypeScript code..."
yarn build

echo "📦 Building with AWS SAM..."
sam build --use-container

echo "🚀 Deploying to AWS..."
sam deploy --profile codeanding \
  --template-file template.yml \
  --s3-bucket codeanding \
  --stack-name sample-api \
  --capabilities CAPABILITY_IAM \
  --no-confirm-changeset

echo "✅ Deployment successfully completed."