let counter = 0;

module.exports = () => {
  counter++;

  return {
    [`[${counter}] pause`]: function(client) {
      client.pause();
    }
  };
};
