import { Health } from "./Health";
import { MoveTarget } from './MoveTarget';
import { Physics } from './Physics';
import { Sprite } from './Sprite';
import { Transform } from './Transform';

export type Components = {
  [MoveTarget.typeName]: MoveTarget
  [Health.typeName]: Health
  [Physics.typeName]: Physics
  [Sprite.typeName]: Sprite
  [Transform.typeName]: Transform
}

export {
  MoveTarget,
  Physics,
  Sprite
}
