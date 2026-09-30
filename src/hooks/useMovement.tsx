import { useEffect, useRef, useState } from "react";
import type {
  HitboxMeasurements,
  MovementState,
  PersonSprites,
} from "../types";
import { MOVEMENT_SPEED } from "../consts";

const MIN_WALK_DISTANCE = 10;
const WALK_FRAME_DURATION = 120;
const GRAVITY = 2400;

const useMovement = (
  hitboxMeasurements: HitboxMeasurements | null,
  x: number,
  setX: React.Dispatch<React.SetStateAction<number>>,
  sprites: PersonSprites,
  frozen = false,
) => {
  const [state, setState] = useState<MovementState>("idle");
  const [sprite, setSprite] = useState(sprites.idle);

  const measurementsRef = useRef<HitboxMeasurements | null>(hitboxMeasurements);
  const targetDistanceRef = useRef(0);
  const traveledRef = useRef(0);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, right: 0, maxRight: 0, startY: 0 });
  const draggingRef = useRef(false);
  const fallAnimation = useRef<number | null>(null);
  const dragYRef = useRef(0);
  const velocityRef = useRef(0);
  const isPaused = isDragging || isFalling || frozen ;

  const updateY = (value: number) => {
    dragYRef.current = value;
    setDragY(value);
  };

  const stopFall = () => {
    if (fallAnimation.current !== null) {
      cancelAnimationFrame(fallAnimation.current);
      fallAnimation.current = null;
    }
    velocityRef.current = 0;
  };

  const startFall = () => {
    stopFall();
    setIsFalling(true);
    let last = performance.now();

    const fall = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      velocityRef.current += GRAVITY * dt;
      const nextY = Math.max(0, dragYRef.current - velocityRef.current * dt);
      updateY(nextY);

      if (nextY === 0) {
        fallAnimation.current = null;
        velocityRef.current = 0;
        setIsFalling(false);
        return;
      }

      fallAnimation.current = requestAnimationFrame(fall);
    };

    fallAnimation.current = requestAnimationFrame(fall);
  };

  useEffect(() => {
    measurementsRef.current = hitboxMeasurements;
  }, [hitboxMeasurements]);

  // Decide when and where to walk
  useEffect(() => {
    if (isPaused || !hitboxMeasurements || state !== "idle") return;

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
  }, [hitboxMeasurements, isPaused, state]);

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
    if (isPaused) {
      setState("idle");
      return;
    }

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
  }, [isPaused, state, setX]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    stopFall();

    const maxRight = measurementsRef.current
      ? Math.max(
          0,
          measurementsRef.current.parentRight -
            measurementsRef.current.parentLeft -
            measurementsRef.current.width,
        )
      : 0;

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      right: x,
      maxRight,
      startY: dragYRef.current,
    };
    draggingRef.current = true;
    setIsFalling(false);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      const deltaX = event.clientX - dragStart.current.x;
      const deltaY = dragStart.current.y - event.clientY;

      setX(
        Math.max(
          0,
          Math.min(
            dragStart.current.maxRight,
            dragStart.current.right - deltaX,
          ),
        ),
      );
      updateY(Math.max(0, dragStart.current.startY + deltaY));
    };

    const handleWindowPointerUp = () => {
      if (!draggingRef.current) return;

      draggingRef.current = false;
      setIsDragging(false);

      if (dragYRef.current > 0) startFall();
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [isDragging, setX]);

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  useEffect(() => stopFall, []);

  return {
    state,
    sprite,
    dragY,
    isDragging,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
};

export default useMovement;
