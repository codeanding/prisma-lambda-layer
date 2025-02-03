#!/bin/sh

set -e
LAYERS_DIR="layers"
PRISMA_LAYER="$LAYERS_DIR/prisma-layer"
NODEJS_PATH="$PRISMA_LAYER/nodejs"

echo "🧹 Cleaning previous layer directory..."
rm -rf "$PRISMA_LAYER"
mkdir -p "$NODEJS_PATH/prisma"

echo "📋 Creating specific package.json for layer..."
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

echo "📝 Copying schema.prisma to layer..."
cp prisma/schema.prisma "$NODEJS_PATH/prisma/"

echo "📦 Installing dependencies in layer..."
cd "$NODEJS_PATH"

# install dependencies
yarn install
echo "⚙️ Generating Prisma client in layer..."
NODE_ENV=development yarn prisma generate

echo "🧹 Cleaning devDependencies..."
yarn install --production

echo "📁 Verifying directory structure..."
mkdir -p node_modules/.prisma/client

echo "🗜️ Creating layer ZIP file..."
cd ..
zip -r "../prisma-layer.zip" nodejs/

echo "↩️ Returning to main directory..."
cd ../../

echo "✅ Prisma layer successfully prepared"