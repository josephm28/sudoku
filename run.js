//Puzzle boards should be of the following form. Empty slots are zeros
const board = require("./puzzles/everest");
const solvingTree = require("./solve");

//Set up some timing details
const start = new Date();
let hrstart = process.hrtime();
console.log(`Started on ${start}`);
//Attempt to solve the puzzle
const wasSolved = solvingTree(board);
console.log(`Was the puzzle solved? ${wasSolved ? "Yes" : "No"}`);
//Calculate the execution time
const end = new Date() - start;
const hrend = process.hrtime(hrstart);
console.info("Execution time: %dms", end);
console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
