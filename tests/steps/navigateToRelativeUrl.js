let counter = 0;

function method(client, url) {
  client.perform((done) => {
    client.url((res) => {
      const locator = `${res.value}${url}`;

      client.url(locator);
      client.pause(1000);
      done();
    });
  });
};

module.exports = (url) => {
  counter++;

  return {
    [`[${counter}] navigate to relative url "${url}"`]: (client) => method(client, url),
  };
};
module.exports.method = method;
