import { randomMsg } from "../functions/random-message.mjs";
import { jokes } from "../data/mesages.mjs";
export const name = "joke";
export const description = "this command will respond with random jokes";

export const execute = function (message, args) {
  message.channel.send(`${randomMsg(jokes)}`);
};
