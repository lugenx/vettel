module.exports = {
  name: "hello",
  description: "this is a first command",
  execute(message, args) {
    //???
    message.reply("Hi, " + message.author.username + ", how is it going?");
  },
};
