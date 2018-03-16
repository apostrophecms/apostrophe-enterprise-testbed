global.testing = true;
var apos = require('../app.js')(function() {
  console.log("Ready to run tests now.");
  // Run my tests then...
  console.log("Exiting after tests.");
  process.exit(0);
});
