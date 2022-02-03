export function randomMsg(arr) {
  let arrLength = arr.length;
  let randomIndex = Math.floor(Math.random() * arrLength);
  return arr[randomIndex];
}
