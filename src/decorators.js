"use strict";
exports.__esModule = true;
exports.log = void 0;
var data_1 = require("./data");
function log(target, name, descriptor) {
    var smashTexts = ["Nice!", "Wow!", "You're good"];
    var comboTexts = [
        "Combo!",
        "That's many balls smashed!",
        "Amazing work",
    ];
    var superComboTexts = [
        "HOW ARE U DOING THIS?!",
        "YOU ARE INSANE",
        "INCREDIBLE",
    ];
    var badTexts = [
        "Bad",
        "Noob",
        "Get some points",
        "You know how to play?",
        "",
        "",
    ];
    var veryBadTexts = [
        "It's getting dense",
        "You're about to lose",
        "Do something",
    ];
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = originalMethod.apply(this, args);
        //ctx.rotate((45 * Math.PI) / 180);
        data_1.ctx.fillStyle = "White";
        data_1.ctx.fillRect(this.width * data_1.y + 10, 200, 200, 180);
        data_1.ctx.strokeRect(this.width * data_1.y + 10, 200, 180, 180);
        data_1.ctx.fillStyle = "Black";
        data_1.ctx.font = "16px Arial";
        if (this.ballsPlaced <= 3) {
            data_1.ctx.fillText("", this.width * data_1.y + 15, 290);
            return result;
        }
        if (this.vanishArray.length >= data_1.BALLS_IN_ROW_TO_SMASH + 5) {
            var random = Math.floor(Math.random() * superComboTexts.length);
            data_1.ctx.fillText(superComboTexts[random], this.width * data_1.y + 15, 290);
            return result;
        }
        if (this.vanishArray.length >= data_1.BALLS_IN_ROW_TO_SMASH + 2) {
            var random = Math.floor(Math.random() * comboTexts.length);
            data_1.ctx.fillText(comboTexts[random], this.width * data_1.y + 15, 290);
            return result;
        }
        if (this.vanishArray.length >= data_1.BALLS_IN_ROW_TO_SMASH) {
            var random = Math.floor(Math.random() * smashTexts.length);
            data_1.ctx.fillText(smashTexts[random], this.width * data_1.y + 15, 290);
            return result;
        }
        if (this.ballsPlaced >= 50) {
            var random = Math.floor(Math.random() * veryBadTexts.length);
            data_1.ctx.fillText(veryBadTexts[random], this.width * data_1.y + 15, 290);
            return result;
        }
        if (this.vanishArray.length == 0) {
            var random = Math.floor(Math.random() * badTexts.length);
            data_1.ctx.fillText(badTexts[random], this.width * data_1.y + 15, 290);
            return result;
        }
        return result;
    };
}
exports.log = log;
