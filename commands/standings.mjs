import fetch from "node-fetch";
export const name = "standings";
export const description =
  "This command will give the standings of a specific year";
export function execute(message, args) {
  let command = message.content.split(" ")[0];
  let currentYear = new Date().getFullYear();
  let askedYear = args[0] === undefined ? "current" : args[0];

  if ((askedYear.length !== 4 || isNaN(askedYear)) && askedYear !== "current") {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`,\n*For example:* \`${command} 1988\`, \nYou can use \`current\` for the year to check current standings quickly.\n*For example:*\`${command} current\`. Learn more by using \`+help\` command.`
    );
  } else if (
    askedYear > currentYear &&
    !isNaN(askedYear) &&
    askedYear.length === 4
  ) {
    return message.channel.send(
      `I don't know what is going to happen in ${askedYear}`
    );
  } else {
    async function result() {
      try {
        const response = await fetch(
          `https://ergast.com/api/f1/${askedYear}/driverStandings.json`
        );

        const data = await response.json();
        const table = await data.MRData.StandingsTable;
        const standingList = await table.StandingsLists[0];
        const driverStandings = await standingList.DriverStandings;
        const season = standingList.season;

        let standings = driverStandings.map(
          (p) =>
            `${p.position}  ${p.Driver.givenName[0]}. ${p.Driver.familyName} (${p.Constructors[0].name})  -  ${p.points} points`
        );

        message.channel.send(
          `Here is the driver standings of **${season}** season. \n ${standings.join(
            " \n"
          )}`
        );
      } catch (err) {
        console.log(err);
        message.channel.send("hmm... :thinking:");
      }
    }
    return result();
  }
}
