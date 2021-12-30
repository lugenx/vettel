import fetch from "node-fetch";
export const name = "schedule";
export const description =
  "This command will give the schedule of the requested year";
export function execute(message, args) {
  let command = message.content.split(" ")[0];
  let currentYear = new Date().getFullYear();
  let askedYear = args[0] === undefined ? "current" : args[0];

  if ((askedYear.length !== 4 || isNaN(askedYear)) && askedYear !== "current") {
    return message.channel.send(
      `Enter a \`YEAR\` after the \`${command}\`,\n*For example:* \`${command} 2016\`, \nYou can use \`current\` for the year to check the schedule of current year quickly.\n*For example:*\`${command} current\`. Learn more by using \`+help\` command.`
    );
  } else if (
    askedYear > currentYear + 1 &&
    !isNaN(askedYear) &&
    askedYear.length === 4
  ) {
    return message.channel.send(`I don't know about ${askedYear} yet`);
  } else {
    async function result() {
      try {
        const response = await fetch(
          `https://ergast.com/api/f1/${askedYear}.json`
        );

        const data = await response.json();
        const table = await data.MRData.RaceTable;
        const races = await table.Races;
        const season = table.season;

        // change the date formatting
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

        message.channel.send(
          `Here is the schedule of the **${season}** season. \n ${calendar.join(
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
