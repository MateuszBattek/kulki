"use strict";
exports.__esModule = true;
exports.BALLS_IN_ROW_TO_SMASH = exports.y = exports.x = exports.ctx = exports.canvas = exports.COLOR = void 0;
var COLOR;
(function (COLOR) {
    COLOR["BLACK"] = "#000000";
    COLOR["WHITE"] = "#FFFFFF";
    COLOR["BLUE"] = "#0000FF";
    COLOR["RED"] = "#FF0000";
    COLOR["GREEN"] = "#00FF00";
    COLOR["YELLOW"] = "#FFFF00";
    COLOR["ORANGE"] = "#FFA500";
})(COLOR = exports.COLOR || (exports.COLOR = {}));
exports.canvas = document.getElementsByTagName("canvas")[0];
exports.ctx = exports.canvas.getContext("2d");
exports.x = 9;
exports.y = 9;
exports.BALLS_IN_ROW_TO_SMASH = 5;
