# CI/CD Pipeline Documentation

This directory contains GitHub Actions workflows for automated testing, building, and deployment.

## Workflow: `ci-cd.yml`

This comprehensive CI/CD pipeline includes the following stages:

### 1. Lint

- Runs ESLint to check code quality and style
- Ensures code follows project standards

### 2. Unit Tests

- Executes Jasmine/Karma unit tests
- Generates code coverage reports
- Uploads coverage to Codecov.

### 3. Static Code Analysis

- Runs ESLint with detailed reporting
- Performs TypeScript type checking
- Checks for security vulnerabilities with npm audit.

### 4. Build

- Builds Angular application for production
- Compiles Android APK (debug) and AAB (release)
- Uploads build artifacts

### 5. Instrumentation Tests

- Runs Android Espresso tests on multiple API levels (29, 33)
- Tests on Android emulators
- Uploads test results

### 6. Functional Tests

- Performs end-to-end functional testing
- Uses Appium for mobile automation
- Validates app installation and basic functionality

### 7. Deploy to Play Store

- Deploys to Google Play Store Internal Testing track
- Only runs on main branch pushes or manual workflow dispatch
- Creates GitHub releases for tags

## Required Secrets

To use this workflow, you need to configure the following secrets in your GitHub repository:

### `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

A JSON service account key for Google Play Console API access.

**How to set it up:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google Play Android Developer API"
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and description
   - Grant it the "Service Account User" role
5. Create a JSON key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select JSON format
   - Download the JSON file
6. Link the service account to Google Play Console:
   - Go to [Google Play Console](https://play.google.com/console/)
   - Navigate to "Setup" > "API access"
   - Click "Link service account"
   - Select your service account
   - Grant necessary permissions (at minimum: "Release apps to testing tracks")
7. Add the JSON content to GitHub Secrets:
   - Go to your GitHub repository
   - Navigate to "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
   - Value: Paste the entire contents of the downloaded JSON file

## Workflow Triggers

- **Push to main/develop**: Runs all stages except deployment
- **Pull Request to main/develop**: Runs lint, tests, and static analysis
- **Manual workflow dispatch**: Can trigger deployment with option to deploy to Play Store

## Artifacts

The workflow generates the following artifacts:

- `app-debug-apk`: Debug APK for testing
- `app-release-aab`: Release App Bundle for Play Store
- `eslint-report`: ESLint analysis results
- `instrumentation-test-results-api-*`: Test results for each API level

## Local Testing

You can run the same checks locally:

```bash
# Lint
npm run lint

# Unit tests
npm run test:ci

# Type checking
npm run type-check

# Build
npm run build:prod

# Android build
npm run android:build
npm run android:build:release

# Android tests
npm run android:test
```

## Troubleshooting

### Build failures

- Ensure Node.js version matches (20.x)
- Check that all dependencies are installed
- Verify Android SDK is properly configured

### Test failures

- Check that test files are properly configured
- Verify emulator/device is available for instrumentation tests
- Review test logs in workflow artifacts

### Deployment failures

- Verify `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` secret is correctly set
- Check that the service account has proper permissions
- Ensure the package name matches in `capacitor.config.ts` and Play Console
