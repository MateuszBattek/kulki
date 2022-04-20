import { canvas, ctx, x, y, COLOR, BALLS_IN_ROW_TO_SMASH } from "./data";

export class Square {
  public x: number;
  public y: number;
  private width: number;
  private height: number;

  public ball: boolean;
  public selected: boolean;
  public color: string;

  constructor(x: number, y: number) {
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
  setColor(color: string) {
    this.color = color;
  }

  /**
   * Adds ball to square.
   */
  addBall() {
    this.ball = true;
    this.drawBall(15, COLOR.WHITE);
  }

  /**
   * Selects ball in square.
   */
  select() {
    this.selected = true;
    this.drawBall(22, COLOR.WHITE);
  }

  /**
   * Unselects ball in square.
   */
  unselect() {
    this.selected = false;
    this.drawBall(15, COLOR.WHITE);
  }

  /**
   * Draw a ball in square.
   * @param size  Radius of a ball in pixels.
   * @param color  Color of the backround of square.
   */
  drawBall(size: number, color: COLOR | string) {
    ctx.fillStyle = color;
    ctx.fillRect(
      this.y * this.width + 1,
      this.x * this.height + 1,
      this.width - 2,
      this.height - 2
    );

    ctx.beginPath();
    ctx.arc(
      this.y * this.width + 25,
      this.x * this.height + 25,
      size,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = COLOR.BLACK;
    ctx.lineWidth = 1;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Sets background to white if square is empty or draws a ball if it's selected.
   */
  fillWhite() {
    if (!this.ball) {
      ctx.fillStyle = COLOR.WHITE;
      ctx.fillRect(
        this.y * this.width + 1,
        this.x * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    } else if (this.selected) {
      this.drawBall(22, COLOR.RED);
    }
  }

  /**
   * Sets background to gray if square is empty or draws a ball if it's selected.
   */
  fillGray() {
    if (!this.ball) {
      ctx.fillStyle = "#AAAAAA";
      ctx.fillRect(
        this.y * this.width + 1,
        this.x * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    } else if (this.selected) {
      this.drawBall(22, COLOR.RED);
    }
  }

  /**
   * Sets background to red.
   */
  fillPath() {
    if (!this.ball) {
      ctx.fillStyle = COLOR.RED;
      ctx.fillRect(
        this.y * this.width + 1,
        this.x * this.height + 1,
        this.width - 2,
        this.height - 2
      );
    }
  }

  /**
   * Removes a ball from the square.
   */
  removeBall() {
    this.ball = false;
    this.color = COLOR.BLACK;
    this.fillWhite();
  }
}
