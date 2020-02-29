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
      // Arrange
      const moveTarget = e.components[MoveTarget.typeName] as MoveTarget;
      const physics = e.components[Physics.typeName] as Physics;
      
      // Act
      this.updateData(moveTarget, physics, dt);

      // Finish
      if (this.didReachTarget(moveTarget, physics)) {
        em.removeComponent(e.entityId, MoveTarget.typeName);
      }
    }
  }

  /**
   * The method where components are updated
   * For all but the non trivial this should call methods whith clear names, making for easy reading (y'know, like prose)
   * @param moveTarget 
   * @param physics 
   * @param dt 
   */
  private updateData(moveTarget: MoveTarget, physics: Physics, dt: number) {
    let target = moveTarget.position;
    
    // TODO: not sure this is necessary, do you really want to rotate the physics body? I think it would make more sense to have a circle collider for characters
    // calculate angle
    this.turn(target, physics);

    // use linear interpolation to move one step closer to target on each frame
    this.move(target, dt, physics);
  }

  /**
   * Calculates the angle the body is moving and rotates the rigidbody accordingly
   * @param target 
   * @param physics 
   */
  private turn(target: Vec2, physics: Physics) {
    let diff = Vec2.sub(target, physics.body.getPosition());
    let angle = Math.atan2(diff.y, diff.x);
    physics.body.setAngle(angle);
  }

  private move(target: Vec2, dt: number, physics: Physics) {
    let current = physics.body.getPosition();
    let newPos = forwardTo(current, target, dt);
    physics.body.setPosition(newPos);
  }

  private didReachTarget(moveTarget: MoveTarget, physics: Physics){
    return this.getDistanceToTarget(moveTarget, physics) < 1;
  }

  private getDistanceToTarget(moveTarget: MoveTarget, physics: Physics){
    let pos = physics.body.getPosition();
    let targetPos = moveTarget.position;
    return Vec2.distance(pos, targetPos);
  }
}
