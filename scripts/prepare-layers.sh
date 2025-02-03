#!/bin/sh

set -e  # Detener el script si hay un error

LAYERS_DIR="layers"
PRISMA_LAYER="$LAYERS_DIR/prisma-layer"
NODEJS_PATH="$PRISMA_LAYER/nodejs"

echo "🧹 Limpiando directorio del layer anterior..."
rm -rf "$PRISMA_LAYER"
mkdir -p "$NODEJS_PATH/prisma"

echo "📋 Creando package.json específico para el layer..."
cat > "$NODEJS_PATH/package.json" << EOF
{
  "name": "prisma-layer",
  "version": "1.0.0",
  "dependencies": {
    "@prisma/client": "6.3.0"
  },
  "devDependencies": {
    "prisma": "6.3.0"
  }
}
EOF

echo "📝 Copiando schema.prisma al layer..."
cp prisma/schema.prisma "$NODEJS_PATH/prisma/"

echo "📦 Instalando dependencias en el layer..."
cd "$NODEJS_PATH"

# Instalar todas las dependencias primero (incluyendo devDependencies)
yarn install

echo "⚙️ Generando cliente Prisma en el layer..."
NODE_ENV=development yarn prisma generate

echo "🧹 Limpiando devDependencies..."
yarn install --production

echo "📁 Verificando estructura de directorios..."
mkdir -p node_modules/.prisma/client

echo "🗜️ Creando archivo ZIP del layer..."
cd ..
zip -r "../prisma-layer.zip" nodejs/

echo "↩️ Volviendo al directorio principal..."
cd ../../

echo "✅ Layer de Prisma preparado exitosamente"