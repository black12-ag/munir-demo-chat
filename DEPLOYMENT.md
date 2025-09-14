# Deployment Guide - Munir Demo Chat App

This guide covers deploying the chat application to various platforms and hosting services.

## 🌐 Web Deployment

### Build the Web Version
```bash
npm run build:web
```
This creates optimized static files in the `dist/` folder.

### Deployment Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```
Or connect your GitHub repository to Vercel for automatic deployments.

#### 2. Netlify
1. Build the project: `npm run build:web`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repo for automatic deployments

#### 3. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build:web"
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### 4. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Set public directory to 'dist'
# Deploy
firebase deploy
```

#### 5. AWS S3 + CloudFront
```bash
# Build the project
npm run build:web

# Upload dist folder to S3 bucket
aws s3 sync dist/ s3://your-bucket-name

# Set up CloudFront distribution pointing to S3
```

## 📱 Mobile Deployment

### Prerequisites
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g @expo/eas-cli`

### Android Deployment

#### Option 1: EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview

# Build for Play Store
eas build --platform android --profile production
```

#### Option 2: Local Build
```bash
# Build locally (requires Android SDK)
expo build:android

# For APK
expo build:android --type apk

# For App Bundle (Play Store)
expo build:android --type app-bundle
```

### iOS Deployment

#### EAS Build (Requires Apple Developer Account)
```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production

# Build for development
eas build --platform ios --profile development
```

#### Local Build
```bash
# Requires Xcode and Apple Developer account
expo build:ios
```

## 🚀 Environment Configuration

### Environment Variables
Create `.env` file for environment-specific settings:
```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_WS_URL=wss://your-websocket.com

# App Configuration
EXPO_PUBLIC_APP_NAME=Munir Demo
EXPO_PUBLIC_VERSION=1.0.0

# Feature Flags
EXPO_PUBLIC_ENABLE_CALLING=true
EXPO_PUBLIC_ENABLE_MEDIA_SHARING=true
```

### Production Build Settings
Update `app.json` for production:
```json
{
  "expo": {
    "name": "Munir Demo",
    "slug": "munir-demo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#101d23"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.munir.demo"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#101d23"
      },
      "package": "com.munir.demo"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "name": "Munir Demo - Chat App",
      "shortName": "Munir Demo",
      "themeColor": "#0da6f2",
      "backgroundColor": "#101d23"
    }
  }
}
```

## 🔧 Build Scripts Reference

### Development
```bash
npm start          # Start Expo development server
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
npm run web        # Start web development server
```

### Production Builds
```bash
npm run build:web      # Build optimized web version
npm run build:android  # Build Android APK/AAB
npm run build:ios      # Build iOS IPA
```

### Deployment
```bash
npm run deploy:web     # Build and serve web version locally
npm run deploy         # Alias for build:web
```

## 📊 Performance Optimization

### Web Performance
- Static assets are automatically optimized
- Code splitting is handled by Metro bundler
- Fonts and images are properly cached
- PWA features enabled for offline support

### Mobile Performance
- Images are automatically optimized for different screen densities
- Bundle size is minimized through tree shaking
- Native modules are only loaded when needed

## 🔒 Security Considerations

### API Security
- Use HTTPS endpoints in production
- Implement proper authentication
- Sanitize user inputs
- Use environment variables for sensitive data

### Mobile Security
- Enable code obfuscation for production builds
- Use secure storage for sensitive data
- Implement certificate pinning for API calls
- Regular security audits

## 📈 Monitoring & Analytics

### Recommended Tools
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior tracking
- **Firebase Crashlytics**: Crash reporting
- **Expo Analytics**: Built-in usage analytics

## 🚨 Troubleshooting

### Common Issues

#### Web Build Issues
- **Metro bundler errors**: Clear cache with `npx expo start --clear`
- **Missing dependencies**: Run `npm install` or `yarn install`
- **Asset loading issues**: Check file paths and extensions

#### Mobile Build Issues
- **Certificate issues**: Update Expo CLI and certificates
- **Memory issues**: Increase Node.js memory limit
- **Platform-specific issues**: Check platform requirements

### Support
For deployment issues, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Web Documentation](https://necolas.github.io/react-native-web/)
- Platform-specific hosting provider documentation

---

*This deployment guide covers the most common deployment scenarios. For specific use cases or custom requirements, consult the respective platform documentation.*