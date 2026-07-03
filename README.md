# Cinematch Movie App — Local Development Guide (VS Code)

This guide contains everything you need to run this hybrid recommendation movie engine locally in VS Code, connect it to your own Firebase project, and clean up files that are not needed for your local project.

---

## 🚀 Quick Start (Local Setup)

To run this application locally, follow these simple steps:

### 1. Install Dependencies
Open your terminal in VS Code and install the packages:
```bash
npm install
```

### 2. Configure Your Environment Variables
Copy the `.env.example` file to a new file named `.env` in your root directory:
```bash
cp .env.example .env
```

Open `.env` and enter your custom Firebase configurations:
```env
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"

# If using a custom Firestore database ID (not the default one), specify it here:
VITE_FIREBASE_DATABASE_ID=""
```

### 3. Run the Development Server
Start the local server (backed by Express & Vite):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗑️ Files NOT Required in VS Code

When running locally in VS Code, several configuration files created by the hosting platform (Google AI Studio) are **completely unnecessary** and can be safely deleted to keep your workspace clean:

| File Name | Purpose | Why you can delete it in VS Code |
| :--- | :--- | :--- |
| `firebase-blueprint.json` | Database Setup | Only used by AI Studio during the initial backend setup to bootstrap database schemas. |
| `metadata.json` | Platform Metadata | Only used by AI Studio to track the applet's name, description, and iframe frame permissions. |
| `firebase-applet-config.json` | Hosted Firebase Keys | Only used by the web-hosted preview. Locally, the application will automatically read your `.env` credentials instead. |
| `firestore.rules` | Firestore Security | Only needed if you deploy rules from your local CLI. You can delete this if you manage rules in the Firebase Console. |

---

## 🛡️ Robust Offline Fallback Built-in
If your local database configuration encounters connection issues or the client is offline, the application will seamlessly fall back to local browser cache persistence, preventing login crashes or registration failures.
