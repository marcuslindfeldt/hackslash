import * as PIXI from "pixi.js";
import planck, { Vec2, Contact } from "planck-js";
import mage from "./entities/mage";
import { ECS } from "./entityManager";
import { MovementSystem } from "./systems/MovementSystem";
import { PhysicsVisualizationSystem } from "./systems/PhysicsVisualizationSystem";
import { PlayerInputSystem } from "./systems/PlayerInputSystem";
import { RenderSystem } from "./systems/RenderSystem";

import loadMap, { drawMap } from "./map";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

console.log("window.devicePixelRatio", window.devicePixelRatio);
document.addEventListener("DOMContentLoaded", () => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    resolution: Math.floor(window.devicePixelRatio || 1),
    autoDensity: true,
  });
  app.stage.sortableChildren = true;
  document.body.appendChild(app.view);

  const loader = new PIXI.Loader();

  loadMap(loader);

  const world = planck.World({
    gravity: planck.Vec2(0, 0)
  });

  loader.add("sheet", "spritesheet.json");

  // TODO: move asset loading somewhere else
  loader.load((loader, resources) => {
    drawMap(app, resources);
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

    const player = mage(app, texture, ecs, world, new Vec2(50, 50), true);

    // Build evil mages
    for (let index = 1; index <= 10; index++) {
      mage(
        app,
        [resources.sheet.textures["mage-10.png"]],
        ecs,
        world,
        new Vec2(64 * index, 300)
      );
    }

    ecs.addSystem(new PlayerInputSystem(ecs.entityManager, player));
    ecs.addSystem(new MovementSystem());
    ecs.addSystem(new RenderSystem());
    ecs.addSystem(new PhysicsVisualizationSystem(app));

    world.on("begin-contact", (contact: Contact) => {
      console.log("contact", contact);
    });
    world.on("pre-solve", (contact: Contact) => {
      console.log("contact", contact);
    });
    world.on("end-contact", (contact: Contact) => {
      console.log("contact", contact);
    });

    const update = delta => {
      world.step(delta);
      ecs.update(delta);
    };

    // update(1);

    // run entitymanager (game engine) update function on each tick
    app.ticker.add(update);
  });
});

// TODOLIST
// - add animated sprites based on direction
// - add collision system
// - add fireball entity with damage component
// - add health component
// - add applyDamage system
// - add health to mage
// - death
// - tilemap
