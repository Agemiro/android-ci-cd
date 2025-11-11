# Google Play Store Deployment Setup Guide

This guide will walk you through setting up your Google Play Developer account and configuring automated deployment via CI/CD.

## Prerequisites

- ✅ Google account (Gmail)
- ✅ $25 USD one-time registration fee (credit/debit card)
- ✅ Valid payment method for Google Play Console
- ✅ Your app package name: `com.ionicagemiro.app` (already configured)

## Step 1: Create Google Play Developer Account

### 1.1 Register as a Developer

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Get started** or **Sign in**
3. Accept the **Developer Distribution Agreement**
4. Pay the **$25 USD one-time registration fee**
   - This is a one-time payment, not a subscription
   - Valid for life (as long as you follow policies)
5. Complete your **developer profile**:
   - Developer name (appears in Play Store)
   - Email address
   - Phone number
   - Address

**Note**: The registration process can take 1-2 business days for approval.

## Step 2: Create Your App in Play Console

### 2.1 Create New App

1. In Play Console, click **Create app**
2. Fill in the app details:
   - **App name**: Your app name (e.g., "My Ionic App")
   - **Default language**: English (or your preferred language)
   - **App or game**: Select **App**
   - **Free or paid**: Select **Free** (or Paid if applicable)
3. Click **Create app**

### 2.2 Set Up App Details

1. Go to **Store presence** → **Main store listing**
2. Fill in required information:
   - **App name**: Display name
   - **Short description**: Brief description (80 characters max)
   - **Full description**: Detailed description
   - **App icon**: Upload 512x512 PNG icon
   - **Feature graphic**: Upload 1024x500 PNG banner
   - **Screenshots**: Add at least 2 screenshots
3. Click **Save**

### 2.3 Set Package Name

1. Go to **App content** → **App access**
2. Your package name should be: `com.ionicagemiro.app`
3. Verify this matches your `capacitor.config.ts`:
   ```typescript
   appId: 'com.ionicagemiro.app';
   ```

**Important**: The package name cannot be changed after publishing!

## Step 3: Set Up API Access (Service Account)

### 3.1 Enable Google Play Android Developer API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one:
   - Click **Select a project** → **New Project**
   - Name: "Play Store Deployment" (or your choice)
   - Click **Create**
3. Enable the API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google Play Android Developer API"
   - Click on it and press **Enable**

### 3.2 Create Service Account

1. In Google Cloud Console, go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Fill in details:
   - **Service account name**: `play-store-deployer` (or your choice)
   - **Service account ID**: Auto-generated
   - **Description**: "Service account for Play Store API access"
4. Click **Create and Continue**
5. **Grant this service account access to project**:
   - Role: **Service Account User** (basic role)
   - Click **Continue**
6. Click **Done** (skip optional user access)

### 3.3 Create JSON Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create**
6. **Download the JSON file** - This is your service account key
   - ⚠️ **Keep this file secure!** Don't commit it to Git
   - You'll need this file content for GitHub Secrets

### 3.4 Link Service Account to Play Console

