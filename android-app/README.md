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

The logo (the k in Paskle drawn as a key) and all icons, splash screens and store graphics are drawn by `tools/make_brand.py` in the repo root. After changing the logo:

```
python3 tools/make_brand.py     # from the repo root
cd android-app && npm run icons # rebuild the Android icon and splash files
```

## How the app build differs from the website

`npm run sync` copies the web app into `www/` and adds `vendor/capacitor.js`, which only the app build loads. Inside the app:

- the phone's Back button goes back one screen, and closes the app from the home screen (`@capacitor/app`);
- "Listen" uses the phone's text-to-speech engine (`@capacitor-community/text-to-speech`), because Android's WebView has no built-in speech;
- the website's offline service worker is not used, since the app already has all files on the phone;
- the status bar and navigation bar colors follow the app's light or dark theme.

## Before you submit

- **Premium and sign-in are switched off** for now (`CONFIG={payments:false,accounts:false}` near the top of the script in `index.html`). Everything is free and nothing is locked, on the website and in the app. Google Play requires Google Play Billing for selling digital content in an app, and requires in-app and web account deletion once accounts exist, so turn these on only after billing and real accounts are built.
- **Create the privacy@paskleapp.com mailbox** in Hostinger. It is the contact on the privacy page and in the listing.
- **Settle the app name.** The package name `app.lexcellent.paskle` can never change after the first upload.
- **Test on a real phone** (Back button, Listen, dark mode, offline) with an internal-testing build before production.
