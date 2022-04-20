import { ctx, COLOR } from "./data";
var Square = /** @class */ (function () {
    function Square(x, y) {
        this.x = x;
        this.y = y;
        this.ball = false;
        this.color = COLOR.BLACK;
        this.width = 50;
        this.height = 50;
        this.selected = false;
    }
    /**
     * Sets color of square.
     */
    Square.prototype.setColor = function (color) {
        this.color = color;
    };
    /**
     * Adds ball to square.
     */
    Square.prototype.addBall = function () {
        this.ball = true;
        this.drawBall(15, COLOR.WHITE);
    };
    /**
     * Selects ball in square.
     */
    Square.prototype.select = function () {
        this.selected = true;
        this.drawBall(22, COLOR.WHITE);
    };
    /**
     * Unselects ball in square.
     */
    Square.prototype.unselect = function () {
        this.selected = false;
        this.drawBall(15, COLOR.WHITE);
    };
    /**
     * Draw a ball in square.
     * @param size  Radius of a ball in pixels.
     * @param color  Color of the backround of square.
     */
    Square.prototype.drawBall = function (size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.y * this.width + 1, this.x * this.height + 1, this.width - 2, this.height - 2);
        ctx.beginPath();
        ctx.arc(this.y * this.width + 25, this.x * this.height + 25, size, 0, 2 * Math.PI);
        ctx.strokeStyle = COLOR.BLACK;
        ctx.lineWidth = 1;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    };
    /**
     * Sets background to white if square is empty or draws a ball if it's selected.
     */
    Square.prototype.fillWhite = function () {
        if (!this.ball) {
            ctx.fillStyle = COLOR.WHITE;
            ctx.fillRect(this.y * this.width + 1, this.x * this.height + 1, this.width - 2, this.height - 2);
        }
        else if (this.selected) {
            this.drawBall(22, COLOR.RED);
        }
    };
    /**
     * Sets background to gray if square is empty or draws a ball if it's selected.
     */
    Square.prototype.fillGray = function () {
        if (!this.ball) {
            ctx.fillStyle = "#AAAAAA";
            ctx.fillRect(this.y * this.width + 1, this.x * this.height + 1, this.width - 2, this.height - 2);
        }
        else if (this.selected) {
            this.drawBall(22, COLOR.RED);
        }
    };
    /**
     * Sets background to red.
     */
    Square.prototype.fillPath = function () {
        if (!this.ball) {
            ctx.fillStyle = COLOR.RED;
            ctx.fillRect(this.y * this.width + 1, this.x * this.height + 1, this.width - 2, this.height - 2);
        }
    };
    /**
     * Removes a ball from the square.
     */
    Square.prototype.removeBall = function () {
        this.ball = false;
        this.color = COLOR.BLACK;
        this.fillWhite();
    };
    return Square;
}());
export { Square };
