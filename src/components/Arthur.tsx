import { Box, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SPRITES, TOUCH_DISTANCE } from "../consts";
import useHitbox from "../hooks/useHitbox";
import useMovement from "../hooks/useMovement";
import { useLannagotchi } from "../context/LannagotchiContext";
import { useLove } from "../context/LoveContext";

const Arthur = () => {
  const hitbox = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  const { inLove, tick, bump, startLove } = useLove();
  const { measurements } = useHitbox(hitbox, x, tick);

  const { showArthur, creepyMode } = useLannagotchi();

  const sprites = creepyMode ? SPRITES.creepy.arthur : SPRITES.arthur;

  const touching =
    showArthur &&
    measurements?.siblingDistance != null &&
    measurements.siblingDistance <= TOUCH_DISTANCE;

  const frozen = inLove && showArthur;

  useEffect(() => bump(), [x, bump]);
  useEffect(() => {
    if (touching) startLove();
  }, [touching, startLove]);

  const {
    state,
    sprite,
    isDragging,
    dragY,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  } = useMovement(measurements, x, setX, sprites, frozen);

  const isWalkingRight = state === "movingRight";

  const floorPosition = `calc(1rem + ${dragY}px)`;

  return (
    <Box
      data-character
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
      opacity={showArthur ? 1 : 0}
      transition="opacity 0.3s ease-in-out"
    >
      <Image
        h="80px"
        mx={-3}
        src={sprite}
        alt="Arthur"
        imageRendering="pixelated"
        transform={isWalkingRight ? "scaleX(-1)" : "none"}
      />
    </Box>
  );
};

export default Arthur;
