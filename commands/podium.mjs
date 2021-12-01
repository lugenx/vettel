import fetch from "node-fetch";
export const name = "podium";
export const description =
  "This command will give a podium for specific year and gp";
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
  }
  return result();
}
