#!/bin/sh

set -e  # Detener el script si hay un error

echo "🧹 Limpiando directorios anteriores..."
rm -rf dist
rm -rf layers/prisma-layer/nodejs/node_modules

echo "📦 Instalando dependencias del proyecto..."
yarn install

echo "🔄 Ejecutando prisma generate para el proyecto principal..."
npx prisma generate

echo "🔄 Preparando los Layers..."
sh $(dirname "$0")/prepare-layers.sh 

echo "🔨 Compilando el código TypeScript..."
yarn build

echo "📦 Construyendo con AWS SAM..."
sam build --use-container

echo "🚀 Desplegando en AWS..."
sam deploy --profile codeanding \
  --template-file template.yml \
  --s3-bucket codeanding \
  --stack-name sample-api \
  --capabilities CAPABILITY_IAM \
  --no-confirm-changeset

echo "✅ Despliegue completado exitosamente."