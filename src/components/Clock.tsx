import { Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";

function AlarmClock({
  x,
  y,
  uiElements,
}: {
  x: number;
  y: number;
  uiElements: Record<string, PIXI.Texture<PIXI.Resource>>;
}) {
  return (
    <>
      {uiElements?.clock && (
        <Sprite x={x - 20} y={y - 5} texture={uiElements?.clock} scale={0.7} />
      )}
    </>
  );
}

export default AlarmClock;
