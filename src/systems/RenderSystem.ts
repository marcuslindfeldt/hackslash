import { System } from "../lib/System";
import { Transform } from "../components/Transform";
import { Sprite } from "../components/Sprite";
import { EntityManager } from "../entityManager";

export class RenderSystem implements System {
  constructor() {}

  //   onAttach(cm: any) {
  //     console.log("system attached");
  //     // this.components = componentManager;

  //     this.tuples = cm.withComponents(Renderable, Transform);
  //   }

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Transform.typeName, Sprite.typeName);

    for (const e of itr) {
      const transform = e.components[Transform.typeName] as Transform;
      const sprite = e.components[Sprite.typeName] as Sprite;

      sprite.pixiSprite.position.x = transform.x;
      sprite.pixiSprite.position.y = transform.y;
    }
  }
}
