import { Transform } from "../components/Transform";
import { Movement } from "../components/Movement";
import { Sprite } from "../components/Sprite";
import { Vec2 } from "../utils/Vec2";
import { Motion } from "../components/Motion";
import * as PIXI from "pixi.js";

const TICKS_PER_SECOND = 60
const MAX_SPEED = 5;
const SECONDS_TO_REACH_MAX_SPEED = 0.5
const ACCELERATION = MAX_SPEED / (SECONDS_TO_REACH_MAX_SPEED * TICKS_PER_SECOND);

const createMage = (app, texture, ecs, pos: Vec2) => {
  let sprite = new PIXI.AnimatedSprite(texture);
  app.stage.addChild(sprite);

  const mage = ecs.entityManager.createEntity();

  ecs.entityManager.addComponent(mage, Transform.typeName, new Transform(pos));
  ecs.entityManager.addComponent(mage, Movement.typeName, new Movement(MAX_SPEED, ACCELERATION));
  ecs.entityManager.addComponent(mage, Sprite.typeName, new Sprite(sprite));
  ecs.entityManager.addComponent(
    mage,
    Motion.typeName,
    new Motion({ x: 0, y: 0 })
  );

  return mage;
};

export default createMage;
