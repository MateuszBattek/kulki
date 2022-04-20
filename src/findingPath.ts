export class Spot {
  public x: number;
  public y: number;

  public f = 0;
  public g = 0;
  public h = 0;
  public neighbors: Spot[] = [];
  public wall = false;

  public previous: any;

  constructor(x: number, y: number, wall: boolean) {
    this.x = x;
    this.y = y;
    this.wall = wall;
  }

  addNeighbors(grid: Spot[][]) {
    var i = this.x;
    var j = this.y;
    let cols = 9;
    let rows = 9;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
  }

  static removeFromArray(arr: any[], elt: any) {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }

  static heuristic(a: Spot, b: Spot) {
    var d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    // var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
  }

  static setUpArray(
    starterArray: boolean[][],
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    var array: Spot[][] = [];
    var rows = 9;
    var cols = 9;

    for (let i = 0; i < cols; i++) {
      array.push([]);
      for (let j = 0; j < rows; j++) {
        array[i].push(new Spot(i, j, starterArray[j][i]));
      }
    }

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        array[i][j].addNeighbors(array);
      }
    }

    var start = array[startX][startY];
    var end = array[endY][endX];
    start.wall = true;
    //end.wall = false;

    //console.log(array);

    var finalPath = Spot.getPath(start, end);
    //console.log(finalPath.map((x: Spot) => [x.x, x.y]));
    return finalPath.map((x: Spot) => [x.x, x.y]);
  }

  static getPath(start: Spot, end: Spot): Spot[] {
    var path: Spot[] = [];
    var openSet: Spot[] = [];
    var closedSet: Spot[] = [];
    var finished = false;
    var current: Spot = start;

    openSet.push(start);

    while (!finished) {
      // Am I still searching?
      if (openSet.length > 0) {
        // Best next option
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
          if (openSet[i].f < openSet[winner].f) {
            winner = i;
          }
        }
        current = openSet[winner];

        // Did I finish?
        if (current === end) {
          finished = true;
          //console.log("DONE!");
        }

        // Best option moves from openSet to closedSet
        Spot.removeFromArray(openSet, current);
        closedSet.push(current);

        // Check all the neighbors
        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
          var neighbor = neighbors[i];

          // Valid next spot?
          if (!closedSet.includes(neighbor) && !neighbor.wall) {
            var tempG = current.g + Spot.heuristic(neighbor, current);

            // Is this a better path than before?
            var newPath = false;
            if (openSet.includes(neighbor)) {
              if (tempG < neighbor.g) {
                neighbor.g = tempG;
                newPath = true;
              }
            } else {
              neighbor.g = tempG;
              newPath = true;
              openSet.push(neighbor);
            }

            // Yes, it's a better path
            if (newPath) {
              neighbor.h = Spot.heuristic(neighbor, end);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.previous = current;
            }
          }
        }
        // Uh oh, no solution
      } else {
        //console.log("no solution");
        return [];
      }
    }

    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    if (path.length == 1) {
      path = [];
    }

    return path;
  }
}
