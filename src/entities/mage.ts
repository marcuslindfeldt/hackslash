import { Sprite } from "../components/Sprite";
import * as PIXI from "pixi.js";
import { Physics } from "../components/Physics";
import { Vec2, Box } from "planck-js";
import { PPM } from "../constants";
import { div } from "../utils/Vec2";

const createMage = (app, texture, ecs, world: planck.World, pos: Vec2) => {
  let sprite = new PIXI.AnimatedSprite(texture);
  app.stage.addChild(sprite);

  const mage = ecs.entityManager.createEntity();

  const body = world.createKinematicBody();

  body.setPosition(div(pos, PPM));
  body.createFixture(Box(sprite.height / 2, sprite.width / 2));

  ecs.entityManager.addComponent(mage, Physics.typeName, new Physics(body));
  ecs.entityManager.addComponent(mage, Sprite.typeName, new Sprite(sprite));

  return mage;
};

export default createMage;
