import { Box, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SPRITES, TOUCH_DISTANCE } from "../consts";
import useHitbox from "../hooks/useHitbox";
import useMovement from "../hooks/useMovement";
import { useLove } from "../context/LoveContext";
import { useLannagotchi } from "../context/LannagotchiContext";
import LoveParticles from "./LoveParticles";

const Alanna = () => {
  const hitbox = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  const showArthur = useLannagotchi().showArthur;
  const { inLove, tick, bump, startLove } = useLove();

  const { measurements } = useHitbox(hitbox, x, tick);

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
  } = useMovement(measurements, x, setX, SPRITES.alanna, frozen);

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
    >
      <Image
        h="72px"
        src={sprite}
        alt="Alanna"
        imageRendering="pixelated"
        transform={isWalkingRight ? "scaleX(-1)" : "none"}
      />
      <LoveParticles
        active={frozen}
        side={measurements?.siblingSide ?? "left"}
      />
    </Box>
  );
};

export default Alanna;
