exports.command = function openAdminBarItem(name) {  

  // Due to animations etc. it may take a moment before a click on
  // the admin bar succeeds in opening it

  return this.waitForNoModals()
    .execute(function(name) {
      function attempt() {
        console.log('in attempt');
        if ($(".apos-admin-bar.apos-active").length === 0) {
          $("[data-apos-actionable=data-apos-admin-bar]").click();
          return dropdownAttempt();
        }
        setTimeout(attempt, 50);
      }
      attempt();
      function dropdownAttempt() {
        console.log('in dropdownAttempt');
        // Might be grouped in a dropdown, if it is toggle that dropdown once its
        // trigger button is visible
        var $target = $('[data-apos-admin-bar-item="' + name + '"]');
        console.log('target length is ' + $target.length);
        var $dropdown = $target.closest('[data-apos-dropdown]');
        if (!$dropdown.length) {
          console.log('I believe there is no dropdown');
          return;
        }
        var $trigger = $dropdown.find('.apos-admin-bar-item-inner:visible');
        if ($trigger.length) {
          console.log('clicking trigger');
          $trigger.click();
          return;
        } else {
          console.log('no visible trigger in:', $dropdown[0]);
        }
        setTimeout(dropdownAttempt, 50);
      }
    }, [ name ]).clickWhenReady('[data-apos-admin-bar-item="' + name + '"]');
};
