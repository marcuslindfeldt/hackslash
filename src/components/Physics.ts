import { Body } from "planck-js";

export class Physics {
  static typeName = "Physics";
  body: Body;

  constructor(body: Body) {
    this.body = body;
  }
}
