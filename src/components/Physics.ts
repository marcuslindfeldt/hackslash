import { Body } from "planck-js";

export class Physics {
  static typeName = "Physics" as const;
  body: Body;

  constructor(body: Body) {
    this.body = body;
  }
}