1. Go back to [Google Play Console](https://play.google.com/console)
2. Navigate to **Setup** → **API access**
3. Under **Service accounts**, click **Link service account**
4. Select your service account (the one you just created)
5. Click **Grant access**
6. **Grant permissions**:
   - ✅ **View app information and download bulk reports**
   - ✅ **Manage production releases**
   - ✅ **Manage testing track releases** (for internal/alpha/beta)
   - ✅ **Manage app content and pricing**
7. Click **Invite user**

**Important**: The service account email will appear in the "Users and permissions" section.

## Step 4: Configure GitHub Secret

### 4.1 Get Service Account JSON Content

1. Open the JSON file you downloaded in Step 3.3
2. Copy the **entire contents** of the file
   - It should look like:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
     ...
   }
   ```

### 4.2 Add Secret to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Fill in:
   - **Name**: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
   - **Secret**: Paste the entire JSON file content
5. Click **Add secret**

**Note**: The secret name must match exactly: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

## Step 5: Configure App Signing (Required for Release)

### 5.1 Generate Upload Key (First Time Only)

You need to sign your app for Play Store. For the first release:

1. **Option A: Let Google manage signing** (Recommended)

   - Google will generate and manage your signing key
   - Go to **Setup** → **App signing**
   - Follow the prompts to enable Google Play App Signing

2. **Option B: Use your own key** (Advanced)
   - Generate a keystore:
     ```bash
     keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
     ```
   - Configure in `android/app/build.gradle`

### 5.2 Configure Build for Release

Your workflow already builds a release AAB. Make sure your `android/app/build.gradle` is configured:

```gradle
android {
    signingConfigs {
        release {
            // Your signing config
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ...
        }
    }
}
```

## Step 6: Test the Deployment

### 6.1 Manual Test (First Time)

1. **Create a test release**:

   - Go to **Testing** → **Internal testing** in Play Console
   - Click **Create new release**
   - Upload your AAB manually to verify everything works

2. **Test the CI/CD**:
   - Push to `main` branch, OR
   - Go to **Actions** → **CI/CD Pipeline** → **Run workflow**
   - Select **Deploy to Play Store**: `true`
   - Click **Run workflow**

### 6.2 Verify Deployment

1. Check GitHub Actions:

   - Go to **Actions** tab
   - Find the workflow run
   - Verify "Deploy to Play Store" step succeeded

2. Check Play Console:
   - Go to **Testing** → **Internal testing**
   - You should see a new release
   - Status should be "Available to testers"

## Step 7: Release Tracks

Your workflow deploys to **Internal testing** track. You can also deploy to:

- **Internal testing**: Quick testing with up to 100 testers
- **Closed testing (Alpha)**: Limited group of testers
- **Closed testing (Beta)**: Larger group of testers
- **Open testing**: Public beta
- **Production**: Public release

To change the track, edit `.github/workflows/ci-cd.yml`:

```yaml
track: internal # Change to: alpha, beta, production
```

## Troubleshooting

### "Service account doesn't have permission"

**Solution**:

1. Go to Play Console → **Setup** → **API access**
2. Click on your service account
3. Ensure it has "Manage testing track releases" permission

### "Package name mismatch"

**Solution**:

- Verify `capacitor.config.ts` has: `appId: 'com.ionicagemiro.app'`
- Verify Play Console app uses the same package name
- Package name cannot be changed after first release

### "App not found"

**Solution**:

- Make sure you've created the app in Play Console first
- Verify the package name matches exactly

### "Invalid service account JSON"

**Solution**:

- Re-download the JSON key from Google Cloud Console
- Make sure you copied the entire file content
- Verify no extra spaces or line breaks

### "Build failed - signing error"

**Solution**:

- Enable Google Play App Signing in Play Console
- Or configure your own signing key in `build.gradle`

## Cost Summary

| Item                               | Cost                                             |
| ---------------------------------- | ------------------------------------------------ |
| Google Play Developer Registration | $25 USD (one-time)                               |
| API Access                         | Free                                             |
| App Publishing                     | Free                                             |
| CI/CD (GitHub Actions)             | Free (public repos) or 2,000 min/month (private) |

## Security Best Practices

1. ✅ **Never commit** the service account JSON to Git
2. ✅ **Use GitHub Secrets** for sensitive data
3. ✅ **Rotate keys** periodically (every 6-12 months)
4. ✅ **Limit permissions** - Only grant necessary permissions
5. ✅ **Monitor access** - Review service account usage regularly

## Next Steps

1. ✅ Complete Play Store registration
2. ✅ Create your app in Play Console
3. ✅ Set up service account and API access
4. ✅ Add GitHub secret
5. ✅ Test deployment manually first
6. ✅ Enable automated deployment via CI/CD

## Additional Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Google Play Android Developer API](https://developers.google.com/android-publisher)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Quick Reference

**Package Name**: `com.ionicagemiro.app`  
**GitHub Secret Name**: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`  
**Deployment Track**: `internal` (configurable)  
**Workflow Trigger**: Push to `main` or manual dispatch

---

**Ready to deploy?** Once you complete Steps 1-4, your CI/CD pipeline will automatically deploy to Play Store when you push to `main` branch! 🚀
