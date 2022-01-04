import fetch from "node-fetch";
export const name = "winner";
export const description =
  "This command will give a winner for specific year and gp";
export function execute(message, args) {
  let currentYear = new Date().getFullYear();

  if (
    (args[0] === undefined || args[0].length !== 4 || isNaN(args[0])) &&
    args[0] !== "current" &&
    args[1] !== "last"
  ) {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`+winner\`, then a keyword to identify a Grand Prix.\n*For example:* \`+winner 2011 canada\`, or \`+winner 1971 monza\`. Learn more by using \`+help\` command.`
      //\nYou can use \`current\` for the year and \`last\` for the round of GP if you want to check most recent race quickly.\n*For example:*\`+winner current last\`
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
            `Enter a keyword to identify a Grand Prix after the \`+winner ${args[0]}\`\n*For example:* \`+winner ${args[0]} british\`, or \`+winner ${args[0]} monza\`. Learn more by using \`+help\` command.`
            //\nYou can use \`current\` for the year and \`last\` for the GP to check most recent race quickly.\n*For example:*\`+winner current last\`
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

        const winnerName =
          raceResults[0].Driver.givenName +
          " " +
          raceResults[0].Driver.familyName;
        const winnerTeam = raceResults[0].Constructor.name;
        const winnerFinishTime = raceResults[0].Time.time;

        message.channel.send(
          `The winner of ${season} ${gpName} is **${winnerName}** from ${winnerTeam}. He crossed the finish line in ${winnerFinishTime}.`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("hmm... :thinking:");
      }
    }
    return result();
  }
}
