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
  icons: {
    arthur: "/sprites/icons/arthur.png",
    notes: "/sprites/icons/notes.png",
    spotify: "/sprites/icons/spotify.png",
  },
};

export const APPS = [
  {
    name: "Arthur",
    icon: SPRITES.icons.arthur,
  },
  {
    name: "Notas",
    icon: SPRITES.icons.notes,
  },
  {
    name: "Músicas",
    icon: SPRITES.icons.spotify,
  },
  {
    name: "Cachorros",
    icon: "/sprites/icons/dog.png",
  },
];

export const DEBUG = false;

export const MOVEMENT_SPEED = 1;
