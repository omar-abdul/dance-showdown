import { Container, Sprite, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import placeholder from "../assets/avatar.svg";

// Define a custom text style for the score and time left
const scoreTextStyle = new PIXI.TextStyle({
  dropShadowColor: "#77767b",
  fill: "#ff7800",
  fontFamily: "Comic Sans MS",
  fontSize: 18,
  fontVariant: "small-caps",
  fontWeight: "900",
  padding: 13,
  stroke: "#f6f5f4",
  wordWrap: true,
  wordWrapWidth: 200, // Adjust the wordWrapWidth as needed
});

function Score({
  scores,
  playerId,
  avatar,
}: {
  scores: object;
  playerId: string;
  avatar: string;
}) {
  return (
    <Container>
      {/* Score */}

      <Sprite image={avatar ? avatar : placeholder} scale={0.1} y={30} />

      <Text
        text={`  ${scores[playerId as keyof typeof scores]}`}
        style={scoreTextStyle}
        x={35}
        y={40}
      />
    </Container>
  );
}

export default Score;
