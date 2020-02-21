import { ECS } from "./entityManager";
import { RenderSystem } from "./systems/RenderSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";

import { PlayerInputSystem } from "./systems/PlayerInputSystem";
import * as PIXI from "pixi.js";
import { MovementSystem } from "./systems/MovementSystem";
import mage from "./entities/mage";

document.addEventListener("DOMContentLoaded", () => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
  });
  document.body.appendChild(app.view);

  const loader = new PIXI.Loader();

  // TODO: move asset loading somewhere else
  loader.add("sheet", "spritesheet.json").load((loader, resources) => {
    // resources is an object where the key is the name of the resource loaded and the value is the resource object.
    // They have a couple default properties:
    // - `url`: The URL that the resource was loaded from
    // - `error`: The error that happened when trying to load (if any)
    // - `data`: The raw data that was loaded
    // also may contain other properties based on the middleware that runs.

    let arr = [
      "mage-19.png",
      "mage-20.png",
      "mage-21.png",
      "mage-22.png",
      "mage-23.png",
      "mage-24.png",
      "mage-25.png",
      "mage-26.png"
    ];

    let texture = arr.map(name => resources.sheet.textures[name]);

    const ecs = new ECS();

    // sprite.animationSpeed = 0.167;
    // sprite.play();

    const player = mage(app, texture, ecs, { x: 50, y: 50 });

    // Build evil mages
    for (let index = 1; index <= 10; index++) {
      mage(app, [resources.sheet.textures["mage-10.png"]], ecs, {
        x: 50 * index,
        y: 300
      });
    }

    ecs.addSystem(new PlayerInputSystem(ecs.entityManager, player));
    ecs.addSystem(new PhysicsSystem());
    ecs.addSystem(new RenderSystem());
    ecs.addSystem(new MovementSystem());

    // run entitymanager (game engine) update function on each tick
    app.ticker.add(ecs.update.bind(ecs));
  });
});

// TODOLIST
// - add direction to player
// - add collision system
// - add fireball entity with damage component
// - add health component
// - add applyDamage system
// - add health to mage
// - death
// - tilemap
