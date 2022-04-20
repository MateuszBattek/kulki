// import { Square } from "./square";
// import { Spot } from "./findingPath";
import { canvas, ctx, x, y, COLOR, BALLS_IN_ROW_TO_SMASH } from "./data";
import { Square } from "./square";
import { Spot } from "./findingPath";
import { log } from "./decorators";

export class Board {
  private width: number;
  private height: number;
  squareArray: Square[][] = [];
  array: boolean[][] = [];
  selected: Square | null;
  path: number[][] = [];
  disabled: boolean;
  lost: boolean;
  ballsPlaced: number;
  vanishArray: Square[];
  points: number;
  colors: string[];

  constructor() {
    this.width = 50;
    this.height = 50;
    for (let i = 0; i < y; i++) {
      this.squareArray.push([]);
      this.array.push([]);
      for (let j = 0; j < x; j++) {
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
  createCanvas() {
    canvas.width = this.width * y + 200;
    canvas.height = this.height * x;
    document.body.appendChild(canvas);

    ctx.strokeStyle = COLOR.BLACK;
    ctx.strokeRect(0, 0, canvas.width - 200, canvas.height);

    for (let i = 1; i < y; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.width);
      ctx.lineTo(canvas.width - 200, i * this.width);
      ctx.stroke();
    }

    for (let i = 1; i < x; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.height, 0);
      ctx.lineTo(i * this.height, canvas.height);
      ctx.stroke();
    }
    //this.colors = this.getRandomColors();
    this.writeStuff();
    ctx.closePath();
  }

  /**
   * Updates writing box with number of points and next set of balls.
   */
  @log
  writeStuff() {
    ctx.fillStyle = COLOR.WHITE;
    ctx.fillRect(this.width * y, 0, 200, canvas.height);
    ctx.fillStyle = "Black";
    ctx.font = "20px Arial";
    ctx.fillText("Points: ", this.width * y + 10, 50);
    ctx.fillText(String(this.points), this.width * y + 100, 50);

    ctx.fillText("Następne: ", this.width * y + 10, 100);

    for (let i = 0; i < this.colors.length; i++) {
      ctx.beginPath();
      ctx.arc(this.width * y + 10 + 25 + i * 50, 150, 15, 0, 2 * Math.PI);
      ctx.strokeStyle = COLOR.BLACK;
      ctx.lineWidth = 1;
      ctx.fillStyle = this.colors[i];
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }

  /**
   * Returns an array of three strings of randomly chosen colors.
   */
  getRandomColors(): string[] {
    let colorsArray: string[] = [];
    for (let i = 0; i < 3; i++) {
      const enumValues = Object.values(COLOR);
      const randomIndex = Math.floor(Math.random() * enumValues.length);
      const randomEnumValue = enumValues[randomIndex];
      // console.log(randomEnumValue);
      colorsArray.push(randomEnumValue);
    }
    return colorsArray;
  }

  /**
   * Spawns 3 new balls. If can't spawn, alerts that you lost.
   */
  spawnNewBalls() {
    let colors = this.colors;
    this.colors = this.getRandomColors();
    this.writeStuff();
    for (let i = 0; i < 3; ) {
      let randomX = Math.floor(Math.random() * x);
      let randomY = Math.floor(Math.random() * y);
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
        if (this.ballsPlaced >= x * y) {
          this.lost = true;
          alert("Przegrałeś! Punkty: " + this.points);
          return;
        }
      } else continue;
      i++;
    }
  }

  /**
   * Selects clicked ball or unselects if already selected.
   * * @param e  Called on click.
   */
  selectBall(e: MouseEvent) {
    if (!this.disabled && e.clientX <= this.width * y) {
      let y = Math.floor((e.clientX - 8) / this.width);
      let x = Math.floor((e.clientY - 8) / this.height);

      if (this.squareArray[x][y].ball == true) {
        if (this.squareArray[x][y].selected == false) {
          if (this.selected != null) this.selected.unselect();
          this.squareArray[x][y].select();
          this.selected = this.squareArray[x][y];
        } else {
          this.squareArray[x][y].unselect();
          this.selected = null;
        }
        return;
      }
      if (this.selected != null && this.path.length > 1) {
        this.moveBall(this.selected, x, y);
      }
    }
  }

  /**
   * Draws shortest path from selected ball to the square of your mouse location.
   * @param e  Called on mousemove.
   */
  drawPath(e: MouseEvent) {
    if (this.selected != null && e.clientX <= this.width * y) {
      let startY = this.selected.x;
      let startX = this.selected.y;

      let endY = Math.floor((e.clientX - 8) / this.width);
      let endX = Math.floor((e.clientY - 8) / this.height);

      let path = Spot.setUpArray(this.array, startX, startY, endX, endY);
      this.clearAllSquares();
      for (let coords of path) {
        this.squareArray[coords[1]][coords[0]].fillPath();
      }
      this.path = path;
    }
  }

  /**
   * Leaves gray trace of the path after moving the ball.
   */
  leaveTrace() {
    for (let coords of this.path) {
      this.squareArray[coords[1]][coords[0]].fillGray();
    }
    this.path = [];
    this.disabled = true;
  }

  /**
   * Moves selected ball to clicked position.
   */

  moveBall(square: Square, x: number, y: number) {
    square.selected = false;
    this.selected = null;
    square.ball = false;
    this.array[square.x][square.y] = false;

    this.squareArray[x][y].ball = true;
    this.squareArray[x][y].setColor(square.color);
    this.squareArray[x][y].drawBall(15, "#AAAAAA");
    this.array[x][y] = true;

    this.leaveTrace();

    window.setTimeout(() => {
      this.clearAllSquares();
      this.disabled = false;
      this.squareArray[x][y].drawBall(15, COLOR.WHITE);
      if (!this.lost) {
        this.checkVertically(x, y);
        this.checkHorizontally(x, y);
        this.checkDiagonally(x, y);
        let isSmashed = this.smash();

        this.writeStuff();
        this.vanishArray = [];
        if (!isSmashed) this.spawnNewBalls();
      }
    }, 1000);
  }

  /**
   * Changes background of all squares to default white.
   */
  clearAllSquares() {
    for (let squares of this.squareArray) {
      for (let square of squares) {
        square.fillWhite();
      }
    }
  }

  /**
   * Check if there is min. 5 balls in a row vertically, if yes adds them to an array to remove.
   */
  checkVertically(x: number, y: number) {
    let color = this.squareArray[x][y].color;
    let vertArr: Square[] = [];
    vertArr.push(this.squareArray[x][y]);

    let i = 1;
    while (x - i >= 0) {
      if (
        this.squareArray[x - i][y].color == color &&
        this.squareArray[x - i][y].ball
      ) {
        vertArr.push(this.squareArray[x - i][y]);
        i++;
      } else break;
    }

    i = 1;

    while (x + i <= 8) {
      if (
        this.squareArray[x + i][y].color == color &&
        this.squareArray[x + i][y].ball
      ) {
        vertArr.push(this.squareArray[x + i][y]);
        i++;
      } else break;
    }

    if (vertArr.length >= BALLS_IN_ROW_TO_SMASH)
      this.vanishArray.push(...vertArr);
  }

  /**
   * Check if there is min. 5 balls in a row horizontally, if yes adds them to an array to remove.
   */
  checkHorizontally(x: number, y: number) {
    let color = this.squareArray[x][y].color;
    let horiArr: Square[] = [];
    horiArr.push(this.squareArray[x][y]);

    let i = 1;
    while (y - i >= 0) {
      if (
        this.squareArray[x][y - i].color == color &&
        this.squareArray[x][y - i].ball
      ) {
        horiArr.push(this.squareArray[x][y - i]);
        i++;
      } else break;
    }

    i = 1;

    while (y + i <= 8) {
      if (
        this.squareArray[x][y + i].color == color &&
        this.squareArray[x][y + i].ball
      ) {
        horiArr.push(this.squareArray[x][y + i]);
        i++;
      } else break;
    }

    if (horiArr.length >= BALLS_IN_ROW_TO_SMASH)
      this.vanishArray.push(...horiArr);
  }

  /**
   * Check if there is min. 5 balls in a row diagonally, if yes adds them to an array to remove.
   */
  checkDiagonally(x: number, y: number) {
    let color = this.squareArray[x][y].color;
    let diagArr: Square[] = [];
    diagArr.push(this.squareArray[x][y]);

    let i = 1;
    while (y - i >= 0 && x - i >= 0) {
      if (
        this.squareArray[x - i][y - i].color == color &&
        this.squareArray[x - i][y - i].ball
      ) {
        diagArr.push(this.squareArray[x - i][y - i]);
        i++;
      } else break;
    }

    i = 1;

    while (y + i <= 8 && x + i <= 8) {
      if (
        this.squareArray[x + i][y + i].color == color &&
        this.squareArray[x + i][y + i].ball
      ) {
        diagArr.push(this.squareArray[x + i][y + i]);
        i++;
      } else break;
    }

    if (diagArr.length >= BALLS_IN_ROW_TO_SMASH)
      this.vanishArray.push(...diagArr);

    diagArr = [];
    diagArr.push(this.squareArray[x][y]);
    i = 1;
    while (y - i >= 0 && x + i <= 8) {
      if (
        this.squareArray[x + i][y - i].color == color &&
        this.squareArray[x + i][y - i].ball
      ) {
        diagArr.push(this.squareArray[x + i][y - i]);
        i++;
      } else break;
    }

    i = 1;

    while (y + i <= 8 && x - i >= 0) {
      if (
        this.squareArray[x - i][y + i].color == color &&
        this.squareArray[x - i][y + i].ball
      ) {
        diagArr.push(this.squareArray[x - i][y + i]);
        i++;
      } else break;
    }

    if (diagArr.length >= BALLS_IN_ROW_TO_SMASH)
      this.vanishArray.push(...diagArr);
  }

  /**
   * Smashes balls.
   */

  @log
  smash() {
    let smashArray = this.vanishArray.filter((x, i, a) => a.indexOf(x) == i);
    this.points += smashArray.length;
    for (let square of smashArray) {
      square.removeBall();
      this.array[square.x][square.y] = false;
    }

    this.ballsPlaced -= smashArray.length;
    return smashArray.length > 0;
  }

  /**
   * Starts new game.
   */

  startGame() {
    this.createCanvas();
    this.spawnNewBalls();
  }
}

//import { canvas, ctx, x, y, COLOR } from "./main";
