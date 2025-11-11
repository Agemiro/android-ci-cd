# Ionic Angular Capacitor App

A simple project with Angular, Ionic, and Capacitor for building cross-platform mobile applications with comprehensive CI/CD pipeline.

## Project Structure

- **Angular**: Frontend framework
- **Ionic**: UI component library for mobile apps
- **Capacitor**: Native runtime for building native mobile apps
- **GitHub Actions**: Automated CI/CD pipeline for testing, building, and deployment

## Prerequisites

- Node.js (v20.19+ or v22.12+ recommended for Angular 20)
- npm or yarn
- Android Studio (for Android development)

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Development

### Run the app in the browser

```bash
npm start
```

The app will be available at `http://localhost:4200`

### Build the app

```bash
npm run build
```

This will create a production build in the `www` directory.

## Capacitor Commands

### Sync web assets to native platforms

```bash
npm run cap:sync
```

This copies the web assets and updates native dependencies.

### Add a native platform

```bash
npm run cap:add android
npm run cap:add ios
```

### Open in native IDE

```bash
npm run cap:open android
npm run cap:open ios
```

### Run on a device/emulator

```bash
npm run cap:run android
npm run cap:run ios
```

## Android Development

The Android platform has been added and configured. To work with Android:

1. Build your web app:

   ```bash
   npm run build
   ```

2. Sync with Capacitor:

   ```bash
   npm run cap:sync
   ```

3. Open in Android Studio:

   ```bash
   npm run cap:open android
   ```

4. Run the app from Android Studio or using:
   ```bash
   npm run cap:run android
   ```

## Configuration

- **Capacitor Config**: `capacitor.config.ts`
- **Ionic Config**: `ionic.config.json`
- **Angular Config**: `angular.json`

## CI/CD Pipeline

This project includes a comprehensive GitHub Actions CI/CD pipeline that automates:

- **Linting**: Code quality checks with ESLint
- **Unit Testing**: Jasmine/Karma tests with code coverage
- **Static Code Analysis**: TypeScript type checking and security audits
- **Build**: Production builds for Angular and Android (APK/AAB)
- **Instrumentation Tests**: Android Espresso tests on multiple API levels
- **Functional Tests**: End-to-end testing with Appium
- **Play Store Deployment**: Automated deployment to Google Play Store

### Pipeline Workflow

The CI/CD pipeline runs automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch (with option to deploy to Play Store)

See [`.github/workflows/README.md`](.github/workflows/README.md) for detailed documentation.

### Setting Up CI/CD

1. **Configure GitHub Secrets**:

   - Add `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` secret with your Google Play service account JSON
   - See [CI/CD Documentation](.github/workflows/README.md) for detailed setup instructions

2. **Enable Codecov** (optional):

   - Connect your repository to [Codecov](https://codecov.io/)
   - Coverage reports will be automatically uploaded

3. **Test the Pipeline**:
   - Push code to trigger the pipeline
   - Check the "Actions" tab in GitHub to view pipeline status

## Notes

- The web assets directory is `www` (configured in `capacitor.config.ts`)
- App ID: `com.ionicagemiro.app`
- App Name: `ionic-app`

You can modify these in `capacitor.config.ts` if needed.

## Scripts Reference

### Development

- `npm start` - Start development server
- `npm run build` - Build for development
- `npm run build:prod` - Build for production

### Testing

- `npm test` - Run unit tests in watch mode
- `npm run test:ci` - Run unit tests for CI (headless, with coverage)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - TypeScript type checking

### Android

- `npm run android:build` - Build debug APK
- `npm run android:build:release` - Build release AAB
- `npm run android:test` - Run instrumentation tests
