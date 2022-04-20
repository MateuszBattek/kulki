import { canvas, ctx, x, y, COLOR, BALLS_IN_ROW_TO_SMASH } from "./data";

export function log(target: any, name: string, descriptor: any) {
  let smashTexts: string[] = ["Nice!", "Wow!", "You're good"];
  let comboTexts: string[] = [
    "Combo!",
    "That's many balls smashed!",
    "Amazing work",
  ];
  let superComboTexts: string[] = [
    "HOW ARE U DOING THIS?!",
    "YOU ARE INSANE",
    "INCREDIBLE",
  ];
  let badTexts: string[] = [
    "Bad",
    "Noob",
    "Get some points",
    "You know how to play?",
    "",
    "",
  ];
  let veryBadTexts: string[] = [
    "It's getting dense",
    "You're about to lose",
    "Do something",
  ];
  var originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    var result = originalMethod.apply(this, args);
    //ctx.rotate((45 * Math.PI) / 180);
    ctx.fillStyle = "White";
    ctx.fillRect(this.width * y + 10, 200, 200, 180);
    ctx.strokeRect(this.width * y + 10, 200, 180, 180);
    ctx.fillStyle = "Black";
    ctx.font = "16px Arial";

    if (this.ballsPlaced <= 3) {
      ctx.fillText("", this.width * y + 15, 290);
      return result;
    }

    if (this.vanishArray.length >= BALLS_IN_ROW_TO_SMASH + 5) {
      let random = Math.floor(Math.random() * superComboTexts.length);
      ctx.fillText(superComboTexts[random], this.width * y + 15, 290);
      return result;
    }

    if (this.vanishArray.length >= BALLS_IN_ROW_TO_SMASH + 2) {
      let random = Math.floor(Math.random() * comboTexts.length);
      ctx.fillText(comboTexts[random], this.width * y + 15, 290);
      return result;
    }

    if (this.vanishArray.length >= BALLS_IN_ROW_TO_SMASH) {
      let random = Math.floor(Math.random() * smashTexts.length);
      ctx.fillText(smashTexts[random], this.width * y + 15, 290);
      return result;
    }

    if (this.ballsPlaced >= 50) {
      let random = Math.floor(Math.random() * veryBadTexts.length);
      ctx.fillText(veryBadTexts[random], this.width * y + 15, 290);
      return result;
    }

    if (this.vanishArray.length == 0) {
      let random = Math.floor(Math.random() * badTexts.length);
      ctx.fillText(badTexts[random], this.width * y + 15, 290);
      return result;
    }

    return result;
  };
}
