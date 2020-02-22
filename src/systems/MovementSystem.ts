import { System } from "../lib/System";
import { Physics } from "../components/Physics";
import { EntityManager } from "../entityManager";
import { MoveTarget } from "../components/MoveTarget";
import { normalize } from "../utils/Vec2";
import { Vec2 } from "planck-js";

function forwardTo(current: Vec2, target: Vec2, maxDistanceDelta: number) {
  let a = Vec2.sub(target, current);

  let mag = a.length();
  if (mag <= maxDistanceDelta || mag == 0) {
    return target;
  }

  return Vec2.add(current, Vec2.mul(normalize(a), maxDistanceDelta));
}

export class MovementSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(MoveTarget.typeName, Physics.typeName);

    for (const e of itr) {
      const moveTarget = e.components[MoveTarget.typeName] as MoveTarget;
      const physics = e.components[Physics.typeName] as Physics;
      let target = moveTarget.position;
      let current = physics.body.getPosition();

      // calculate angle
      let diff = Vec2.sub(target, current);

      let angle = Math.atan2(diff.y, diff.x);
      physics.body.setAngle(angle);

      // use linear interpolation to move one step closer to target on each frame
      let next = forwardTo(current, target, dt);

      physics.body.setPosition(next);

      if (Vec2.distance(next, target) < 1) {
        em.removeComponent(e.entityId, MoveTarget.typeName);
      }
    }
  }
}
