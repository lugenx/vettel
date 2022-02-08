export function randomMsg(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return atob(arr[randomIndex]);
}
