module.exports = {
  main: function(client) {
    client
      .url('http://localhost:3000')
      .pause(1000);

    client.expect.element('body.home-page').to.be.present;
  }
};
