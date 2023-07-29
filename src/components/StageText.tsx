import { useEffect, useState } from "react";
import { Text } from "@pixi/react";
import * as PIXI from "pixi.js";

const rewardTextStyle = new PIXI.TextStyle({
  dropShadowColor: "#77767b",
  fill: "#673AB7",
  fontFamily: "Comic Sans MS",
  fontSize: 12,
  fontVariant: "small-caps",
  fontWeight: "900",

  stroke: "#f6f5f4",
  wordWrap: true,
  wordWrapWidth: 200, // Adjust the wordWrapWidth as needed
  align: "center",
});

function FadingText({
  text,
  x,
  y,
  isShowing,
  playerId,
}: {
  text: string;
  x: number;
  y: number;
  isShowing: { playerId: string; isShowing: boolean };
  playerId: string;
}) {
  const [alpha, setAlpha] = useState<number>(1);

  // Calculate the total interval based on the fadeInDuration

  useEffect(() => {
    if (!isShowing.isShowing) return;
    const fadeValues = [1, 0.75, 0.5, 0.25, 0];
    const value = [...fadeValues];
    const interval = setInterval(() => {
      // Rotate the fadeValues array to create a fading effect
      setAlpha(() => (value.shift && value.shift()) || 0);
    }, 300);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [isShowing.isShowing]);

  return (
    <>
      {isShowing.isShowing && playerId === isShowing.playerId && (
        <Text text={text} style={rewardTextStyle} alpha={alpha} x={x} y={y} />
      )}
    </>
  );
}

export default FadingText;
