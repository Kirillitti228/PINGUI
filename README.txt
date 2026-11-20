PINGUI 3.0 — LOCAL TESTING AND DEPLOYMENT

Active website: this folder (PINGUI_3.0). It uses the existing Firebase project pingui-8daa6 and its existing Web App configuration in firebase-config.js. Do not create a project, replace that configuration, change Firestore rules, or add a separate Gemini API key.

ENABLE PINGI IN FIREBASE CONSOLE
1. Select project pingui-8daa6.
2. Open AI Services -> AI Logic, choose Gemini Developer API, and complete the setup for the existing PINGUI Web App. Firebase enables the required APIs and provisions the Gemini Developer API connection; no Gemini key is copied into this site.
3. Firebase AI Logic App Check is enforced for projects. Configure App Check for the Web App. Register a reCAPTCHA Enterprise web key for your GitHub Pages host and set that public site key as window.PINGUI_APP_CHECK_SITE_KEY in firebase-config.js. Pingi will not initialize without this key. Keep PINGUI_APP_CHECK_DEBUG false for publishing.
4. Keep the existing Authentication providers and Firestore configuration as they are. Authentication authorized domains must include localhost for local auth testing and your GitHub Pages hostname after publishing.

TEST LOCALLY
1. Open this PINGUI_3.0 folder in VS Code and run index.html with Live Server. Do not use a file:// URL.
2. Keep the configured reCAPTCHA Enterprise site key in firebase-config.js. Set window.PINGUI_APP_CHECK_DEBUG to true temporarily and reload the localhost site. In the browser console, copy the App Check debug token printed by Firebase and register it under Firebase Console -> Security -> App Check -> Apps -> Manage debug tokens. Reload and confirm the debug token is accepted. Set PINGUI_APP_CHECK_DEBUG back to false before deployment; the code only enables the debug provider on localhost/127.0.0.1.
3. Sign in with an existing test account or create a test account using the existing Auth flow. Open Pingi Tutor from the dashboard or sidebar.
4. Send a question in English, Norwegian, Russian, and Ukrainian. Choose “Same as my message” to let Pingi follow the language you wrote in, or select a specific reply language. Try Enter to send, Shift+Enter for a new line, and an empty message.
5. Open Practice, submit an incorrect answer, and use Explain my mistake. Check that Pingi explains the current exercise and gives a similar example without answering the next exercise.
6. Check the browser console and Network panel for JavaScript errors and Firebase AI Logic responses. Temporarily disable network access to check the friendly unavailable message. Also check the chat at a narrow/mobile viewport and in both themes.
7. Confirm sign-in, profile, lessons, practice scoring, XP, streak, and progress still work. Chat messages remain in memory only and are not written to Firestore.

PUBLISH ON GITHUB PAGES
1. Create or use your GitHub repository. Copy the CONTENTS of this PINGUI_3.0 folder (index.html, app.js, styles.css, firebase-config.js, firebase-auth.js, pingi-ai.js, firestore.rules, README.txt, and assets/) into the repository root. Do not publish the outer PINGUI_3.0_FIREBASE_CONNECTED folder, which contains non-site report files.
2. In GitHub, open repository -> Settings -> Pages. Choose Deploy from a branch, select the deployment branch (usually main) and /(root), then save.
3. Add the published hostname (for example, username.github.io) to Firebase Console -> Authentication -> Settings -> Authorized domains. Keep the existing sign-in providers and database rules unchanged.
4. Configure production reCAPTCHA Enterprise/App Check as described above. Set PINGUI_APP_CHECK_DEBUG to false and PINGUI_APP_CHECK_SITE_KEY to the production public site key, then commit and publish those settings.
5. Open the published GitHub Pages URL, sign in, and repeat the chat and exercise checks. Check the browser console for App Check or AI Logic errors.

PINGI uses Firebase AI Logic with Gemini Developer API and the gemini-3.8-flash model. It sends the learner's prompt and short chat history to Gemini for the current page session. Firebase AI Logic quotas and billing are managed in the existing Firebase/Google Cloud project.