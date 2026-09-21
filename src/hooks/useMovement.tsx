import { useEffect, useRef, useState } from "react";
import type { HitboxMeasurements, MovementState } from "../types";
import { MOVEMENT_SPEED } from "../consts";

const MIN_WALK_DISTANCE = 10;

const useMovement = (
  hitboxMeasurements: HitboxMeasurements | null,
  setX: React.Dispatch<React.SetStateAction<number>>,
) => {
  const [state, setState] = useState<MovementState>("idle");

  const measurementsRef = useRef<HitboxMeasurements | null>(hitboxMeasurements);
  const targetDistanceRef = useRef(0);
  const traveledRef = useRef(0);

  // mantém o ref sempre sincronizado, sem disparar o loop de novo
  useEffect(() => {
    measurementsRef.current = hitboxMeasurements;
  }, [hitboxMeasurements]);

  // decide o que fazer quando está idle
  useEffect(() => {
    if (!hitboxMeasurements || state !== "idle") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const decide = () => {
      timeoutId = setTimeout(() => {
        if (Math.random() >= 0.4) {
          console.log("decide: não fazer nada");
          decide();
          return;
        }
        console.log("decide: andar");
        const { left, right } = hitboxMeasurements;
        const canGoRight = right > 2;
        const canGoLeft = left > 2;

        if (!canGoRight && !canGoLeft) {
          decide(); // não há espaço pra andar, tenta de novo mais tarde
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

  // loop de movimento — inicia UMA vez por transição de estado
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
  }, [state, setX]); // <-- sem hitboxMeasurements aqui, de propósito

  return state;
};

export default useMovement;
