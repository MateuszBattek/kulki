"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Board = void 0;
// import { Square } from "./square";
// import { Spot } from "./findingPath";
var data_1 = require("./data");
var square_1 = require("./square");
var findingPath_1 = require("./findingPath");
var decorators_1 = require("./decorators");
var Board = /** @class */ (function () {
    function Board() {
        this.squareArray = [];
        this.array = [];
        this.path = [];
        this.width = 50;
        this.height = 50;
        for (var i = 0; i < data_1.y; i++) {
            this.squareArray.push([]);
            this.array.push([]);
            for (var j = 0; j < data_1.x; j++) {
                this.squareArray[i].push(new square_1.Square(i, j));
                this.array[i].push(false);
            }
        }
        this.selected = null;
        this.disabled = false;
        this.lost = false;
        this.ballsPlaced = 0;
        this.points = 0;
        this.vanishArray = [];
        this.colors = this.getRandomColors();
    }
    /**
     * Sets up canvas, creates a board.
     */
    Board.prototype.createCanvas = function () {
        data_1.canvas.width = this.width * data_1.y + 200;
        data_1.canvas.height = this.height * data_1.x;
        document.body.appendChild(data_1.canvas);
        data_1.ctx.strokeStyle = data_1.COLOR.BLACK;
        data_1.ctx.strokeRect(0, 0, data_1.canvas.width - 200, data_1.canvas.height);
        for (var i = 1; i < data_1.y; i++) {
            data_1.ctx.beginPath();
            data_1.ctx.moveTo(0, i * this.width);
            data_1.ctx.lineTo(data_1.canvas.width - 200, i * this.width);
            data_1.ctx.stroke();
        }
        for (var i = 1; i < data_1.x; i++) {
            data_1.ctx.beginPath();
            data_1.ctx.moveTo(i * this.height, 0);
            data_1.ctx.lineTo(i * this.height, data_1.canvas.height);
            data_1.ctx.stroke();
        }
        //this.colors = this.getRandomColors();
        this.writeStuff();
        data_1.ctx.closePath();
    };
    /**
     * Updates writing box with number of points and next set of balls.
     */
    Board.prototype.writeStuff = function () {
        data_1.ctx.fillStyle = data_1.COLOR.WHITE;
        data_1.ctx.fillRect(this.width * data_1.y, 0, 200, data_1.canvas.height);
        data_1.ctx.fillStyle = "Black";
        data_1.ctx.font = "20px Arial";
        data_1.ctx.fillText("Points: ", this.width * data_1.y + 10, 50);
        data_1.ctx.fillText(String(this.points), this.width * data_1.y + 100, 50);
        data_1.ctx.fillText("Następne: ", this.width * data_1.y + 10, 100);
        for (var i = 0; i < this.colors.length; i++) {
            data_1.ctx.beginPath();
            data_1.ctx.arc(this.width * data_1.y + 10 + 25 + i * 50, 150, 15, 0, 2 * Math.PI);
            data_1.ctx.strokeStyle = data_1.COLOR.BLACK;
            data_1.ctx.lineWidth = 1;
            data_1.ctx.fillStyle = this.colors[i];
            data_1.ctx.fill();
            data_1.ctx.stroke();
            data_1.ctx.closePath();
        }
    };
    /**
     * Returns an array of three strings of randomly chosen colors.
     */
    Board.prototype.getRandomColors = function () {
        var colorsArray = [];
        for (var i = 0; i < 3; i++) {
            var enumValues = Object.values(data_1.COLOR);
            var randomIndex = Math.floor(Math.random() * enumValues.length);
            var randomEnumValue = enumValues[randomIndex];
            // console.log(randomEnumValue);
            colorsArray.push(randomEnumValue);
        }
        return colorsArray;
    };
    /**
     * Spawns 3 new balls. If can't spawn, alerts that you lost.
     */
    Board.prototype.spawnNewBalls = function () {
        var colors = this.colors;
        this.colors = this.getRandomColors();
        this.writeStuff();
        for (var i = 0; i < 3;) {
            var randomX = Math.floor(Math.random() * data_1.x);
            var randomY = Math.floor(Math.random() * data_1.y);
            if (this.squareArray[randomY][randomX].ball == false) {
                this.squareArray[randomY][randomX].setColor(colors[i]);
                this.squareArray[randomY][randomX].addBall();
                this.array[randomY][randomX] = true;
                this.ballsPlaced++;
                this.checkVertically(randomY, randomX);
                this.checkHorizontally(randomY, randomX);
                this.checkDiagonally(randomY, randomX);
                this.smash();
                this.vanishArray = [];
                if (this.ballsPlaced >= data_1.x * data_1.y) {
                    this.lost = true;
                    alert("Przegrałeś! Punkty: " + this.points);
                    return;
                }
            }
            else
                continue;
            i++;
        }
    };
    /**
     * Selects clicked ball or unselects if already selected.
     * * @param e  Called on click.
     */
    Board.prototype.selectBall = function (e) {
        if (!this.disabled && e.clientX <= this.width * data_1.y) {
            var y_1 = Math.floor((e.clientX - 8) / this.width);
            var x_1 = Math.floor((e.clientY - 8) / this.height);
            if (this.squareArray[x_1][y_1].ball == true) {
                if (this.squareArray[x_1][y_1].selected == false) {
                    if (this.selected != null)
                        this.selected.unselect();
                    this.squareArray[x_1][y_1].select();
                    this.selected = this.squareArray[x_1][y_1];
                }
                else {
                    this.squareArray[x_1][y_1].unselect();
                    this.selected = null;
                }
                return;
            }
            if (this.selected != null && this.path.length > 1) {
                this.moveBall(this.selected, x_1, y_1);
            }
        }
    };
    /**
     * Draws shortest path from selected ball to the square of your mouse location.
     * @param e  Called on mousemove.
     */
    Board.prototype.drawPath = function (e) {
        if (this.selected != null && e.clientX <= this.width * data_1.y) {
            var startY = this.selected.x;
            var startX = this.selected.y;
            var endY = Math.floor((e.clientX - 8) / this.width);
            var endX = Math.floor((e.clientY - 8) / this.height);
            var path = findingPath_1.Spot.setUpArray(this.array, startX, startY, endX, endY);
            this.clearAllSquares();
            for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                var coords = path_1[_i];
                this.squareArray[coords[1]][coords[0]].fillPath();
            }
            this.path = path;
        }
    };
    /**
     * Leaves gray trace of the path after moving the ball.
     */
    Board.prototype.leaveTrace = function () {
        for (var _i = 0, _a = this.path; _i < _a.length; _i++) {
            var coords = _a[_i];
            this.squareArray[coords[1]][coords[0]].fillGray();
        }
        this.path = [];
        this.disabled = true;
    };
    /**
     * Moves selected ball to clicked position.
     */
    Board.prototype.moveBall = function (square, x, y) {
        var _this = this;
        square.selected = false;
        this.selected = null;
        square.ball = false;
        this.array[square.x][square.y] = false;
        this.squareArray[x][y].ball = true;
        this.squareArray[x][y].setColor(square.color);
        this.squareArray[x][y].drawBall(15, "#AAAAAA");
        this.array[x][y] = true;
        this.leaveTrace();
        window.setTimeout(function () {
            _this.clearAllSquares();
            _this.disabled = false;
            _this.squareArray[x][y].drawBall(15, data_1.COLOR.WHITE);
            if (!_this.lost) {
                _this.checkVertically(x, y);
                _this.checkHorizontally(x, y);
                _this.checkDiagonally(x, y);
                var isSmashed = _this.smash();
                _this.writeStuff();
                _this.vanishArray = [];
                if (!isSmashed)
                    _this.spawnNewBalls();
            }
        }, 1000);
    };
    /**
     * Changes background of all squares to default white.
     */
    Board.prototype.clearAllSquares = function () {
        for (var _i = 0, _a = this.squareArray; _i < _a.length; _i++) {
            var squares = _a[_i];
            for (var _b = 0, squares_1 = squares; _b < squares_1.length; _b++) {
                var square = squares_1[_b];
                square.fillWhite();
            }
        }
    };
    /**
     * Check if there is min. 5 balls in a row vertically, if yes adds them to an array to remove.
     */
    Board.prototype.checkVertically = function (x, y) {
        var _a;
        var color = this.squareArray[x][y].color;
        var vertArr = [];
        vertArr.push(this.squareArray[x][y]);
        var i = 1;
        while (x - i >= 0) {
            if (this.squareArray[x - i][y].color == color &&
                this.squareArray[x - i][y].ball) {
                vertArr.push(this.squareArray[x - i][y]);
                i++;
            }
            else
                break;
        }
        i = 1;
        while (x + i <= 8) {
            if (this.squareArray[x + i][y].color == color &&
                this.squareArray[x + i][y].ball) {
                vertArr.push(this.squareArray[x + i][y]);
                i++;
            }
            else
                break;
        }
        if (vertArr.length >= data_1.BALLS_IN_ROW_TO_SMASH)
            (_a = this.vanishArray).push.apply(_a, vertArr);
    };
    /**
     * Check if there is min. 5 balls in a row horizontally, if yes adds them to an array to remove.
     */
    Board.prototype.checkHorizontally = function (x, y) {
        var _a;
        var color = this.squareArray[x][y].color;
        var horiArr = [];
        horiArr.push(this.squareArray[x][y]);
        var i = 1;
        while (y - i >= 0) {
            if (this.squareArray[x][y - i].color == color &&
                this.squareArray[x][y - i].ball) {
                horiArr.push(this.squareArray[x][y - i]);
                i++;
            }
            else
                break;
        }
        i = 1;
        while (y + i <= 8) {
            if (this.squareArray[x][y + i].color == color &&
                this.squareArray[x][y + i].ball) {
                horiArr.push(this.squareArray[x][y + i]);
                i++;
            }
            else
                break;
        }
        if (horiArr.length >= data_1.BALLS_IN_ROW_TO_SMASH)
            (_a = this.vanishArray).push.apply(_a, horiArr);
    };
    /**
     * Check if there is min. 5 balls in a row diagonally, if yes adds them to an array to remove.
     */
    Board.prototype.checkDiagonally = function (x, y) {
        var _a, _b;
        var color = this.squareArray[x][y].color;
        var diagArr = [];
        diagArr.push(this.squareArray[x][y]);
        var i = 1;
        while (y - i >= 0 && x - i >= 0) {
            if (this.squareArray[x - i][y - i].color == color &&
                this.squareArray[x - i][y - i].ball) {
                diagArr.push(this.squareArray[x - i][y - i]);
                i++;
            }
            else
                break;
        }
        i = 1;
        while (y + i <= 8 && x + i <= 8) {
            if (this.squareArray[x + i][y + i].color == color &&
                this.squareArray[x + i][y + i].ball) {
                diagArr.push(this.squareArray[x + i][y + i]);
                i++;
            }
            else
                break;
        }
        if (diagArr.length >= data_1.BALLS_IN_ROW_TO_SMASH)
            (_a = this.vanishArray).push.apply(_a, diagArr);
        diagArr = [];
        diagArr.push(this.squareArray[x][y]);
        i = 1;
        while (y - i >= 0 && x + i <= 8) {
            if (this.squareArray[x + i][y - i].color == color &&
                this.squareArray[x + i][y - i].ball) {
                diagArr.push(this.squareArray[x + i][y - i]);
                i++;
            }
            else
                break;
        }
        i = 1;
        while (y + i <= 8 && x - i >= 0) {
            if (this.squareArray[x - i][y + i].color == color &&
                this.squareArray[x - i][y + i].ball) {
                diagArr.push(this.squareArray[x - i][y + i]);
                i++;
            }
            else
                break;
        }
        if (diagArr.length >= data_1.BALLS_IN_ROW_TO_SMASH)
            (_b = this.vanishArray).push.apply(_b, diagArr);
    };
    /**
     * Smashes balls.
     */
    Board.prototype.smash = function () {
        var smashArray = this.vanishArray.filter(function (x, i, a) { return a.indexOf(x) == i; });
        this.points += smashArray.length;
        for (var _i = 0, smashArray_1 = smashArray; _i < smashArray_1.length; _i++) {
            var square = smashArray_1[_i];
            square.removeBall();
            this.array[square.x][square.y] = false;
        }
        this.ballsPlaced -= smashArray.length;
        return smashArray.length > 0;
    };
    /**
     * Starts new game.
     */
    Board.prototype.startGame = function () {
        this.createCanvas();
        this.spawnNewBalls();
    };
    __decorate([
        decorators_1.log
    ], Board.prototype, "writeStuff");
    __decorate([
        decorators_1.log
    ], Board.prototype, "smash");
    return Board;
}());
exports.Board = Board;
//import { canvas, ctx, x, y, COLOR } from "./main";
