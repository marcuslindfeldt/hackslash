import { System } from "../lib/System";
import { Sprite, Position } from "../components";
import { EntityManager } from "../entityManager";

export class RenderSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Position.typeName, Sprite.typeName);

    for (const { components: { position, sprite }} of itr) {
      sprite.pixiSprite.position.x = position.position.x;
      sprite.pixiSprite.position.y = position.position.y;
    }
  }
}
