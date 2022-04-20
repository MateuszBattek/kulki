export var COLOR;
(function (COLOR) {
    COLOR["BLACK"] = "#000000";
    COLOR["WHITE"] = "#FFFFFF";
    COLOR["BLUE"] = "#0000FF";
    COLOR["RED"] = "#FF0000";
    COLOR["GREEN"] = "#00FF00";
    COLOR["YELLOW"] = "#FFFF00";
    COLOR["ORANGE"] = "#FFA500";
})(COLOR || (COLOR = {}));
export var canvas = document.getElementsByTagName("canvas")[0];
export var ctx = canvas.getContext("2d");
export var x = 9;
export var y = 9;
export var BALLS_IN_ROW_TO_SMASH = 5;
