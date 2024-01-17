const concat = require("concat");
(async function build() {
  const files = [
    "./dist/calendar-angular-project/runtime.js",
    "./dist/calendar-angular-project/polyfills.js",
    "./dist/calendar-angular-project/main.js",
  ];
  await concat(files, "./dist/calendar-angular-project/micro-calendar.js");
})();
