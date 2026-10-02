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
import heartIcon from "../assets/sprites/heart.png";
import love from "../assets/sprites/icons/love.png";
import galleryIcon from "../assets/sprites/icons/gallery.png";
import viteIcon from "../assets/sprites/icons/vite.svg";
import whatsappIcon from "../assets/sprites/icons/whatsapp.svg";

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
    love: love,
    gallery: galleryIcon,
    vite: viteIcon,
    whatsapp: whatsappIcon,
  },
  heart: heartIcon,
};

export const GALLERY = Object.entries(
  import.meta.glob<string>("../assets/gallery/*", {
    eager: true,
    import: "default",
    query: "?url",
  }),
)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([, imageUrl]) => imageUrl);

export const APPS = [
  {
    name: "Arthur",
    icon: SPRITES.icons.arthur,
  },
  {
    name: "Cachorros",
    icon: SPRITES.icons.love,
  },
  {
    name: "Galeria",
    icon: SPRITES.icons.gallery,
  },
  {
    name: "Músicas",
    icon: SPRITES.icons.spotify,
  },
  {
    name: "Notas",
    icon: SPRITES.icons.notes,
  },
  {
    name: "Pixel Art Tool",
    icon: SPRITES.icons.vite,
  },
  {
    name: "WhatsApp",
    icon: SPRITES.icons.whatsapp,
  },
];

export const NOTE_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

export type Song = {
  name: string;
  mp3Path: string;
  coverPath: string;
};

const audioFiles = import.meta.glob<string>("../assets/songs/*/*.mp3", {
  eager: true,
  import: "default",
  query: "?url",
});

const coverFiles = import.meta.glob<string>(
  "../assets/songs/*/*.{avif,jfif,jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" },
);

const getFolderName = (path: string) => path.split("/").slice(-2, -1)[0];

const covers = Object.fromEntries(
  Object.entries(coverFiles).map(([path, url]) => [getFolderName(path), url]),
);

export const SONGS: Song[] = Object.entries(audioFiles)
  .map(([path, mp3Path]) => {
    const name = getFolderName(path);
    return { name, mp3Path, coverPath: covers[name] };
  })
  .filter((song) => !!song.coverPath)
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEBUG = false;
export const TOUCH_DISTANCE = 0;
export const MOVEMENT_SPEED = 1;
