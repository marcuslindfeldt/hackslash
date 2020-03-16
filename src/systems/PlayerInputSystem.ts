import { System } from "../lib/System";
import { MoveTarget, Physics } from "../components";
import { EntityManager } from "../entityManager";
import { Vec2 } from "planck-js";
import { PPM } from "../constants";

const toRadians = deg => deg * (Math.PI / 180);
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

    const onMouse = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      // remove any previously added components
      em.removeComponent(this.entityId, MoveTarget.typeName);
      em.addComponent(
        this.entityId,
        MoveTarget.typeName,
        new MoveTarget(new Vec2(x / PPM, y / PPM))
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
    const physics = em.getComponent(this.entityId, Physics.typeName);
    const body = physics.body;

    body.setLinearVelocity(new Vec2(0, 0));

    if (this.pressedKeys.has("ArrowUp") && this.pressedKeys.has("ArrowDown")) {
      body.setLinearVelocity(new Vec2(0, 0));
      return;
    }

    if (
      this.pressedKeys.has("ArrowLeft") &&
      this.pressedKeys.has("ArrowRight")
    ) {
      body.setLinearVelocity(new Vec2(0, 0));
      return;
    }

    if (this.pressedKeys.has("ArrowUp") && this.pressedKeys.has("ArrowRight")) {
      // NORT-EAST
      body.setAngle(toRadians(-45));
      body.setLinearVelocity(new Vec2(1, -1));
    } else if (
      this.pressedKeys.has("ArrowUp") &&
      this.pressedKeys.has("ArrowLeft")
    ) {
      // NORT-WEST
      body.setAngle(toRadians(-135));
      body.setLinearVelocity(new Vec2(-1, -1));
    } else if (
      this.pressedKeys.has("ArrowDown") &&
      this.pressedKeys.has("ArrowLeft")
    ) {
      // SOUTH-WEST
      body.setAngle(toRadians(135));
      body.setLinearVelocity(new Vec2(-1, 1));
    } else if (
      this.pressedKeys.has("ArrowDown") &&
      this.pressedKeys.has("ArrowRight")
    ) {
      // SOUTH-EAST
      body.setAngle(toRadians(45));
      body.setLinearVelocity(new Vec2(1, 1));
    } else if (this.pressedKeys.has("ArrowUp")) {
      // NORTH
      body.setAngle(toRadians(-90));
      body.setLinearVelocity(new Vec2(0, -1));
    } else if (this.pressedKeys.has("ArrowDown")) {
      // SOUTH
      body.setAngle(toRadians(90));
      body.setLinearVelocity(new Vec2(body.getLinearVelocity().x, 1));
    } else if (this.pressedKeys.has("ArrowLeft")) {
      // WEST
      body.setAngle(toRadians(180));
      body.setLinearVelocity(new Vec2(-1, body.getLinearVelocity().y));
    } else if (this.pressedKeys.has("ArrowRight")) {
      // EAST
      body.setAngle(toRadians(0));
      body.setLinearVelocity(new Vec2(1, body.getLinearVelocity().y));
    }
  }
}
