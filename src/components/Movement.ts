import { Vec2 } from "../utils/Vec2";

export class Movement {
  static typeName = "Movement";
  velocity: Vec2;
  acceleration: number;
  maxSpeed: number;

  constructor(maxSpeed: number, acceleration :number) {
    this.velocity = { x: 0, y: 0 }
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration
  }
}
