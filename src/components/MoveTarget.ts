import { Vec2 } from "planck-js";

export class MoveTarget {
  static typeName = <const> "moveTarget";
  position: Vec2;

  constructor(position: Vec2) {
    this.position = position;
  }
}
