import { Vec2 } from "planck-js";

export class Position {
  static typeName = "Position" as const;
  position: Vec2;

  constructor(position: Vec2) {
    this.position = position;
  }
}
