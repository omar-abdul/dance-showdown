import { Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import AlarmClock from "./Clock";

const timeLeftTextStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 12,
  fill: "#673AB7", //
  stroke: "#ffffff",
  strokeThickness: 3,
});

function TimeBox({
  timeLeft,
  innerWidth,
  uiElements,
}: {
  timeLeft: number;
  innerWidth: number;
  uiElements: Record<string, PIXI.Texture<PIXI.Resource>>;
}) {
  const x = innerWidth - 15;
  const y = 10;
  return (
    <>
      <AlarmClock x={x} y={y} uiElements={uiElements} />

      <Text
        text={`${timeLeft.toFixed(2)}s`}
        style={
          timeLeft <= 3
            ? ({
                ...timeLeftTextStyle,
                fill: ["#ff0000", "#ff0000"],
              } as PIXI.TextStyle)
            : timeLeftTextStyle
        }
        x={x - 30}
        y={y + 10}
      />
    </>
  );
}

export default TimeBox;
