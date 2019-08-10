(function() {
  // Once a second, clear a notification if present.
  // This simulates a human being gradually clearing them,
  // for regression test purposes
  setInterval(clearNotification, 1000);
  function clearNotification() {
    var $notification = $('[data-apos-notification-container] [data-apos-notification]:first');
    if ($notification[0]) {
      $notification.click();
    }
  }
})();
