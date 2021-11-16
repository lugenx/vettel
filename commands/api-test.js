import fetch from "node-fetch";

async function getData() {
  const response = await fetch(
    "https://ergast.com/api/f1/current/last/results.json"
  );
  const data = await response.json();
  console.log(data.MRData.RaceTable.Races[0].Results[0].Driver);
}

console.log(getData());
