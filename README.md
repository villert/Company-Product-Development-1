# Company Product Development 1

A React Native restaurant discovery and chat app built with Expo and Firebase as part of a school course project.

## Features

- User registration and login
- Guest login
- Shared chat room
- Editable profile name
- Dark mode toggle
- English / Finnish language toggle
- Restaurant list, menu view, and map view

## Tech Stack

- Expo SDK 55
- React Native
- Firebase Authentication
- Firestore
- React Navigation
- Expo Location
- WebView + Leaflet/OpenStreetMap

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Company-Product-Development-1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Copy `.env.example` to `.env` and add your Firebase project values:

```env
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Start the app

```bash
npm start
```

You can also run:

```bash
npm run android
npm run ios
npm run web
```

## Firebase Notes

- `.env` is not committed to the repository
- `.env.example` is included as a safe setup template
- Firebase client config is used by the app at runtime, so the real protection comes from Firebase security rules
- Make sure your Firestore rules are configured correctly before deploying or sharing the project publicly

## Team Setup

If you are working on this project with teammates:

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Get the real Firebase values from the project owner
4. Run `npm install`
5. Run `npm start`

## Portfolio Note

This repository is intended as a portfolio/team project example. Sensitive environment values are excluded from version control.
