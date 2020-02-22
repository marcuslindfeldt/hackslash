import { System } from "../lib/System";
import { Transform } from "../components/Transform";
import { Movement } from "../components/Movement";
import { EntityManager } from "../entityManager";
import { MoveTarget } from "../components/MoveTarget";
import {
  Vec2,
  equals,
  sub,
  magnitude,
  add,
  mult,
  normalize,
  clampLength
} from "../utils/Vec2";

function forwardTo(current: Vec2, target: Vec2, maxDistanceDelta: number):Vec2 {
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
    
    const itr = em.componentIterator(MoveTarget.typeName, Transform.typeName, Movement.typeName);

    for (const e of itr) {
      const moveTarget = e.components[MoveTarget.typeName] as MoveTarget;
      const transform = e.components[Transform.typeName] as Transform;
      const movement = e.components[Movement.typeName] as Movement;

      if (moveTarget && movement) {
        let target = moveTarget.position;
        
        this.accelerateTowards(target, transform, movement, dt);
        this.move(transform, dt, movement);

        if (equals(target, transform)) {
          em.removeComponent(e.entityId, MoveTarget.typeName);
        }
      }
    }
  }

  private move(transform: Transform, dt: number, movement: Movement) {
    transform.x += dt * movement.velocity.x;
    transform.y += dt * movement.velocity.y;
  }

  private accelerateTowards(target: Vec2, transform: Transform, movement: Movement, dt: number) {
    const SLOWDOWN_DIST = 100;
    const REACH_TARGET_DIST = 1;
    let diffPos = sub(target, transform);
    let dist = magnitude(diffPos);
    let dir = normalize(diffPos);

    let deltaVelocity = mult(dir, dt * movement.acceleration); 
    
    movement.velocity = add(movement.velocity, deltaVelocity);
    
    if(dist < SLOWDOWN_DIST) //slow down when getting closer
      movement.velocity = clampLength(movement.velocity, movement.maxSpeed * dist / SLOWDOWN_DIST);
    
    if(dist <= REACH_TARGET_DIST)
      movement.velocity = {x:0, y:0};

    movement.velocity = clampLength(movement.velocity, movement.maxSpeed);
  }

  private clampMaxSpeed(movement: Movement) {
    if (magnitude(movement.velocity) > movement.maxSpeed)
      movement.velocity = mult(normalize(movement.velocity), movement.maxSpeed);
  }
}
