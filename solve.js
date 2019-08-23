const {
  printBoard,
  setNumber,
  hasBlankSlot,
  makeCopy,
  boardString
} = require("./utils");

//Puzzle boards should be of the following form. Empty slots are zeros
let board = [[], [], [], [], [], [], [], [], []];
board = require("./puzzles/everest");

function solve(board, pickFirstOfTwo = false, pickSecondOfTwo = false) {
  for (let i = 0; i < board.length; i++) {
    let row = board[i];
    let squareI = Math.floor(i / 3) * 3;

    for (let j = 0; j < row.length; j++) {
      if (row[j]) continue; //already filled with a number
      const rowMissingNumbers = getMissingNumbers(row);
      //console.log("\n");
      let squareJ = Math.floor(j / 3) * 3;
      const squareMissingNumbers = getSquareMissingNumbers(
        squareI,
        squareJ,
        board
      );
      //console.log(`looking at (${i}, ${j})`);
      //console.log(`Square Missing: `, squareMissingNumbers);
      const columnMissingNumbers = getColumnMissingNumbers(j, board);
      //console.log(`Row Missing: `, rowMissingNumbers);
      //console.log(`Column Missing:`, columnMissingNumbers);
      // const possibleNumbers
      let possibleNumbers = squareMissingNumbers.filter(value =>
        rowMissingNumbers.includes(value)
      );
      possibleNumbers = possibleNumbers.filter(value =>
        columnMissingNumbers.includes(value)
      );
      if (possibleNumbers.length == 1) {
        setNumber(i, j, possibleNumbers[0], board);
      } else if (pickFirstOfTwo && possibleNumbers.length == 2) {
        setNumber(i, j, possibleNumbers[0], board);
        pickFirstOfTwo = false;
      } else if (pickSecondOfTwo && possibleNumbers.length == 2) {
        setNumber(i, j, possibleNumbers[1], board);
        pickSecondOfTwo = false;
      }
      if (possibleNumbers.length == 0) {
        //Empty slot with no possible numbers to go into it.
        // console.log(`looking at (${i}, ${j})`);
        // console.log(`Square Missing: `, squareMissingNumbers);
        // console.log(`Row Missing: `, rowMissingNumbers);
        // console.log(`Column Missing:`, columnMissingNumbers);
        // console.log(`possible numbers`, possibleNumbers);
        // printBoard(board);
        return false;
      }
    }
  }
  //printBoard(board);
  return true;
}

// let count = 1;
// let prevBoard = JSON.stringify(board);
// let haveYetToPickFirst = true;
// let haveYetToPickSecond = true;
// let freezeBoard = {};
// while (hasBlankSlot(board) && count < 41) {
//   console.log(`\n\nROUND ${count}\n\n`);
//   solve(board);
//   if (JSON.stringify(board) == prevBoard) {
//     console.log(`\nBoard is the Same after round ${count}`);
//     if (haveYetToPickFirst) {
//       console.log(`\nPicking First`);
//       freezeBoard = makeCopy(board);
//       solve(board, haveYetToPickFirst);
//       haveYetToPickFirst = false;
//     } else if (haveYetToPickSecond) {
//       console.log(`\nPicking Second`);
//       board = makeCopy(freezeBoard);
//       solve(board, haveYetToPickFirst, haveYetToPickSecond);
//       haveYetToPickSecond = false;
//     } else break;
//   }
//   prevBoard = JSON.stringify(board);
//   count++;
// }

function solvingTree(board, count = 1, pickFirst = false, pickSecond = false) {
  if (!hasBlankSlot(board)) {
    printBoard(board);
    //console.log("Done!");
    return true;
  }
  //console.log(`\nROUND ${count}`);
  let prevBoard = makeCopy(board);
  count++;
  const doneProgress = solve(board, pickFirst, pickSecond);
  // console.log("Progress?", doneProgress);
  if (!doneProgress) {
    //console.log("Empty slot with no possible numbers to go into it.");
    return false;
  } else if (boardString(board) == boardString(prevBoard)) {
    //console.log("Board has not changed");
    const freezeBoard = makeCopy(board);
    const freezeCount = count;
    const tryFirst = solvingTree(board, count, true);
    if (!tryFirst) {
      board = makeCopy(freezeBoard);
      count = freezeCount;
      const trySecond = solvingTree(board, count, false, true);
      if (!trySecond) {
        //console.log("UHOH problem solving");
        return false;
      }
    }
    return true;
  } else {
    //console.log(`\nRecurse`);
    return solvingTree(board, count);
  }
}

const start = new Date();
let hrstart = process.hrtime();
console.log(`Started on ${start}`);
const wasSolved = solvingTree(board);
console.log(`Was the puzzle solved? ${wasSolved ? "Yes" : "No"}`);
const end = new Date() - start;
const hrend = process.hrtime(hrstart);
console.info("Execution time: %dms", end);
console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);

function getMissingNumbers(list) {
  const missing = [];
  for (let n = 1; n < 10; n++) if (list.indexOf(n) == -1) missing.push(n);
  return missing;
}

function getSquareMissingNumbers(squareI, squareJ, board) {
  const present = [];
  const iEnd = squareI + 3;
  const jEnd = squareJ + 3;
  for (squareI; squareI < iEnd; squareI++)
    for (let j = squareJ; j < jEnd; j++) present.push(board[squareI][j]);
  return getMissingNumbers(present);
}

function getColumnMissingNumbers(j, board) {
  const column = board.map(row => row[j]);
  return getMissingNumbers(column);
}
