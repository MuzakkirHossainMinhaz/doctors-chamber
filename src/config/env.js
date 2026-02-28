// Environment configuration utility
// Centralized access to environment variables with validation

export const appConfig = {
  // Firebase Configuration
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME,
    description:
      import.meta.env.VITE_APP_DESCRIPTION ||
      "Healthcare Service Booking Platform",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  },

  // Environment Detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === "test",
};

// Validate Firebase configuration
export const validateFirebaseConfig = () => {
  const requiredFirebaseVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  const missingVars = requiredFirebaseVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("❌ Missing Firebase environment variables:");
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error(
      "\n📝 Please check your .env file and ensure all required variables are set.",
    );
    console.error(
      "💡 Copy .env.example to .env and fill in your Firebase configuration.",
    );

    throw new Error(
      `Missing Firebase configuration: ${missingVars.join(", ")}`,
    );
  }

  console.log("✅ Firebase configuration validated successfully");
  return true;
};

// Get Firebase config object
export const getFirebaseConfig = () => {
  validateFirebaseConfig();
  return appConfig.firebase;
};

// Development helper to show current config (without sensitive data)
export const showConfigSummary = () => {
  if (appConfig.isDevelopment) {
    console.log("🔧 Environment Configuration Summary:");
    console.log(`   App: ${appConfig.app.name} v${appConfig.app.version}`);
    console.log(`   Mode: ${import.meta.env.MODE}`);
    console.log(`   Firebase Project: ${appConfig.firebase.projectId}`);
    console.log(`   Auth Domain: ${appConfig.firebase.authDomain}`);
  }
};

export default appConfig;
