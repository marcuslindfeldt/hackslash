import { System } from "../lib/System";
import { EntityManager } from "../entityManager";
import { HealthBar, Health } from "../components";

export class HealthBarSystem implements System {
  constructor() {}

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(HealthBar.typeName, Health.typeName);

    for (const { components: { healthBar, health } } of itr) {
      if (health.current > 0) {
        healthBar.text.text = `${health.current} / ${health.max}`
      } else {
        healthBar.text.text = `DEAD?`
      }
    }
  }
}
