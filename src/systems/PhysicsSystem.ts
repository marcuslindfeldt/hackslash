import { System } from "../lib/System";
import { EntityManager } from "../entityManager";
import { Physics, Position } from '../components';
import { PPM } from '../constants';

export class PhysicsSystem implements System {
  world: planck.World;

  constructor(world: planck.World) {
    this.world = world;
  }

  update(em: EntityManager, dt: number) {
    this.world.step(dt);

    const itr = em.componentIterator(Physics.typeName, Position.typeName);

    for (const { components: { physics, position }} of itr) {
      // Convert physics body meter values to pixels
      const pos = physics.body
        .getPosition()
        .clone()
        .mul(PPM);

      position.position.x = Math.round(pos.x);
      position.position.y = Math.round(pos.y);
    }
  }
}
