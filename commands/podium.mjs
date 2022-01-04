import fetch from "node-fetch";
export const name = "podium";
export const description =
  "This command will give a podium for specific year and gp";
export function execute(message, args) {
  let command = message.content.split(" ")[0];
  let currentYear = new Date().getFullYear();
  let askedYear = args[0];
  if (
    (askedYear === undefined || askedYear.length !== 4 || isNaN(askedYear)) &&
    askedYear !== "current" &&
    args[1] !== "last"
  ) {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`, then a keyword to identify a Grand Prix.\n*For example:* \`${command} 2011 canada\`, or \`${command} 1971 monza\`. Learn more by using \`+help\` command.`
    );
    //\nYou can use \`current\` for the year and \`last\` for the GP to check most recent race quickly.\n*For example:*\`${command} current last\`.
  } else if (
    askedYear > currentYear &&
    !isNaN(askedYear) &&
    askedYear !== undefined &&
    askedYear.length === 4
  ) {
    return message.channel.send(`${askedYear}? Really?`);
  } else {
    async function result() {
      try {
        const firstResponse = await fetch(
          `https://ergast.com/api/f1/${askedYear}.json`
        );

        let reg = new RegExp(`${args[1]}`, "i");
        let round;
        let firstData = await firstResponse.json();
        const races = await firstData.MRData.RaceTable.Races;

        if (args[1] === "last") {
          round = args[1];
        } else if (args[1] === undefined || !isNaN(args[1])) {
          return message.channel.send(
            `Enter a keyword to identify a Grand Prix after the \`+podium ${askedYear}\`\n*For example:* \`+podium ${askedYear} british\`, or \`+podium ${askedYear} monza\`. Learn more by using \`+help\` command.`
          );
          //\nYou can use \`current\` for the year and \`last\` for the GP to check most recent race quickly.\n*For example:*\`+podium current last\`.
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

          if (round === undefined && askedYear <= currentYear) {
            return message.channel.send(
              `I don't think there was a ${args[1]} race in ${askedYear}!`
            );
          }
        }

        const secondResponse = await fetch(
          `https://ergast.com/api/f1/${askedYear}/${round}/results.json`
        );

        const secondData = await secondResponse.json();
        const race = await secondData.MRData.RaceTable.Races[0];
        const raceResults = await race.Results;
        const gpName = await race.raceName;
        const season = await race.season;

        const driversResultList = [];

        for (let r = 0; r < 3; r++) {
          let time = raceResults[r].hasOwnProperty("Time")
            ? raceResults[r].Time.time
            : raceResults[r].status;
          driversResultList.push(
            r +
              1 +
              " " +
              raceResults[r].Driver.givenName +
              " " +
              raceResults[r].Driver.familyName +
              " (" +
              raceResults[r].Constructor.name +
              ") " +
              time
          );
        }

        message.channel.send(
          `Here is the podium of **${season} ${gpName}**. \n ${driversResultList.join(
            " \n"
          )}`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("hmm :thinking:");
      }
    }
    return result();
  }
}
