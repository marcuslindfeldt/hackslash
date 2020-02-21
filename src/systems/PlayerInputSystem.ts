import { System } from "../lib/System";
import { Motion } from "../components/Motion";
import { MoveTarget } from "../components/MoveTarget";
import { EntityManager } from "../entityManager";

export class PlayerInputSystem implements System {
  pressedKeys = new Set<string>();

  entityId: string;

  constructor(em: EntityManager, entityId: string) {
    this.entityId = entityId;

    window.addEventListener(
      "keydown",
      event => {
        this.pressedKeys.add(event.key);
      },
      true
    );
    window.addEventListener(
      "keyup",
      event => {
        this.pressedKeys.delete(event.key);
      },
      true
    );

    const onMouse = event => {
      const x = event.clientX;
      const y = event.clientY;

      // remove any previously added components
      em.removeComponent(this.entityId, MoveTarget.typeName);
      em.addComponent(
        this.entityId,
        MoveTarget.typeName,
        new MoveTarget({ x, y })
      );
    };

    window.addEventListener("mousedown", event => {
      this.pressedKeys.add("MOUSE_LEFT");

      onMouse(event);
    });
    window.addEventListener("mouseup", () => {
      this.pressedKeys.delete("MOUSE_LEFT");
    });

    window.addEventListener("mousemove", event => {
      if (!this.pressedKeys.has("MOUSE_LEFT")) {
        return;
      }
      onMouse(event);
    });
  }

  update(em: EntityManager, dt: number) {
    const SPEED = 10;

    const motion = em.getComponent(this.entityId, Motion.typeName) as Motion;

    // TODO: should probably only happen on keyup
    motion.velocity.y = 0;
    motion.velocity.x = 0;

    if (this.pressedKeys.has("ArrowUp") && this.pressedKeys.has("ArrowDown")) {
      motion.velocity.y = 0;
      return;
    }

    if (
      this.pressedKeys.has("ArrowLeft") &&
      this.pressedKeys.has("ArrowRight")
    ) {
      motion.velocity.x = 0;
      return;
    }

    if (this.pressedKeys.has("ArrowUp")) {
      motion.velocity.y = -1 * SPEED;
    }
    if (this.pressedKeys.has("ArrowDown")) {
      motion.velocity.y = 1 * SPEED;
    }
    if (this.pressedKeys.has("ArrowLeft")) {
      motion.velocity.x = -1 * SPEED;
    }
    if (this.pressedKeys.has("ArrowRight")) {
      motion.velocity.x = 1 * SPEED;
    }
  }
}
