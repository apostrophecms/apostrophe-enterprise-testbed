module.exports = {
  stylesheets: [
    {
      name: 'site'
    }
  ],
  construct: function(self, options) {
    self.scripts.push({ name: 'modules/demo-header', when: 'always' });
    self.scripts.push({ name: 'modules/off-canvas', when: 'always' });
    self.scripts.push({ name: 'modules/autologin', when: 'always' });
    if (process.env.DISMISS_NOTIFICATIONS) {
      self.scripts.push({ name: 'modules/dismiss-notifications', when: 'user' });
    }
  }
};
