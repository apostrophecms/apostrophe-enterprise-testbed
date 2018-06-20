exports.command = function openAdminBarItem(name) {  

  // Due to animations etc. it may take a moment before a click on
  // the admin bar succeeds in opening it

  return this.waitForNoModals()
    .execute(function(a) {
      function attempt() {
          if ($(".apos-admin-bar.apos-active").length === 0) {
            $("[data-apos-actionable=data-apos-admin-bar]").click();
            return;
          }
          setTimeout(attempt, 50);
        }
        attempt();
      }
    ).clickWhenReady('[data-apos-admin-bar-item="' + name + '"]');
};
