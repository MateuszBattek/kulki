import { Board } from "./board";

import { canvas, ctx, x, y, COLOR, BALLS_IN_ROW_TO_SMASH } from "./data";

/**
 * Declares new Board object.
 */
let board: Board = new Board();

/**
 * Adds function on click on canvas.
 */
canvas.addEventListener("click", function (event) {
  board.selectBall(event);
});

/**
 * Adds function on mouse moving on canvas.
 */
canvas.addEventListener("mousemove", function (event) {
  board.drawPath(event);
});

board.startGame();

console.log(board.array);
