const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/list",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/timeline",
]);

require("dotenv").config({ path: `${process.env.ENVIRONMENT}` });
module.exports = withTM({
  swcMinify: false,
  trailingSlash: true,
  reactStrictMode: true,
  // env: {
  //   // HOST
  //   HOST_API_KEY: "https://minimal-assets-api-dev.vercel.app",
  //   // MAPBOX
  //   MAPBOX_API: "",
  //   // FIREBASE
  //   FIREBASE_API_KEY: "AIzaSyAFGd9lSK-G-D_eFsK_2GHAoaiRgJ8jQn0",
  //   FIREBASE_AUTH_DOMAIN: "learnia-357514.firebaseapp.com",
  //   FIREBASE_PROJECT_ID: "learnia-357514",
  //   FIREBASE_STORAGE_BUCKET: "learnia-357514.appspot.com",
  //   FIREBASE_MESSAGING_SENDER_ID: "252323984645",
  //   FIREBASE_APPID: "1:252323984645:web:f1b5cce7cffd1014abf36c",
  //   FIREBASE_MEASUREMENT_ID: "G-LQSJ2BXDMP",
  //   // AWS COGNITO
  //   AWS_COGNITO_USER_POOL_ID: "",
  //   AWS_COGNITO_CLIENT_ID: "",
  //   // AUTH0
  //   AUTH0_CLIENT_ID: "",
  //   AUTH0_DOMAIN: "",
  // },
});
