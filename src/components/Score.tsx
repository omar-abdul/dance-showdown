import { Container, Sprite, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import placeholder from "../assets/images/avatar.svg";
import circleBorder from "../assets/images/circle.png";

// Define a custom text style for the score and time left
const scoreTextStyle = new PIXI.TextStyle({
  dropShadowColor: "#77767b",
  fill: "#673AB7",
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
      <Sprite image={circleBorder} y={30} anchor={0.5} x={25} scale={0.87} />
      <Sprite
        image={avatar ? avatar : placeholder}
        y={30}
        x={25}
        width={40}
        height={40}
        anchor={0.5}
      />

      {playerId && (
        <Text
          text={`  ${scores[playerId as keyof typeof scores]}`}
          style={scoreTextStyle}
          x={35}
          y={20}
        />
      )}
    </Container>
  );
}

export default Score;
