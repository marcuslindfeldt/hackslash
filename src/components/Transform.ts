import { Vec2 } from "planck-js";

export class Transform {
  static typeName = "Transform" as const;
  transform: Vec2;

  constructor(transform: Vec2) {
    this.transform = transform;
  }
}
