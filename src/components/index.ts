import { Health } from "./Health";
import { MoveTarget } from './MoveTarget';
import { Physics } from './Physics';
import { Sprite } from './Sprite';

export type Components = {
  [MoveTarget.typeName]: MoveTarget
  [Health.typeName]: Health
  [Physics.typeName]: Physics
  [Sprite.typeName]: Sprite
}

export {
  MoveTarget,
  Physics,
  Sprite
}
