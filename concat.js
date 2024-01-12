const concat = require("concat");
(async function build() {
  const files = [
    "./dist/micro-calendar/runtime.js",
    "./dist/micro-calendar/polyfills.js",
    "./dist/micro-calendar/main.js",
  ];
  await concat(files, "./dist/micro-calendar/micro-calendar.js");
})();
