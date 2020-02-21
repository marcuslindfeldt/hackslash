import { Vec2 } from "../utils/Vec2";

export class Motion {
  static typeName = "Motion";
  velocity: Vec2;

  constructor(velocity: Vec2) {
    this.velocity = velocity;
  }
}
