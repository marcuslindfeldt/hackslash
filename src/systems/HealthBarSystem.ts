import * as PIXI from "pixi.js";
import { System } from "../lib/System";
import { Sprite } from "../components/Sprite";
import { EntityManager } from "../entityManager";
import { Health } from "../components/Health";

export class HealthBarSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Health.typeName, Sprite.typeName);

    for (const { components: { health, sprite }} of itr) {
      if (sprite.pixiSprite instanceof PIXI.Text) {
        sprite.pixiSprite.text = `${health.value} / ${health.max}`
      }
    }
  }
}
