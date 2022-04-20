"use strict";
exports.__esModule = true;
exports.Spot = void 0;
var Spot = /** @class */ (function () {
    function Spot(x, y, wall) {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.wall = false;
        this.x = x;
        this.y = y;
        this.wall = wall;
    }
    Spot.prototype.addNeighbors = function (grid) {
        var i = this.x;
        var j = this.y;
        var cols = 9;
        var rows = 9;
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
    };
    Spot.removeFromArray = function (arr, elt) {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    };
    Spot.heuristic = function (a, b) {
        var d = Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
        // var d = abs(a.i - b.i) + abs(a.j - b.j);
        return d;
    };
    Spot.setUpArray = function (starterArray, startX, startY, endX, endY) {
        var array = [];
        var rows = 9;
        var cols = 9;
        for (var i_1 = 0; i_1 < cols; i_1++) {
            array.push([]);
            for (var j_1 = 0; j_1 < rows; j_1++) {
                array[i_1].push(new Spot(i_1, j_1, starterArray[j_1][i_1]));
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
        return finalPath.map(function (x) { return [x.x, x.y]; });
    };
    Spot.getPath = function (start, end) {
        var path = [];
        var openSet = [];
        var closedSet = [];
        var finished = false;
        var current = start;
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
                        }
                        else {
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
            }
            else {
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
    };
    return Spot;
}());
exports.Spot = Spot;
