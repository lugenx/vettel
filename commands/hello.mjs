import { randomMsg } from "../functions/random-message.mjs";
import {
  firstGreetings,
  secondGreetings,
  funnyNames,
  jokes,
  preJoke,
} from "../data/mesages.mjs";
export const name = "hello";
export const description = "this is a first command";

export const execute = function (message, args) {
  message.reply(
    `${randomMsg(firstGreetings)} ${message.author.username}, ${randomMsg(
      secondGreetings
    )}, ${randomMsg(funnyNames)}? ${randomMsg(preJoke)}\n${randomMsg(jokes)}`
  );

  if (message.channel.type == "dm") {
    // message.reply("You are DMing me now!");
    message.author.send(
      `${randomMsg(firstGreetings)} ${message.author.username}, ${randomMsg(
        secondGreetings
      )}, ${randomMsg(funnyNames)}? ${randomMsg(preJoke)}\n${randomMsg(jokes)}`
    );
  }
};
