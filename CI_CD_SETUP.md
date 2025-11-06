# CI/CD Setup Guide

This guide will help you set up the CI/CD pipeline for automated testing, building, and deployment to Google Play Store.

## Prerequisites

1. A GitHub repository for your project
2. A Google Play Console account
3. A Google Cloud Platform account

## Step 1: Google Play Console Setup

### 1.1 Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Play Android Developer API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Play Android Developer API"
   - Click "Enable"

### 1.2 Create Service Account

1. Navigate to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details:
   - **Name**: `github-actions-play-store`
   - **Description**: `Service account for GitHub Actions Play Store deployment`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### 1.3 Create JSON Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select **JSON** format
5. Click "Create"
6. **Save the downloaded JSON file securely** (you'll need it in the next step)

### 1.4 Link Service Account to Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app (or create one if you haven't)
3. Navigate to "Setup" > "API access"
4. Under "Service accounts", click "Link service account"
5. Enter the service account email (found in the JSON file: `client_email`)
6. Grant the following permissions:
   - ✅ **View app information and download bulk reports**
   - ✅ **Manage production releases**
   - ✅ **Manage testing track releases** (required for internal testing)
   - ✅ **Manage store listing**
7. Click "Invite user"

## Step 2: GitHub Secrets Configuration

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secret:

   **Name**: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

   **Value**: Open the JSON file you downloaded in Step 1.3 and copy its **entire contents** (including all curly braces)

5. Click **Add secret**

## Step 3: Update App Configuration

### 3.1 Update Package Name (if needed)

If your app package name differs from `com.ionic.app`, update it in:

- `capacitor.config.ts`: Update `appId`
- `.github/workflows/ci-cd.yml`: Update `packageName` in the deploy step
- `android/app/build.gradle`: Update `applicationId`

### 3.2 Update Release Notes

Edit `release-notes/en-US.txt` with your app's release notes. This will be used when deploying to Play Store.

## Step 4: Test the Pipeline

### 4.1 Test Locally

Before pushing to GitHub, test the build process locally:

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Run tests
npm run test:ci

# Build the app
npm run build:prod

# Build Android
npm run android:build:release
```

### 4.2 Test on GitHub

1. Commit and push your changes:

   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

2. Go to your GitHub repository
3. Click on the **Actions** tab
4. You should see the workflow running
5. Monitor the progress and check for any errors

## Step 5: Deploy to Play Store

### 5.1 Automatic Deployment

The pipeline automatically deploys to Play Store when:

- Code is pushed to the `main` branch
- All tests pass
- Build is successful

### 5.2 Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**
4. Check **Deploy to Play Store**
5. Click **Run workflow**

### 5.3 Deployment Tracks

The pipeline deploys to the **Internal Testing** track by default. To change this:

1. Edit `.github/workflows/ci-cd.yml`
2. Find the `deploy-playstore` job
3. Change the `track` parameter:
   - `internal` - Internal testing
   - `alpha` - Alpha testing
   - `beta` - Beta testing
   - `production` - Production (use with caution!)

## Troubleshooting

### Build Failures

**Issue**: Android build fails

- **Solution**: Check that all dependencies are correctly installed
- Verify Java version (should be 17)
- Check Android SDK is properly configured

### Test Failures

**Issue**: Unit tests fail

- **Solution**: Run tests locally with `npm run test:ci`
- Check test files for errors
- Verify all dependencies are installed

**Issue**: Instrumentation tests fail

- **Solution**: Check that emulator is properly configured
- Verify test files are in `android/app/src/androidTest/`
- Check that package name matches in test files

### Deployment Failures

**Issue**: Play Store deployment fails with authentication error

- **Solution**:
  - Verify `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` secret is correctly set
  - Check that service account has proper permissions in Play Console
  - Ensure the JSON content is complete (no truncation)

**Issue**: Package name mismatch

- **Solution**:
  - Verify package name in `capacitor.config.ts` matches Play Console
  - Check `applicationId` in `android/app/build.gradle`
  - Update `packageName` in workflow file if needed

### Coverage Reports

**Issue**: Coverage not showing in Codecov

- **Solution**:
  - Connect your repository to Codecov
  - Verify coverage files are being generated
  - Check that `coverage/` directory is not in `.gitignore`

## Advanced Configuration

### Custom Test Commands

You can customize test commands in `package.json`:

```json
{
  "scripts": {
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage",
    "test:e2e": "your-e2e-test-command"
  }
}
```

### Multiple Deployment Tracks

To deploy to multiple tracks, you can modify the workflow to create separate jobs or use matrix strategy.

### Code Signing

For production releases, you'll need to configure code signing:

1. Generate a keystore file
2. Add keystore to GitHub Secrets
3. Update `android/app/build.gradle` to use the keystore
4. Update workflow to use the keystore for signing

## Support

For issues or questions:

- Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review the [Play Console API documentation](https://developers.google.com/android-publisher)
- Check workflow logs in the Actions tab for detailed error messages
