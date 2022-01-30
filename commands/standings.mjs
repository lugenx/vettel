import fetch from "node-fetch";
export const name = "standings";
export const description =
  "This command will give the standings of a specific year";
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
      `There wasn't a Championship in ${arg}. The First Formula 1 season was in **1950**.`
    );
  }

  if (argIsAYear && arg > currentYear) {
    return message.channel.send(
      `I don't know what is going to happen in ${arg}`
    );
  }

  async function result() {
    try {
      const response = await fetch(
        `https://ergast.com/api/f1/${arg}/driverStandings.json`
      );

      const data = await response.json();
      const table = await data.MRData.StandingsTable;
      const standingList = await table.StandingsLists[0];
      const driverStandings = await standingList.DriverStandings;
      const season = standingList.season;

      let standings = driverStandings.map(
        (p) =>
          `${p.position}  ${p.Driver.givenName[0]}. ${p.Driver.familyName}  -  ${p.points} points`
      );

      let standingsStr = standings.join("\n");

      message.channel.send(
        `Here is the driver standings of **${season}** season. \n ${standingsStr}`
      );
    } catch (err) {
      console.log(err);
      message.channel.send("hmm... :thinking:");
    }
  }
  return result();
}
