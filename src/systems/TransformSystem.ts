import { System } from "../lib/System";
import { Sprite } from "../components/Sprite";
import { EntityManager } from "../entityManager";
import { Transform } from '../components/Transform';

export class TransformSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Transform.typeName, Sprite.typeName);

    for (const { components: { transform, sprite }} of itr) {
      sprite.pixiSprite.position.x += transform.transform.x;
      sprite.pixiSprite.position.y += transform.transform.y;
    }
  }
}
