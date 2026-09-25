import { useState, useEffect, useCallback } from "react";
import type { HitboxMeasurements } from "../types";

const useHitbox = (ref: React.RefObject<HTMLElement | null>, x: number) => {
  const [measurements, setMeasurements] = useState<HitboxMeasurements | null>(
    null,
  );

  const calculate = useCallback(() => {
    const hitboxElement = ref.current;

    if (!hitboxElement) return;

    const parent = hitboxElement.parentElement;

    if (!parent) return;

    const hitboxRect = hitboxElement.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const left = hitboxRect.left - parentRect.left;
    const right = parentRect.right - hitboxRect.right;

    const sibling = Array.from(parent.children).find(
      (child) => child !== hitboxElement,
    ) as HTMLElement | undefined;

    let siblingDistance: number | null = null;

    if (sibling) {
      const siblingRect = sibling.getBoundingClientRect();

      if (siblingRect.right <= hitboxRect.left) {
        siblingDistance = hitboxRect.left - siblingRect.right;
      } else if (siblingRect.left >= hitboxRect.right) {
        siblingDistance = siblingRect.left - hitboxRect.right;
      } else {
        siblingDistance = 0;
      }
    }

    setMeasurements({
      left,
      right,
      width: hitboxRect.width,
      parentLeft: parentRect.left,
      parentRight: parentRect.right,
      siblingDistance,
    });
  }, [ref]);

  useEffect(() => {
    calculate();

    const resizeObserver = new ResizeObserver(calculate);

    if (ref.current?.parentElement) {
      resizeObserver.observe(ref.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, [calculate, ref]);

  useEffect(() => {
    calculate();
  }, [x, calculate]);

  return { measurements };
};

export default useHitbox;
