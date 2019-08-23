function printBoard(board) {
  const printable = JSON.parse(JSON.stringify(board));
  console.log("\n");
  printable.map((row, i) => {
    row.splice(3, 0, "|");
    row.splice(7, 0, "|");
    console.log(row.join(" "));
    if ((i + 1) % 3 == 0 && i && i != printable.length - 1)
      console.log(row.map(c => "-").join(" "));
  });
  console.log("\n");
}
function setNumber(i, j, number, board) {
  //console.log(`\nSET NUMBER! (${i}, ${j}) : ${number}`);
  board[i][j] = number;
}
function hasBlankSlot(board) {
  let hasBlank = false;
  board.map(r => {
    r.map(c => {
      if (!c) hasBlank = true;
    });
  });
  return hasBlank;
}
function makeCopy(board) {
  return JSON.parse(JSON.stringify(board));
}
function boardString(board) {
  return JSON.stringify(board);
}

module.exports = { printBoard, setNumber, hasBlankSlot, makeCopy, boardString };
