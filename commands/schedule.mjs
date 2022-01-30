import fetch from "node-fetch";
export const name = "schedule";
export const description =
  "This command will give the schedule of the requested year";
export function execute(message, args) {
  const currentYear = new Date().getFullYear();

  //User inputs: +command arg
  const command = message.content.split(" ")[0];
  const arg = args[0];
  const argIsAYear = arg && arg.length === 4 && !isNaN(arg) && arg < 3000;

  if (!argIsAYear && arg !== "current") {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`,\n*For example:* \`${command} 2016\`. Learn more by using \`+help\` command.`
    );
  }

  if (argIsAYear && arg < 1950) {
    return message.channel.send(
      `There wasn't a Championship in ${arg}. The First Formula 1 season was in **1950**.`
    );
  }

  if (argIsAYear && arg > currentYear + 1) {
    return message.channel.send(`I don't know about ${arg} yet`);
  }

  async function result() {
    try {
      const response = await fetch(`https://ergast.com/api/f1/${arg}.json`);

      const data = await response.json();
      const table = await data.MRData.RaceTable;
      const races = await table.Races;
      const season = await table.season;

      // changes the date formatting
      const monthsArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let calendar = [];

      let raceName, monthNum, month, day;

      for (let race of races) {
        raceName = race.raceName;
        monthNum = race.date.slice(
          race.date.indexOf("-") + 1,
          race.date.lastIndexOf("-")
        );
        month = monthsArr[Number(monthNum) - 1];
        day = race.date.slice(race.date.lastIndexOf("-") + 1);
        calendar.push(`(${month} ${day})  ${raceName} `);
      }

      let calendarStr = calendar.join("\n");

      message.channel.send(
        `Here is the schedule of the **${season}** season. \n ${calendarStr}`
      );
    } catch (err) {
      console.log(err);
      message.channel.send("hmm... :thinking:");
    }
  }
  return result();
}
