import fetch from "node-fetch";
export const name = "qualifying";
export const description = "This command will give qualifying results of a gp";
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
  } else if (firstArgIsAYear && firstArg > currentYear) {
    return message.channel.send(`${firstArg}? Honestly... How do I know?`);
  } else {
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
            `Enter a keyword to identify a Grand Prix after the \`${message}\`\n*For example:* \`${message.content} british\`, or \`${message.content} monza\`. Learn more by using \`+help\` command.`
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
          `https://ergast.com/api/f1/${firstArg}/${round}/qualifying.json`
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
        let driversResultListStr = driversResultList.join("\n");
        message.channel.send(
          `Here is the **Qualifying** result of **${season} ${gpName}**. \n ${driversResultListStr}`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("hmm... :thinking:");
      }
    }
    return result();
  }
}
