//TODO: "+wdc current" will show current champion. Make sure API doesnt give first place as a champ in the middle of the season.
//also make sure entering current year like "+wdc 2022" will not give the first place before season finish.
import fetch from "node-fetch";
export const name = "wdc";
export const description =
  "This command will give the world driver champion of the specific year";
export function execute(message, args) {
  const currentYear = new Date().getFullYear();

  //User inputs: +command arg
  const command = message.content.split(" ")[0];
  const arg = args[0] || "current";
  const argIsAYear = arg && arg.length === 4 && !isNaN(arg) && arg < 3000;

  if (!argIsAYear && arg !== "current") {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`,\n*For example:* \`${command} 1988\`. Learn more by using \`+help\` command.`
    );
  }

  if (argIsAYear && arg < 1950) {
    return message.channel.send(
      `There wasn't a Championship in ${arg}. The First Formula 1 Drivers' Championship was in **1950**.`
    );
  }

  if (argIsAYear && arg > currentYear) {
    return message.channel.send(
      `The world champion of ${arg} huh? We'll see. Hopefully.`
    );
  }

  async function result() {
    try {
      const response = await fetch(
        "https://ergast.com/api/f1/driverstandings/1.json?limit=300&offset=0"
      );

      const data = await response.json();
      const table = await data.MRData.StandingsTable;
      const allSeasons = await table.StandingsLists;
      let askedSeason;

      for (let s = 0; s < allSeasons.length; s++) {
        if (allSeasons[s].season == arg) {
          askedSeason = await allSeasons[s];
        }
      }

      const seasonYear = await askedSeason.season;

      const wdc = await askedSeason.DriverStandings[0];
      const wdcTeam = await wdc.Constructors[0].name;
      const wdcNationality = await wdc.Driver.nationality;
      const wdcTotalWins = await wdc.wins;
      const wdcFullName =
        (await wdc.Driver.givenName) + " " + wdc.Driver.familyName;
      const totalRaces = await askedSeason.round;

      message.channel.send(
        `The world drivers' champion of the ${seasonYear} season is ${wdcNationality} driver **${wdcFullName}** from the ${wdcTeam} team. He won a total of ${wdcTotalWins} out of ${totalRaces} races of the season.`
      );
    } catch (err) {
      console.log(err);
      message.channel.send("hmm... :thinking:");
    }
  }
  return result();
}
