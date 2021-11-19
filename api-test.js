import fetch from "node-fetch";

async function getData() {
  const response = await fetch(
    "https://ergast.com/api/f1/current/last/results.json"
  );

  const data = await response.json();
  const lastRaceResults = await data.MRData.RaceTable.Races[0].Results;
  const driversStanding = [];
  for (let r = 0; r < lastRaceResults.length; r++) {
    driversStanding.push(r + 1 + " " + lastRaceResults[r].Driver.familyName);
  }
  console.log(driversStanding);

  //console.log(data.MRData.RaceTable.Races[0].Results[0].Driver);
}

let result = getData();
console.log(result);
