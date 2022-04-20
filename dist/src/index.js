import { Board } from "./board";
import { canvas } from "./data";
/**
 * Declares new Board object.
 */
var board = new Board();
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
