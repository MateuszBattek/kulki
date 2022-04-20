export enum COLOR {
  BLACK = "#000000",
  WHITE = "#FFFFFF",
  BLUE = "#0000FF",
  RED = "#FF0000",
  GREEN = "#00FF00",
  YELLOW = "#FFFF00",
  ORANGE = "#FFA500",
}

export const canvas = document.getElementsByTagName("canvas")[0];
export const ctx = canvas.getContext("2d")!;
export const x = 9;
export const y = 9;
export const BALLS_IN_ROW_TO_SMASH = 5;
