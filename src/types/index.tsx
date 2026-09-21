export type HitboxMeasurements = {
  left: number;
  right: number;
  width: number;
  parentLeft: number;
  parentRight: number;
  siblingDistance: number | null;
};

export type MovementState = "movingLeft" | "movingRight" | "idle";
