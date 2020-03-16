import { MoveTarget } from './MoveTarget';
import { Physics } from './Physics';
import { Sprite } from './Sprite';

export type Components = {
  [MoveTarget.typeName]: MoveTarget
  [Physics.typeName]: Physics
  [Sprite.typeName]: Sprite
}

export {
  MoveTarget,
  Physics,
  Sprite
}
