//fix it
import fetch from "node-fetch";
export const name = "wdc";
export const description =
  "This command will give the world driver champion of the specific year";
export function execute(message, args) {
  let currentYear = new Date().getFullYear();

  if (
    (args[0] === undefined || args[0].length !== 4 || isNaN(args[0])) &&
    args[0] !== "current"
  ) {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`+wdc\`,\n*For example:* \`+wdc 1988\`, \nYou can use \`current\` for the year to check most recent world champion quickly.\n*For example:*\`+wdc current\`. Learn more by using \`+help\` command.`
    );
  } else if (
    args[0] > currentYear &&
    !isNaN(args[0]) &&
    args[0] !== undefined &&
    args[0].length === 4
  ) {
    return message.channel.send(
      `The world champion of ${args[0]} huh? We'll see. Hopefully.`
    );
  } else {
    async function result() {
      try {
        const response = await fetch(
          "https://ergast.com/api/f1/driverstandings/1.json"
        );

        const data = await response.json();
        const table = await data.MRData.StandingsTable;
        const allSeasons = await table.StandingsLists;
        let askedSeason;
        //TODO: loop doesnt work. Fix it.
        for (let s = 0; s < allSeasons.length; s++) {
          if (allSeasons[s].season == args[0]) {
            askedSeason = await allSeasons[s];
          }
        }
        const seasonYear = await askedSeason.season;
        console.log("seasonYear: " + seasonYear);
        const wdc = await askedSeason.DriverStandings[0];
        const wdcTeam = await wdc.Constructors[0].name;
        const wdcNationality = await wdc.Driver.nationality;
        const wdcTotalWins = await wdc.wins;
        const wdcFullName =
          (await wdc.Driver.givenName) + " " + wdc.Driver.familyName;
        message.channel.send(
          `The world drivers' champion of the ${seasonYear} season is ${wdcNationality} driver **${wdcFullName}** from the ${wdcTeam} team. He won a total of ${wdcTotalWins} races of the season`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("hmm... :thinking:");
      }
    }
    return result();
  }
}
