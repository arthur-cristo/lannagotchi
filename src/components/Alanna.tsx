import { Box, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { DEBUG, SPRITES } from "../consts";
import useHitbox from "../hooks/useHitbox";
import useMovement from "../hooks/useMovement";

const Alanna = () => {
  const hitbox = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  const { measurements } = useHitbox(hitbox, x);

  const { state, sprite } = useMovement(measurements, setX, SPRITES.alanna);

  const isWalkingRight = state === "movingRight";

  return (
    <Box position="absolute" bottom={4} right={`${x}px`} ref={hitbox}>
      <Image
        h="72px"
        src={sprite}
        alt="Alanna"
        imageRendering="pixelated"
        transform={isWalkingRight ? "scaleX(-1)" : "none"}
      />

      {measurements && DEBUG && (
        <Box
          position="absolute"
          top="-100px"
          left="0"
          bg="black"
          color="white"
          p="2"
          fontSize="xs"
        >
          left: {measurements.left.toFixed(0)}
          <br />
          right: {measurements.right.toFixed(0)}
          <br />
          width: {measurements.width.toFixed(0)}
          <br />
          sibling: {measurements.siblingDistance?.toFixed(0) ?? "null"}
        </Box>
      )}
    </Box>
  );
};

export default Alanna;
