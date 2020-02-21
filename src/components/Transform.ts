import { Vec2 } from "../utils/Vec2";

export class Transform {
  static typeName = "Transform";
  x: number;
  y: number;

  constructor(initialPosition: Vec2) {
    this.x = initialPosition.x;
    this.y = initialPosition.y;
  }
}
