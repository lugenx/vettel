export const name = "hello";
export const description = "this is a first command";
export const execute = function (message, args) {
  //???
  message.reply("Hi, " + message.author.username + ", how is it going?");
};

// export function execute(message, args) {
//   //???
//   message.reply("Hi, " + message.author.username + ", how is it going?");
// }
