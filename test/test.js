global.testing = true;
var apos = require('../app.js')({ argv: { _: {} } }, function() {
  console.log("Ready to run tests now.");
  // Run my tests then...
  console.log("Exiting after tests.");
  apos.destroy(function(err) {
    if (err) {
      console.error('Problems destroying apostrophe.');
    }
    // TODO: this should exit cleanly on its own, but
    // currently there is still some leak in the apos object,
    // perhaps an interval or timeout?
    process.exit(0);
  });
});
