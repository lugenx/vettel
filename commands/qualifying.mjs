import fetch from "node-fetch";
export const name = "qualifying";
export const description = "This command will give qualifying results of a gp";
export function execute(message, args) {
  let currentYear = new Date().getFullYear();

  if (
    (args[0] === undefined || args[0].length !== 4 || isNaN(args[0])) &&
    args[0] !== "current" &&
    args[1] !== "last"
  ) {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${message.content}\`, then a keyword to identify a Grand Prix.\n*For example:* \`${message.content} 2011 canada\`, or \`${message.content} 1971 monza\`\nYou can use \`current\` for the year and \`last\` for the GP to check most recent qualifying result quickly.\n*For example:*\`${message.content} current last\`. Learn more by using \`+help\` command.`
    );
  } else if (
    args[0] > currentYear &&
    !isNaN(args[0]) &&
    args[0] !== undefined &&
    args[0].length === 4
  ) {
    return message.channel.send(`${args[0]}? Honestly... How do I know?`);
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
            `Enter a keyword to identify a Grand Prix after the \`${message}\`\n*For example:* \`${message.content} british\`, or \`${message.content} monza\`\nYou can use \`current\` for the year and \`last\` for the GP to check most recent qualifying result quickly.\n*For example:*\`${message.content} current last\`. Learn more by using \`+help\` command.`
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
          "https://ergast.com/api/f1/" +
            args[0] +
            "/" +
            round +
            "/qualifying.json"
        );

        const secondData = await secondResponse.json();
        const race = await secondData.MRData.RaceTable.Races[0];
        const qualiResults = await race.QualifyingResults;
        const gpName = await race.raceName;
        const season = await race.season;

        const driversResultList = [];

        for (let r = 0; r < qualiResults.length; r++) {
          let driverQualiResult = qualiResults[r].hasOwnProperty("Q3")
            ? qualiResults[r].Q3 + " (Q3)"
            : qualiResults[r].hasOwnProperty("Q2")
            ? qualiResults[r].Q2 + " (Q2)"
            : qualiResults[r].hasOwnProperty("Q1")
            ? qualiResults[r].Q1 + " (Q1)"
            : "No Time"; //raceResults[r].status;
          driversResultList.push(
            `${r + 1}`.padEnd(2, " ") +
              " " +
              qualiResults[r].Driver.familyName.padEnd(10, " ") +
              " " +
              driverQualiResult
          );
        }

        message.channel.send(
          `Here is the **Qualifying** result of **${season} ${gpName}**. \n ${driversResultList.join(
            " \n"
          )}`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("hmm... :thinking:");
      }
    }
    return result();
  }
}
