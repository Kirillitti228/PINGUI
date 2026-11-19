PINGUI 3.0 — FIREBASE AUTHENTICATION
====================================

WHAT'S INCLUDED
- Existing PINGUI lessons, practice tasks, dictionary, progress and themes.
- Firebase Authentication: email + password registration and login.
- Google sign-in.
- Password reset email.
- First-login profile setup: nickname, unique username and interface language.
- Interface languages: Norwegian, Russian and Ukrainian.
- Cloud Firestore user profiles and unique username claims.
- Sign out button in Settings.
- Firestore security rules in firestore.rules.

IMPORTANT
The Firebase integration is implemented, but it is NOT connected to your Firebase project yet.
You must add your own Firebase Web App configuration before registration can work.
The Firebase web config is public client configuration. Never paste a service-account private key
or any Admin SDK secret into this website.

PART 1 — CREATE / CONFIGURE FIREBASE
1. Open https://console.firebase.google.com/
2. Create a project (or select your existing project).
3. Add a Web App from Project Overview (</>).
4. Copy the Firebase config object shown for the web app.
5. Open firebase-config.js in this project.
6. Replace the placeholder values with the exact values from Firebase.
7. In Firebase Console -> Authentication -> Sign-in method:
   - Enable Email/Password.
   - Enable Google.
8. In Authentication -> Settings -> Authorized domains:
   - Keep localhost for local testing.
   - Add your GitHub Pages domain after publishing, e.g. YOUR_GITHUB_NAME.github.io.
9. Open Firestore Database -> Create database.
10. Open Firestore -> Rules, paste the contents of firestore.rules and Publish.

PART 2 — TEST LOCALLY
1. Open this folder in VS Code.
2. Use Live Server to open index.html (do not open it as file://).
3. Register using an email address and password (minimum 6 characters), or use Google.
4. Complete the profile:
   - Nickname: the display name.
   - Username: unique, 3–20 lowercase letters, numbers or underscores.
   - Interface language: Norwegian, Russian or Ukrainian.
5. Check that the user profile appears in Firestore under users/{uid}.
6. Check the username claim under usernames/{username}.
7. Test logout, login, Google sign-in and password reset.

PART 3 — PUBLISH ON GITHUB PAGES FOR YOUR TEACHER
1. Create a GitHub repository, for example pingui.
2. Upload the complete contents of this folder. Keep firebase-config.js in the project.
3. In GitHub: repository -> Settings -> Pages.
4. Select Deploy from a branch, choose main and / (root), then Save.
5. Wait for GitHub Pages to publish the site.
6. Copy the published URL, normally https://YOUR_GITHUB_NAME.github.io/pingui/.
7. Go back to Firebase Console -> Authentication -> Settings -> Authorized domains.
8. Add YOUR_GITHUB_NAME.github.io (host only, no https and no /pingui path).
9. Open the published URL and test registration and Google sign-in again.
10. Send the published URL to your teacher.

NOTES
- Firebase Authentication stores account credentials; this site never stores user passwords itself.
- Firestore stores the profile and username reservation.
- The existing learning progress remains in browser localStorage in this version.
  It is not yet synced between different devices/accounts.
- Google popup sign-in requires the site domain to be listed in Firebase Authorized domains.
- Firebase web config values are designed to be visible in browser apps. Firestore Security Rules
  are what protect the user documents. Do not make the database publicly readable/writable.
- The app needs internet access to load Firebase SDK scripts and connect to Firebase.

Run using VS Code Live Server.
