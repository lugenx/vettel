import fetch from "node-fetch";
export const name = "result";
export const description =
  "This command will give a result for specific year and gp";
export function execute(message, args) {
  let command = message.content.split(" ")[0];
  let currentYear = new Date().getFullYear();

  if (
    (args[0] === undefined || args[0].length !== 4 || isNaN(args[0])) &&
    args[0] !== "current" &&
    args[1] !== "last"
  ) {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`, then a keyword to identify a Grand Prix.\n*For example:* \`${command} 2011 canada\`, or \`${command} 1971 monza\`\nYou can use \`current\` for the year and \`last\` for the GP to check most recent race quickly.\n*For example:*\`${command} current last\`. Learn more by using \`+help\` command.`
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
      try {
        const firstResponse = await fetch(
          "https://ergast.com/api/f1/" + args[0] + ".json"
        );

        let reg = new RegExp(`${args[1]}`, "i");
        let round;
        let firstData = await firstResponse.json();
        const races = await firstData.MRData.RaceTable.Races;

        if (args[1] === "last") {
          round = args[1];
        } else if (args[1] === undefined || !isNaN(args[1])) {
          return message.channel.send(
            `Enter a keyword to identify a Grand Prix after the \`${message}\`\n*For example:* \`${message.content} british\`, or \`${message.content} monza\`\nYou can use \`current\` for the year and \`last\` for the GP to check most recent race quickly.\n*For example:*\`${message.content} current last\`. Learn more by using \`+help\` command.`
          );
        } else {
          for (let i = 0; i < races.length; i++) {
            if (
              reg.test(races[i].raceName) ||
              reg.test(races[i].Circuit.circuitName) ||
              reg.test(races[i].Circuit.Location.country)
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
      } catch (err) {
        console.log(err);
        message.channel.send("hmm...:thinking:");
      }
    }
    return result();
  }
}
