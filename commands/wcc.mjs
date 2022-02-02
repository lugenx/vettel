//TODO: "+wcc current" will show current champion. Make sure API doesnt give first place as a champ in the middle of the season.
//also make sure entering current year like "+wcc 2022" will not give the first place before season finish.
import fetch from "node-fetch";
export const name = "wcc";
export const description =
  "This command will give the world constructors champion of the specific year";
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
      `There wasn't a Constructors' Championship in ${arg}. The First Constructors' title was awarded in **1958**.`
    );
  }

  if (argIsAYear && arg > currentYear) {
    return message.channel.send(
      `The world Constructors' champion of ${arg} huh? We'll see. Hopefully.`
    );
  }

  async function result() {
    try {
      const response = await fetch(
        "https://ergast.com/api/f1/constructorStandings/1.json?limit=300&offset=0"
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

      const wcc = await askedSeason.ConstructorStandings[0];
      //const wdcTeam = await wdc.Constructors[0].name;
      const wccNationality = await wcc.Constructor.nationality;
      const wccTotalWins = await wcc.wins;
      const wccName = await wcc.Constructor.name;
      const totalRaces = await askedSeason.round;

      message.channel.send(
        `The ${wccNationality} constructor **${wccName}** is the World Constructors' Champion of the ${seasonYear} season. The team won ${wccTotalWins} out of ${totalRaces} races of the season.`
      );
    } catch (err) {
      console.log(err);
      message.channel.send("hmm... :thinking:");
    }
  }
  return result();
}
