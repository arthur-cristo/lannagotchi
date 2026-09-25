import type { PersonSprites } from "../types";

export const SPRITES = {
  scene: "/sprites/scene/scene.png",
  alanna: {
    idle: "/sprites/alanna/idle.png",
    walk: [
      "/sprites/alanna/walking_1.png",
      "/sprites/alanna/walking_2.png",
      "/sprites/alanna/walking_3.png",
    ],
  } as PersonSprites,
  arthur: {
    idle: "/sprites/arthur/idle.png",
    walk: [
      "/sprites/arthur/walking_1.png",
      "/sprites/arthur/walking_2.png",
      "/sprites/arthur/walking_3.png",
    ],
  } as PersonSprites,
};

export const DEBUG = false;

export const MOVEMENT_SPEED = 1;
