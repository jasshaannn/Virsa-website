// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (free "Spark" plan is enough)
// 3. In the project, click the </> (web) icon to register a web app
// 4. Copy the config object Firebase gives you and paste the values below
// 5. In the left sidebar, go to "Build > Firestore Database" and click
//    "Create database" (start in production mode, pick a region near you)
// 6. Go to the "Rules" tab of Firestore and paste the rules from
//    SETUP-INSTRUCTIONS.md, then click "Publish"
// 7. Go to "Build > Authentication" > "Get started" > enable
//    "Email/Password" sign-in method, then add yourself as a user
//    under the "Users" tab (this is your admin login)
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyBy-fg15VYb2SyxiuclmgHM20-aoQl-oc4",
  authDomain: "virsa-494cc.firebaseapp.com",
  projectId: "virsa-494cc",
  storageBucket: "virsa-494cc.firebasestorage.app",
  messagingSenderId: "458739265972",
  appId: "1:458739265972:web:8be49dd1bba77d2f8182e1",
  measurementId: "G-KKV5Y827Q1"
};
