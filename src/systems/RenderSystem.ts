import { System } from "../lib/System";
import { Sprite } from "../components/Sprite";
import { EntityManager } from "../entityManager";
import { Physics } from "../components/Physics";
import { PPM } from "../constants";

export class RenderSystem implements System {
  constructor() {}

  //   onAttach(cm: any) {
  //     console.log("system attached");
  //     // this.components = componentManager;

  //     this.tuples = cm.withComponents(Renderable, Transform);
  //   }

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Physics.typeName, Sprite.typeName);

    for (const e of itr) {
      const physics = e.components.Physics;
      const sprite = e.components.Sprite;

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
