//test all cases apply to other commands if needed

import fetch from "node-fetch";
export const name = "result";
export const description =
  "This command will give a result for specific year and gp";
export function execute(message, args) {
  let currentYear = new Date().getFullYear();

  if (
    (args[0] === undefined || args[0].length !== 4 || isNaN(args[0])) &&
    args[0] !== "current" &&
    args[1] !== "last"
  ) {
    return message.channel.send(
      "Enter a `year` after the `+result`, then a keyword to identify a Grand Prix.\n*For example:* `+result 2011 canada`, or `+result 1971 monza` or the round of Grand Prix. *For example:*  `+result 2007 4`\nYou can use `current` for the year and `last` for the round of GP if you want to check most recent race quickly.\n*For example:*`+result current last`. Learn more by using `+help` command."
    );
  } else if (
    args[0] > currentYear &&
    !isNaN(args[0]) &&
    args[0] !== undefined &&
    args[0].length === 4
  ) {
    return message.channel.send(`${args[0]}? Honestly... Are you kidding me?`);
  } else {
    async function result() {
      const firstResponse = await fetch(
        "https://ergast.com/api/f1/" + args[0] + ".json"
      );

      let reg = new RegExp(`${args[1]}`, "i");
      let round;
      let firstData = await firstResponse.json();
      const races = await firstData.MRData.RaceTable.Races;

      if (args[1] === "last") {
        round = args[1];
      } else if (args[1] === undefined) {
        return message.channel.send(
          "Enter a keyword to identify a Grand Prix after the `+result year`\n*For example:* `+result 2011 canada`, or `+result 1971 monza` or the round of Grand Prix. *For example:*  `+result 2007 4`\nYou can use `current` for the year and `last` for the round of GP if you want to check most recent race quickly.\n*For example:*`+result current last`. Learn more by using `+help` command."
        );
      } else {
        for (let i = 0; i < races.length; i++) {
          if (
            reg.test(races[i].raceName) ||
            reg.test(races[i].Circuit.circuitName) ||
            reg.test(races[i].Circuit.Location.country) ||
            reg.test(races[i].round)
          ) {
            round = races[i].round;
          }
        }

        if (round === undefined && args[0] <= currentYear) {
          return message.channel.send(
            `I don't think there was a ${args[1]} race in ${args[0]}!`
          );
        }
      }

      const secondResponse = await fetch(
        "https://ergast.com/api/f1/" + args[0] + "/" + round + "/results.json"
      );

      const secondData = await secondResponse.json();
      const race = await secondData.MRData.RaceTable.Races[0];
      const raceResults = await race.Results;
      const gpName = await race.raceName;
      const season = await race.season;

      const driversResultList = [];

      for (let r = 0; r < raceResults.length; r++) {
        let time = raceResults[r].hasOwnProperty("Time")
          ? raceResults[r].Time.time
          : raceResults[r].status;
        driversResultList.push(
          r +
            1 +
            " " +
            raceResults[r].Driver.familyName +
            " " +
            "(" +
            time +
            ")"
        );
      }

      message.channel.send(
        `Here is the result of **${season} ${gpName}**. \n ${driversResultList.join(
          " \n"
        )}`
      );
    }
    return result();
  }
}
