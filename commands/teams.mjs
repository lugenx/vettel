import fetch from "node-fetch";
export const name = "teams";
export const description =
  "this command will give team standings of specific year";
export function execute(message, args) {
  const currentYear = new Date().getFullYear();

  //User inputs: +command firstArg secondArg
  const command = message.content.split(" ")[0];
  const firstArg = args[0];
  const firstArgIsAYear =
    firstArg && firstArg.length === 4 && !isNaN(firstArg) && firstArg < 3000;

  if (!firstArgIsAYear && firstArg !== "current") {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`,\n*For example:* \`${command} 1988\`. Learn more by using \`+help\` command.`
    );
  }

  if (firstArgIsAYear && firstArg > currentYear) {
    return message.channel.send(`Well ${firstArg} is not here yet...`);
  }

  async function result() {
    try {
      const response = await fetch(
        `https://ergast.com/api/f1/${firstArg}/constructorStandings.json`
      );

      const data = await response.json();

      const table = await data.MRData.StandingsTable;
      const standingList = await table.StandingsLists[0];
      const teamStandings = await standingList.ConstructorStandings;
      const season = await standingList.season;

      let standings = teamStandings.map(
        (p) => `${p.position}  ${p.Constructor.name}  -  ${p.points} points`
      );
      let standingsStr = standings.join("\n");
      message.channel.send(
        `Here is the constructor standings of **${season}** season. \n ${standingsStr}`
      );
    } catch (err) {
      console.log(err);
      message.channel.send("hmm :thinking:");
    }
  }
  return result();
}
