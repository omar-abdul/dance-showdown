import { Sprite } from "@pixi/react";
// import clock from "../assets/images/clock.png";

function AlarmClock({
  x,
  y,
  uiElements,
}: {
  x: number;
  y: number;
  uiElements: any;
}) {
  return (
    <>
      {uiElements?.clock && (
        <Sprite x={x - 30} y={y - 5} texture={uiElements?.clock} />
      )}
    </>
  );
}

export default AlarmClock;
