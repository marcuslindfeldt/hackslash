import { Vec2 } from "planck-js";

export class Position {
  static typeName = "position" as const;
  position: Vec2;

  constructor(position: Vec2 = new Vec2()) {
    this.position = position;
  }
}
