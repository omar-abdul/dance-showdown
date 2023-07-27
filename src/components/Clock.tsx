import { Sprite } from "@pixi/react";
import clock from "../assets/clock.png";

function AlarmClock() {
  return <Sprite x={innerWidth - 60} y={2} image={clock} scale={0.2} />;
}

export default AlarmClock;
