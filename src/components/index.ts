import { Health } from "./Health";
import { MoveTarget } from './MoveTarget';
import { Physics } from './Physics';
import { Sprite } from './Sprite';
import { Transform } from './Transform';
import { HealthBar } from './HealthBar';
import { Position } from './Position';

export type Components = {
  [MoveTarget.typeName]: MoveTarget
  [Health.typeName]: Health
  [Physics.typeName]: Physics
  [Sprite.typeName]: Sprite
  [Transform.typeName]: Transform
  [HealthBar.typeName]: HealthBar,
  [Position.typeName]: Position
}

export {
  Health,
  MoveTarget,
  Physics,
  Sprite,
  Transform,
  HealthBar,
  Position
}
