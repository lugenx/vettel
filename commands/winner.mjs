//in progress

import fetch from "node-fetch";
export const name = "winner";
export const description =
  "This command will give a winner for specific year and gp";
export function execute(message, args) {
  async function result() {
    const response = await fetch(
      "https://ergast.com/api/f1/" + args[0] + "/" + args[1] + "/results.json"
    );

    const data = await response.json();
    const race = await data.MRData.RaceTable.Races[0];
    const raceResults = await race.Results;
    const gpName = await race.raceName;
    const season = await race.season;

    const winnerName =
      raceResults[0].Driver.givenName + " " + raceResults[0].Driver.familyName;
    const winnerTeam = raceResults[0].Constructor.name;
    const winnerFinishTime = raceResults[0].Time.time;

    message.channel.send(
      `The winner of ${season} ${gpName} is **${winnerName}** from ${winnerTeam}. He crossed the finish line in ${winnerFinishTime}.`
    );
  }
  return result();
}
