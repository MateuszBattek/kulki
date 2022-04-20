"use strict";
exports.__esModule = true;
var board_1 = require("./board");
var data_1 = require("./data");
/**
 * Declares new Board object.
 */
var board = new board_1.Board();
/**
 * Adds function on click on canvas.
 */
data_1.canvas.addEventListener("click", function (event) {
    board.selectBall(event);
});
/**
 * Adds function on mouse moving on canvas.
 */
data_1.canvas.addEventListener("mousemove", function (event) {
    board.drawPath(event);
});
board.startGame();
console.log(board.array);
