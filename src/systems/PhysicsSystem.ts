import { System } from "../lib/System";
import { Transform } from "../components/Transform";
import { EntityManager } from "../entityManager";
import { Motion } from "../components/Motion";

export class PhysicsSystem implements System {
  components: any;

  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Motion.typeName, Transform.typeName);

    for (const e of itr) {
      const motion = e.components[Motion.typeName] as Motion;
      const transform = e.components[Transform.typeName] as Transform;

      transform.x += motion.velocity.x * dt;
      transform.y += motion.velocity.y * dt;
    }
  }
}
