//This will be converted to ES module! Filename also should end with .mjs!
module.exports = {
  name: "rules",
  description: "this command will send users to #rules channel",
  execute(message, args) {
    //???
    message.channel.send(
      //message.author.username +
      ", please visit <#858369637443698698> channel to read all the server rules!"
    );
  },
};
