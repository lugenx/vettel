import fetch from "node-fetch";
export const name = "last";
export const description = "the last gp";
export function execute(message, args) {
  if (
    args[0] === "gp" ||
    (args[0] === "grand" && args[1] === "prix") ||
    args[0] === "race" ||
    (args[0] === "race" && args[1] === "results") ||
    args[1] === "result" ||
    args[0] === "result" ||
    args[0] === "results"
  ) {
    async function result() {
      const response = await fetch(
        "https://ergast.com/api/f1/current/last/results.json"
      );

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
        `Most recent race was **${season} ${gpName}**. \nHere is the result: \n ${driversResultList.join(
          " \n"
        )}`
      );
    }
    return result();
  }
}
