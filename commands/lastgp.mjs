//Import fetch from "node-fetch";
//Problem with modules. Use one of the modules (ES or CommonJS) for both main and commands files..
export const name = "lastgp";
export const description = "the last gp";
export function execute(message, args) {
  async function result() {
    const response = await fetch(
      "https://ergast.com/api/f1/current/last/results.json"
    );

    const data = await response.json();
    const lastRaceResults = await data.MRData.RaceTable.Races[0].Results;
    const driversStanding = [];

    for (let r = 0; r < lastRaceResults.length; r++) {
      driversStanding.push(r + 1 + " " + lastRaceResults[r].Driver.familyName);
    }

    console.log(lastRaceResults);

    message.channel.send(`${driversStanding}`);
  }
  return result();
}
