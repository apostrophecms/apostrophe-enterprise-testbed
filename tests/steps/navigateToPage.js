let counter = 0;

module.exports = (pageName) => {
  counter++;

  return {
    [`[${counter}] navigate to subpage "${pageName}"`]: function(client) {
      const pageSelector = `.top .nav-item a[href$="${pageName}"]`;

      client.clickWhenReady(pageSelector);
      client.waitForElementReady('body');
    }
  };
};
