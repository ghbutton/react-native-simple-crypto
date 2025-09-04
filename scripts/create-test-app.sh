#!/bin/bash

# Create E2E Test App for react-native-simple-crypto
# This script creates a complete test app setup

echo "🚀 Creating E2E Test App for react-native-simple-crypto..."

# Step 1: Create React Native project
echo "📱 Creating React Native project..."
npx @react-native-community/cli@latest init CryptoTestApp --skip-install

# Step 2: Navigate to project
cd CryptoTestApp

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
npm install
npm install ../
npm install base64-js hex-lite

# Step 4: Create Metro config
echo "⚙️  Configuring Metro bundler..."
cat > metro.config.js << 'EOF'
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
      'react-native-simple-crypto': require('path').resolve(__dirname, '../'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
EOF

# Step 5: Install iOS dependencies
echo "🍎 Installing iOS dependencies..."
cd ios
bundle install
bundle exec pod install
cd ..

echo "✅ Test app setup complete!"
echo ""
echo "To run the test app:"
echo "  npm run ios     # Run on iOS simulator"
echo "  npm run android # Run on Android emulator"
echo ""
echo "Note: You'll need to replace App.tsx with the test app component."
echo "See the test-app/src/App.tsx file in the main repository."
