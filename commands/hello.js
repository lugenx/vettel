module.exports = {
  name: "hello",
  description: "this is a first command",
  execute(message, args) {
    //???
    message.channel.send("Hi!");
  },
};
