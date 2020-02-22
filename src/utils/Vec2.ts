import { Vec2 } from "planck-js";

export const normalize = (v: Vec2): Vec2 => {
  const m = v.length();

  return new Vec2(v.x / m, v.y / m);
};

export const div = (v: Vec2, n: number) => new Vec2(v.x / n, v.y / n);
