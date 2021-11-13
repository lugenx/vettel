module.exports = {
  name: "rules",
  description: "this command will send users to #rules channel",
  execute(message, args) {
    //???
    message.channel.send(
      message.author.username +
        ", please visit #rules channell to read all the server rules!"
    );
  },
};
