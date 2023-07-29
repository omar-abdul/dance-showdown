import { Sprite } from "@pixi/react";
// import clock from "../assets/images/clock.png";

function AlarmClock({
  innerWidth,
  uiElements,
}: {
  innerWidth: number;
  uiElements: any;
}) {
  return <Sprite x={innerWidth - 60} y={5} texture={uiElements.clock} />;
}

export default AlarmClock;
