import fetch from "node-fetch";
export const name = "lastgp";
export const description = "the last gp";
export function execute(message, args) {
  async function result() {
    const response = await fetch(
      "https://ergast.com/api/f1/current/last/results.json"
    );

    const data = await response.json();
    const lastRace = await data.MRData.RaceTable.Races[0];
    const lastRaceResults = await lastRace.Results;
    const lastGpName = await lastRace.raceName;
    const lastSeason = await lastRace.season;

    const driversStanding = [];

    for (let r = 0; r < lastRaceResults.length; r++) {
      driversStanding.push(r + 1 + " " + lastRaceResults[r].Driver.familyName);
    }

    message.channel.send(
      `Most recent race was **${lastSeason} ${lastGpName}**. \nHere is the results: \n ${driversStanding.join(
        " \n"
      )}`
    );
  }
  return result();
}
