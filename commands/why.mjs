export const name = "why";
export const description = "He is going to say why hes name is Vettel";
export const execute = function (message, args) {
  if (
    args[0] === "vettel" ||
    (args[0] === "your" &&
      args[1] === "name" &&
      args[2] === "is" &&
      args[3] === "vettel") ||
    (args[0] === "this" && args[1] === "name")
  ) {
    message.channel.send(
      "Good question " +
        message.author.username +
        ", because I know everything... \n https://www.youtube.com/watch?v=LH9yXEpoMEw"
    );
  }
};
