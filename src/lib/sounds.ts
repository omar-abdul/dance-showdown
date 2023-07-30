import { Howl } from "howler";

export const sound = {
  cheer: new Howl({ src: "sounds/large-crowd-applause.wav", volume: 0.7 }),
  gasp: new Howl({ src: "sounds/gasp.mp3" }),
  song1: new Howl({
    src: ["sounds/music1.mp3"],
    loop: true,
  }),
  song2: new Howl({
    src: ["sounds/music2.mp3"],
    loop: true,
  }),
};
