import { Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import AlarmClock from "./Clock";

const timeLeftTextStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 16,
  fill: "#ffffff", //
  stroke: "#000000",
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowDistance: 2,
});

function TimeBox({ timeLeft }: { timeLeft: number }) {
  return (
    <>
      <AlarmClock />

      <Text
        text={`${timeLeft}s`}
        style={
          timeLeft <= 3
            ? ({
                ...timeLeftTextStyle,
                fill: ["#ff0000", "#ff0000"],
              } as PIXI.TextStyle)
            : timeLeftTextStyle
        }
        x={innerWidth - 25}
        y={10}
      />
    </>
  );
}

export default TimeBox;
