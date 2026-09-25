import { useEffect, useRef, useState } from "react";
import type {
  HitboxMeasurements,
  MovementState,
  PersonSprites,
} from "../types";
import { MOVEMENT_SPEED } from "../consts";

const MIN_WALK_DISTANCE = 10;
const WALK_FRAME_DURATION = 120;

const useMovement = (
  hitboxMeasurements: HitboxMeasurements | null,
  setX: React.Dispatch<React.SetStateAction<number>>,
  sprites: PersonSprites,
) => {
  const [state, setState] = useState<MovementState>("idle");
  const [sprite, setSprite] = useState(sprites.idle);

  const measurementsRef = useRef<HitboxMeasurements | null>(hitboxMeasurements);
  const targetDistanceRef = useRef(0);
  const traveledRef = useRef(0);

  useEffect(() => {
    measurementsRef.current = hitboxMeasurements;
  }, [hitboxMeasurements]);

  // Decide when and where to walk
  useEffect(() => {
    if (!hitboxMeasurements || state !== "idle") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const decide = () => {
      timeoutId = setTimeout(() => {
        if (Math.random() >= 0.3) {
          decide();
          return;
        }

        const { left, right } = hitboxMeasurements;

        const canGoRight = right > 2;
        const canGoLeft = left > 2;

        if (!canGoRight && !canGoLeft) {
          decide();
          return;
        }

        const goRight = canGoRight && (!canGoLeft || Math.random() < 0.5);

        const availableRoom = (goRight ? right : left) - 2;

        if (availableRoom <= 0) {
          decide();
          return;
        }

        const distance =
          Math.min(availableRoom, MIN_WALK_DISTANCE) +
          Math.random() * Math.max(availableRoom - MIN_WALK_DISTANCE, 0);

        targetDistanceRef.current = distance;
        traveledRef.current = 0;

        setState(goRight ? "movingRight" : "movingLeft");
      }, 500);
    };

    decide();

    return () => clearTimeout(timeoutId);
  }, [hitboxMeasurements, state]);

  // Walking animation
  useEffect(() => {
    if (state === "idle") {
      setSprite(sprites.idle);
      return;
    }

    let frameIndex = 0;

    setSprite(sprites.walk[frameIndex]);

    const intervalId = setInterval(() => {
      frameIndex = (frameIndex + 1) % sprites.walk.length;
      setSprite(sprites.walk[frameIndex]);
    }, WALK_FRAME_DURATION);

    return () => clearInterval(intervalId);
  }, [state, sprites]);

  // Movement
  useEffect(() => {
    if (state === "idle") return;

    let animationId: number;

    const move = () => {
      const measurements = measurementsRef.current;

      if (!measurements) {
        animationId = requestAnimationFrame(move);
        return;
      }

      const hitBorder =
        (state === "movingLeft" && measurements.left <= 2) ||
        (state === "movingRight" && measurements.right <= 2);

      const reachedTarget = traveledRef.current >= targetDistanceRef.current;

      if (hitBorder || reachedTarget) {
        setState("idle");
        return;
      }

      traveledRef.current += MOVEMENT_SPEED;

      setX((prev) =>
        state === "movingRight" ? prev - MOVEMENT_SPEED : prev + MOVEMENT_SPEED,
      );

      animationId = requestAnimationFrame(move);
    };

    animationId = requestAnimationFrame(move);

    return () => cancelAnimationFrame(animationId);
  }, [state, setX]);

  return {
    state,
    sprite,
  };
};

export default useMovement;
