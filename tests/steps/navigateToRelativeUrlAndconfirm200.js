const navigateToRelativeUrl = require('./navigateToRelativeUrl');

let counter = 0;

module.exports = (url) => {
  counter++;

  return {
    [`[${counter}] navigate to relative url and confirm 200 "${url}"`]: function(client) {
      navigateToRelativeUrl.method(client, url);

      client.expect.element('body').text.to.not.contain('page can’t be found');
    }
  };
};
