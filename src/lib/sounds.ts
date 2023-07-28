import { Howl } from "howler";

export const sound = {
  cheer: new Howl({ src: "sounds/large-crowd-applause.wav", volume: 0.7 }),
  gasp: new Howl({ src: "sounds/gasp.mp3" }),
  song1: new Howl({
    src: ["music1.mp3"],
    loop: true,
  }),
  song2: new Howl({
    src: ["music2.mp3"],
    loop: true,
  }),
  song3: new Howl({
    src: ["music3.mp3"],
    loop: true,
  }),
  song4: new Howl({
    src: ["music4.mp3"],
    loop: true,
  }),
};
