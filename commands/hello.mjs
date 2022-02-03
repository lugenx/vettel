export const name = "hello";
export const description = "this is a first command";
import { randomMsg } from "../functions/random-message.mjs";
import {
  firstGreetings,
  secondGreetings,
  funnyNames,
  jokes,
  preJoke,
} from "../data/mesages.mjs";
export const execute = function (message, args) {
  //???
  message.reply(
    `${randomMsg(firstGreetings)} ${message.author.username}, ${randomMsg(
      secondGreetings
    )}, ${randomMsg(funnyNames)}? ${randomMsg(preJoke)}\n${randomMsg(jokes)}`
  );
};

// export function execute(message, args) {
//   //???
//   message.reply("Hi, " + message.author.username + ", how is it going?");
// }
