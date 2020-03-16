import { System } from "../lib/System";
import { Sprite, Physics } from "../components";
import { EntityManager } from "../entityManager";
import { PPM } from "../constants";

export class RenderSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Physics.typeName, Sprite.typeName);

    for (const { components: { physics, sprite } } of itr) {
      // Convert physics body meter values to pixels
      const pos = physics.body
        .getPosition()
        .clone()
        .mul(PPM);

      sprite.pixiSprite.position.x = Math.round(pos.x);
      sprite.pixiSprite.position.y = Math.round(pos.y);
    }
  }
}
