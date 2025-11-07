# Play Store Deployment Checklist

Use this checklist to track your progress setting up Play Store deployment.

## Phase 1: Account Setup

- [ ] Create Google account (if you don't have one)
- [ ] Go to [Google Play Console](https://play.google.com/console)
- [ ] Pay $25 USD registration fee
- [ ] Complete developer profile
- [ ] Wait for account approval (1-2 business days)

## Phase 2: App Creation

- [ ] Create new app in Play Console
- [ ] Set app name and details
- [ ] Verify package name: `com.ionicagemiro.app`
- [ ] Upload app icon (512x512 PNG)
- [ ] Upload feature graphic (1024x500 PNG)
- [ ] Add at least 2 screenshots
- [ ] Complete store listing information

## Phase 3: API Access Setup

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project (or select existing)
- [ ] Enable "Google Play Android Developer API"
- [ ] Create service account
- [ ] Download JSON key file
- [ ] Link service account to Play Console
- [ ] Grant permissions:
  - [ ] View app information
  - [ ] Manage production releases
  - [ ] Manage testing track releases

## Phase 4: GitHub Configuration

- [ ] Open downloaded JSON key file
- [ ] Copy entire file content
- [ ] Go to GitHub repository → Settings → Secrets
- [ ] Create new secret: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
- [ ] Paste JSON content
- [ ] Save secret

## Phase 5: App Signing

- [ ] Go to Play Console → Setup → App signing
- [ ] Enable Google Play App Signing (recommended)
- [ ] OR configure your own signing key in `build.gradle`

## Phase 6: Testing

- [ ] Build release AAB locally:
  ```bash
  npm run build:prod
  cd android
  ./gradlew bundleRelease
  ```
- [ ] Manually upload AAB to Play Console (Internal testing)
- [ ] Verify app appears in Play Console
- [ ] Test CI/CD deployment:
  - [ ] Push to `main` branch, OR
  - [ ] Run workflow manually with "Deploy to Play Store" enabled
- [ ] Verify deployment in Play Console

## Phase 7: First Release

- [ ] All tests pass ✅
- [ ] App is ready for testing
- [ ] Internal testing release is live
- [ ] Testers can download and test
- [ ] Ready for production release (when ready)

## Quick Commands

```bash
# Build for Play Store
npm run build:prod
cd android
./gradlew bundleRelease

# AAB location
android/app/build/outputs/bundle/release/app-release.aab
```

## Important Notes

- ⚠️ Package name `com.ionicagemiro.app` cannot be changed after first release
- ⚠️ Keep JSON key secure - never commit to Git
- ⚠️ Service account needs proper permissions
- ✅ First deployment may take longer (Google processing)

## Support

If you encounter issues:

1. Check [PLAY_STORE_SETUP.md](./PLAY_STORE_SETUP.md) for detailed steps
2. Review Play Console error messages
3. Check GitHub Actions logs
4. Verify service account permissions

---

**Estimated Time**: 2-3 hours (excluding account approval wait time)
