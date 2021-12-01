export const name = "why";
export const description = "He is going to say why hes name is Vettel";
export const execute = function (message, args) {
  message.channel.send(
    "Good question " +
      message.author.username +
      ", because I know everything... \n https://www.youtube.com/watch?v=LH9yXEpoMEw"
  );
};
