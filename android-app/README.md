# Paskle Android app

The Android app is the same web app from the repo root, packaged with [Capacitor](https://capacitorjs.com) 8. Package name: `app.lexcellent.paskle`.

Store listing text, graphics and Play Console answers are in `store-assets/LISTING.md`.

## What you need on your computer

- Node.js 22 or newer
- Android Studio (current stable), with the Android SDK it installs

## Build the app bundle (.aab) for Google Play

From this `android-app` folder:

```
npm install          # first time only
npm run sync         # copies the web app into www/ and updates the Android project
npm run open         # opens the project in Android Studio
```

In Android Studio:

1. Wait for Gradle to finish syncing.
2. **Build → Generate Signed App Bundle or APK → Android App Bundle**.
3. First time: **Create new…** keystore. Save it as `~/paskle-release.keystore`, write down both passwords, and keep a backup copy somewhere safe (e.g. Documents and a USB drive). You need this same key for every future update.
4. Choose **release**, then **Create**. The file is `android/app/release/app-release.aab`.
5. In Play Console, create the app, then upload the .aab to **Testing → Internal testing** first.

Let Play App Signing manage the app signing key (the default). Your keystore then serves as the upload key.

## Every update

1. Make the change in the web app (repo root) and push. The website updates by itself.
2. In `android/app/build.gradle`, raise `versionCode` by 1 (1 → 2 → 3…) and set `versionName` (e.g. "1.1").
3. `npm run sync`, then build a new signed bundle with the same keystore and upload it.

## Icons and splash screen

Source art is in `assets/` and is drawn by `scripts/make-art.py`. To regenerate the Android icon and splash files after changing it:

```
python3 scripts/make-art.py
npm run icons
```

## Before you submit

The app still shows the demo Premium unlock and demo sign-in. Google Play requires Google Play Billing for selling digital content inside the app, so either:

- launch the first version free, with the Premium and sign-in screens hidden in the app build, or
- connect Google Play Billing before release.
