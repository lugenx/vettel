export const name = "help";
export const description =
  "this command is for helping the users with commands";
export const execute = function (message, args) {
  message.channel.send(
    "\n\n**World Drivers' Champion: **Enter `+wdc` and a `YEAR`\n*Example:* `+wdc 1988` *(Alternative commands: `+champ`, `+champion`)*\n\n**Driver Standings: **Enter `+stand` and a `YEAR`\n*Example:* `+stand 2021` *(Alternative command: `+standings`)*\n\n**Race Calendar:** Enter `+calendar` and a `YEAR`\n*Example:* `+calendar 1988` *(Alternative commands: `+cal`, `+schedule`, `+program`)*\n\n**Grand Prix Winner: **Enter `+winner`, `YEAR` and a `keyword` to identify a Grand Prix.\n*Example:* `+winner 2021 brazil`\n\n**Podium: **Enter `+podium`, `YEAR` and a `keyword` to identify a Grand Prix.\n*Example:* `+podium 2011 british`\n\n**Race results:** Enter `+race`, `YEAR` and a `keyword` to identify a Grand Prix.\n*Example:* `+race 1971 monza` *(Alternative commands: `+result`,`+results`)*\n\n**Qualifying results: **Enter `+quali`, `YEAR` and a `keyword` to identify a Grand Prix.\n*Example:* `+quali 1971 monza` *(Alternative command: `+qualifying`)*\n\n"
  );
};
