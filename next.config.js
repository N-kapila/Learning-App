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
});
