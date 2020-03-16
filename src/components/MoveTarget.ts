import { Vec2 } from "planck-js";

export class MoveTarget {
  static typeName = <const> "MoveTarget";
  position: Vec2;

  constructor(position: Vec2) {
    this.position = position;
  }
}
