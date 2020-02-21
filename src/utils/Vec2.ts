export interface Vec2 {
  x: number;
  y: number;
}

export const magnitude = ({ x, y }: Vec2): number => {
  return Math.sqrt(x * x + y * y);
};

export const normalize = ({ x, y }: Vec2): Vec2 => {
  const m = magnitude({ x, y });

  return { x: x / m, y: y / m };
};

export const clone = (v1: Vec2): Vec2 => ({
  x: v1.x,
  y: v1.y
});

export const mult = (v1: Vec2, scalar: number): Vec2 => ({
  x: v1.x * scalar,
  y: v1.y * scalar
});

export const div = (v1: Vec2, scalar: number): Vec2 => ({
  x: v1.x / scalar,
  y: v1.y / scalar
});

export const add = (v1: Vec2, v2: Vec2): Vec2 => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y
});

export const sub = (v1: Vec2, v2: Vec2): Vec2 => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y
});

export const equals = (v1: Vec2, v2: Vec2): boolean =>
  v1.x === v2.x && v1.y === v2.y;
