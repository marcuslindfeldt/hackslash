import { Vec2 } from "../utils/Vec2";

export class MoveTarget {
  static typeName = "MoveTarget";
  position: Vec2;

  constructor(position: Vec2) {
    this.position = position;
  }
}
