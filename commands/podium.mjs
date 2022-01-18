import fetch from "node-fetch";
export const name = "podium";
export const description =
  "This command will give a podium for specific year and gp";
export function execute(message, args) {
  const currentYear = new Date().getFullYear();

  //User inputs: +command firstArg secondArg
  const command = message.content.split(" ")[0];
  const firstArg = args[0];
  const firstArgIsAYear =
    firstArg && firstArg.length === 4 && !isNaN(firstArg) && firstArg < 3000;
  const secondArg = args[1];
  const secondArgIsAKeyword = secondArg && isNaN(secondArg);

  if (!firstArgIsAYear && firstArg !== "current") {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`, then a keyword to identify a Grand Prix.\n*For example:* \`${command} 2011 canada\`, or \`${command} 1971 monza\`. Learn more by using \`+help\` command.`
    );
  }

  if (firstArgIsAYear && firstArg > currentYear) {
    return message.channel.send(`${firstArg}? Really?`);
  }

  async function result() {
    try {
      const firstResponse = await fetch(
        `https://ergast.com/api/f1/${firstArg}.json`
      );

      let reg = new RegExp(`${secondArg}`, "i");
      let round;
      let firstData = await firstResponse.json();
      const races = await firstData.MRData.RaceTable.Races;

      if (secondArg === "last") {
        round = secondArg;
      } else if (!secondArgIsAKeyword) {
        return message.channel.send(
          `Enter a keyword to identify a Grand Prix after the \`+podium ${firstArg}\`\n*For example:* \`+podium ${firstArg} british\`, or \`+podium ${firstArg} monza\`. Learn more by using \`+help\` command.`
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

        if (
          round === undefined &&
          (firstArg <= currentYear || firstArg === "current")
        ) {
          return message.channel.send(
            `I don't think there was a ${secondArg} race in the ${firstArg} year!`
          );
        }
      }

      const secondResponse = await fetch(
        `https://ergast.com/api/f1/${firstArg}/${round}/results.json`
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
          `${r + 1} ${raceResults[r].Driver.givenName} ${
            raceResults[r].Driver.familyName
          } (${raceResults[r].Constructor.name}) ${time}`
        );
      }
      let driversResultListStr = driversResultList.join("\n");
      message.channel.send(
        `Here is the podium of **${season} ${gpName}**. \n ${driversResultListStr}`
      );
    } catch (err) {
      console.log(err);
      message.channel.send("hmm :thinking:");
    }
  }
  return result();
}
