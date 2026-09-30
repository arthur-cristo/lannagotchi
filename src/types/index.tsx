export type HitboxMeasurements = {
  left: number;
  right: number;
  width: number;
  parentLeft: number;
  parentRight: number;
  siblingDistance: number | null;
  siblingSide: "left" | "right" | null;
};

export type MovementState = "movingLeft" | "movingRight" | "idle";

export type PersonSprites = {
  idle: string;
  walk: string[];
};
