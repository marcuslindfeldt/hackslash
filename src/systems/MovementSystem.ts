import { System } from "../lib/System";
import { Transform } from "../components/Transform";
import { EntityManager } from "../entityManager";
import { MoveTarget } from "../components/MoveTarget";
import {
  Vec2,
  equals,
  sub,
  magnitude,
  add,
  mult,
  normalize
} from "../utils/Vec2";

function forwardTo(current: Vec2, target: Vec2, maxDistanceDelta: number) {
  let a = sub(target, current);

  let mag = magnitude(a);
  if (mag <= maxDistanceDelta || mag == 0) {
    return target;
  }

  return add(current, mult(normalize(a), maxDistanceDelta));
}

export class MovementSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const SPEED = 10;

    const itr = em.componentIterator(MoveTarget.typeName, Transform.typeName);

    for (const e of itr) {
      const moveTarget = e.components[MoveTarget.typeName] as MoveTarget;
      const transform = e.components[Transform.typeName] as Transform;
      if (moveTarget) {
        let target = moveTarget.position;
        let current = transform;

        let step = SPEED * dt;
        let next = forwardTo(current, target, step);

        transform.x = next.x;
        transform.y = next.y;

        if (equals(target, transform)) {
          em.removeComponent(e.entityId, MoveTarget.typeName);
        }
      }
    }
  }
}
