const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Configure asset extensions for web
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'
];

// Configure source extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'web.js', 'web.ts', 'web.tsx'
];

module.exports = config;