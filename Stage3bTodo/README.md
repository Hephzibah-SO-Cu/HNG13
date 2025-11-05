# Stage 3b - React Native Todo App (HNG)

This is a pixel-perfect React Native (Expo) Todo application built for the HNG Stage 3b task. It features real-time backend functionality via Convex, persistent light/dark theme-switching, and drag-and-drop list reordering.

## Features

- Pixel-Perfect UI: Replicates the provided Figma design for both desktop (web) and mobile.
- Theme Switching: Smooth light/dark mode toggle that persists across app restarts using AsyncStorage.
- Real-time Backend: Full CRUD (Create, Read, Update, Delete) functionality using Convex.
- Drag & Drop: Reorder todos on mobile with a long-press, powered by react-native-draggable-flatlist.
- Filtering: Client-side filtering for "All," "Active," and "Completed" todos.

## Tech Stack

- Framework: React Native (with Expo)
- Backend & Database: Convex
- Routing: Expo Router (v3)
- Styling: StyleSheet with dynamic theme context.
- Fonts: expo-font with @expo-google-fonts/josefin-sans.
- Theming: React Context & AsyncStorage.
- Icons: react-native-svg (from exported files).
- Gradients: expo-linear-gradient.
- Drag & Drop: react-native-draggable-flatlist & react-native-gesture-handler.

1. Project Setup

Step 1: Clone the Repository and open the file

```bash
cd Stage3bTodo
```

Step 2: Install All Dependencies

Install all required npm packages.

```bash
npm install
```

(This project uses expo-linear-gradient, react-native-svg, react-native-reanimated, react-native-gesture-handler, react-native-draggable-flatlist, @expo-google-fonts/josefin-sans, expo-font, expo-splash-screen, @react-native-async-storage/async-storage, and convex.)

2. Convex (Backend) Setup

This app requires a Convex backend to function.

Step 1: Authenticate with Convex

If this is your first time, you may need to log in.

```bash
npx convex login
```

Step 2: Run the Convex Dev Server

Run the Convex dev server. This will guide you to create a new project.

```bash
npx convex dev
```

When prompted, create a new project.

Convex will give you a Deployment URL. Copy this URL (it looks like https://your-name.convex.cloud).

Step 3: Set Environment Variables

You must provide your Convex URL to both the Convex backend and the Expo frontend.

For Convex: Go to your Convex Dashboard.

Find your new project.

Go to Settings -> Environment Variables.

Add a new variable:

Name: CONVEX_URL
Value: https://your-name.convex.cloud (the URL you just copied)

Click "Save".

For Expo (Frontend):

In the project root, open the convex/env.ts file.

Paste your URL into the CONVEX_URL variable.

// convex/env.ts
export default {
  CONVEX_URL: "[https://your-name.convex.cloud](https://your-name.convex.cloud)",
};


3. Running the App

You must have two terminals running simultaneously.

Terminal 1 (Backend):

Runs the Convex backend, pushes schema changes, and handles data.

```bash
npx convex dev
```

Terminal 2 (Frontend):

Runs the Expo Metro server to serve your app.

```bash
npx expo start
```

Press a to open on an Android Emulator.

Press w to open in your web browser.

Scan the QR code with the Expo Go app on your phone.

4. Building the APK for Submission

This project uses EAS (Expo Application Services) to build the final .apk file.

Step 1: Install the EAS CLI

If you don't have it, install it globally on your computer:

```bash
npm install -g eas-cli
```

Step 2: Log in to your Expo Account

You'll need an Expo account. If you don't have one, create one at expo.dev.

```bash
eas login
```

Step 3: Configure the Build

Run the following command. It will ask you a few questions.

```bash
eas build:configure
```

When it asks "Which platforms to configure?", select Android.

It will create a file named eas.json in your project.

Step 4: Start the Build

This command builds a "preview" profile, which is perfect for generating a sharable .apk for testing.

```bash
eas build -p android --profile preview
```

This will upload your code to Expo's build servers.

This might take 5-10 minutes. You can follow the "Build details" link it provides.

Step 5: Download Your APK

When the build is finished, the build details page will show a "Download" button. This will download the .apk file directly to your computer.