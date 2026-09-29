import type { PersonSprites } from "../types";
import scene from "../assets/sprites/scene/scene.png";
import alannaIdle from "../assets/sprites/alanna/idle.png";
import alannaWalk1 from "../assets/sprites/alanna/walking_1.png";
import alannaWalk2 from "../assets/sprites/alanna/walking_2.png";
import alannaWalk3 from "../assets/sprites/alanna/walking_3.png";
import arthurIdle from "../assets/sprites/arthur/idle.png";
import arthurWalk1 from "../assets/sprites/arthur/walking_1.png";
import arthurWalk2 from "../assets/sprites/arthur/walking_2.png";
import arthurWalk3 from "../assets/sprites/arthur/walking_3.png";
import arthurIcon from "../assets/sprites/icons/arthur.png";
import notesIcon from "../assets/sprites/icons/notes.png";
import spotifyIcon from "../assets/sprites/icons/spotify2.png";

export const SPRITES = {
  scene: scene,
  alanna: {
    idle: alannaIdle,
    walk: [alannaWalk1, alannaWalk2, alannaWalk3],
  } as PersonSprites,
  arthur: {
    idle: arthurIdle,
    walk: [arthurWalk1, arthurWalk2, arthurWalk3],
  } as PersonSprites,
  icons: {
    arthur: arthurIcon,
    notes: notesIcon,
    spotify: spotifyIcon,
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
