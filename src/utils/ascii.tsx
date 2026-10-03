import { ASCII_ART } from "../consts";

const STAR_CHARS = ["⠁", "⡀", "⡂", "⢁", "⠄", "⢀", "⠈", "⠐", "⠂"];

const generateAsciiArt = () => {
  const lines = ASCII_ART.trim().split("\n");

  return lines
    .map((line) =>
      [...line]
        .map((char) => {
          if (char === "⠀") return char;
          if (Math.random() < 0.5) return "⠀";
          return STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];
        })
        .join(""),
    )
    .join("\n");
};

export default generateAsciiArt;
