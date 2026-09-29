import { Box, Image } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { SPRITES } from "../consts";
import useHitbox from "../hooks/useHitbox";
import useMovement from "../hooks/useMovement";

const Alanna = () => {
  const hitbox = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  const { measurements } = useHitbox(hitbox, x);

  const {
    state,
    sprite,
    isDragging,
    dragY,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  } = useMovement(measurements, x, setX, SPRITES.arthur);

  const isWalkingRight = state === "movingRight";

  const floorPosition = `calc(1rem + ${dragY}px)`;

  return (
    <Box
      position="absolute"
      bottom={floorPosition}
      right={`${x}px`}
      ref={hitbox}
      cursor={isDragging ? "grabbing" : "grab"}
      touchAction="none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      zIndex={isDragging ? 2 : 1}
    >
      <Image
        h="80px"
        src={sprite}
        alt="Arthur"
        imageRendering="pixelated"
        transform={isWalkingRight ? "scaleX(-1)" : "none"}
      />
    </Box>
  );
};

export default Alanna;
