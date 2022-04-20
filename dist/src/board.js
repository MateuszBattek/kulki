var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { Square } from "./square";
// import { Spot } from "./findingPath";
import { canvas, ctx, x, y, COLOR, BALLS_IN_ROW_TO_SMASH } from "./data";
import { Square } from "./square";
import { Spot } from "./findingPath";
import { log } from "./decorators";
var Board = /** @class */ (function () {
    function Board() {
        this.squareArray = [];
        this.array = [];
        this.path = [];
        this.width = 50;
        this.height = 50;
        for (var i = 0; i < y; i++) {
            this.squareArray.push([]);
            this.array.push([]);
            for (var j = 0; j < x; j++) {
                this.squareArray[i].push(new Square(i, j));
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
        canvas.width = this.width * y + 200;
        canvas.height = this.height * x;
        document.body.appendChild(canvas);
        ctx.strokeStyle = COLOR.BLACK;
        ctx.strokeRect(0, 0, canvas.width - 200, canvas.height);
        for (var i = 1; i < y; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.width);
            ctx.lineTo(canvas.width - 200, i * this.width);
            ctx.stroke();
        }
        for (var i = 1; i < x; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.height, 0);
            ctx.lineTo(i * this.height, canvas.height);
            ctx.stroke();
        }
        //this.colors = this.getRandomColors();
        this.writeStuff();
        ctx.closePath();
    };
    /**
     * Updates writing box with number of points and next set of balls.
     */
    Board.prototype.writeStuff = function () {
        ctx.fillStyle = COLOR.WHITE;
        ctx.fillRect(this.width * y, 0, 200, canvas.height);
        ctx.fillStyle = "Black";
        ctx.font = "20px Arial";
        ctx.fillText("Points: ", this.width * y + 10, 50);
        ctx.fillText(String(this.points), this.width * y + 100, 50);
        ctx.fillText("Następne: ", this.width * y + 10, 100);
        for (var i = 0; i < this.colors.length; i++) {
            ctx.beginPath();
            ctx.arc(this.width * y + 10 + 25 + i * 50, 150, 15, 0, 2 * Math.PI);
            ctx.strokeStyle = COLOR.BLACK;
            ctx.lineWidth = 1;
            ctx.fillStyle = this.colors[i];
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    };
    /**
     * Returns an array of three strings of randomly chosen colors.
     */
    Board.prototype.getRandomColors = function () {
        var colorsArray = [];
        for (var i = 0; i < 3; i++) {
            var enumValues = Object.values(COLOR);
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
            var randomX = Math.floor(Math.random() * x);
            var randomY = Math.floor(Math.random() * y);
            if (this.squareArray[randomY][randomX].ball == false) {
                this.squareArray[randomY][randomX].setColor(colors[i]);
                this.squareArray[randomY][randomX].addBall();
                this.array[randomY][randomX] = true;
                this.ballsPlaced++;
                this.checkVertically(randomY, randomX);
                this.checkHorizontally(randomY, randomX);
                this.checkDiagonally(randomY, randomX);
                this.smash();
                if (this.ballsPlaced >= x * y) {
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
        if (!this.disabled && e.clientX <= this.width * y) {
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
        if (this.selected != null && e.clientX <= this.width * y) {
            var startY = this.selected.x;
            var startX = this.selected.y;
            var endY = Math.floor((e.clientX - 8) / this.width);
            var endX = Math.floor((e.clientY - 8) / this.height);
            var path = Spot.setUpArray(this.array, startX, startY, endX, endY);
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
            _this.squareArray[x][y].drawBall(15, COLOR.WHITE);
            if (!_this.lost) {
                _this.checkVertically(x, y);
                _this.checkHorizontally(x, y);
                _this.checkDiagonally(x, y);
                var isSmashed = _this.smash();
                _this.writeStuff();
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
        if (vertArr.length >= BALLS_IN_ROW_TO_SMASH)
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
        if (horiArr.length >= BALLS_IN_ROW_TO_SMASH)
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
        if (diagArr.length >= BALLS_IN_ROW_TO_SMASH)
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
        if (diagArr.length >= BALLS_IN_ROW_TO_SMASH)
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
        this.vanishArray = [];
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
        log,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Board.prototype, "startGame", null);
    return Board;
}());
export { Board };
//import { canvas, ctx, x, y, COLOR } from "./main";
