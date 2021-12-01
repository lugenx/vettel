//in progress

import fetch from "node-fetch";
export const name = "result";
export const description =
  "This command will give a result for specific year and gp";
export function execute(message, args) {
  async function result() {
    const response = await fetch(
      "https://ergast.com/api/f1/" + args[0] + "/" + args[1] + "/results.json"
    );
    console.log(args[0]);
    const data = await response.json();
    const race = await data.MRData.RaceTable.Races[0];
    const raceResults = await race.Results;
    const gpName = await race.raceName;
    const season = await race.season;

    const driversResultList = [];

    for (let r = 0; r < raceResults.length; r++) {
      let time = raceResults[r].hasOwnProperty("Time")
        ? raceResults[r].Time.time
        : raceResults[r].status;
      driversResultList.push(
        r + 1 + " " + raceResults[r].Driver.familyName + " " + "(" + time + ")"
      );
    }

    message.channel.send(
      //fix the wording
      `Most recent race was **${season} ${gpName}**. \nHere is the results: \n ${driversResultList.join(
        " \n"
      )}`
    );
  }
  return result();
}
