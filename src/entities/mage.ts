import * as PIXI from "pixi.js";
import { Physics, Sprite } from "../components";
import { Vec2, Box } from "planck-js";
import { PPM } from "../constants";
import { div } from "../utils/Vec2";
import { Health } from '../components/Health';
import { EntityManager } from '../entityManager';
import createHealthBar from './healthBar';
import { Transform } from '../components/Transform';
import { Position } from '../components';

const createMage = (
  app: PIXI.Application,
  texture,
  entityManager: EntityManager,
  world: planck.World,
  pos: Vec2,
  dynamic = false
) => {
  let sprite = new PIXI.AnimatedSprite(texture);
  app.stage.addChild(sprite);

  const mage = entityManager.createEntity();
  const body = world.createBody();

  if (dynamic) {
    body.setDynamic();
    body.setMassData({
      mass: 1,
      center: Vec2(),
      I: 1
    });
  } else {
    body.setKinematic();
  }

  body.setPosition(div(pos, PPM));
  body.createFixture(Box(sprite.height / (2 * PPM), sprite.width / (2 * PPM)));

  const health = new Health(100, 100);
  const position = new Position();

  createHealthBar(app, entityManager, health, position, new Transform(new Vec2(-sprite.width/2, sprite.height/2)));

  entityManager.addComponent(mage, Physics.typeName, new Physics(body));
  entityManager.addComponent(mage, Position.typeName, position);
  entityManager.addComponent(mage, Sprite.typeName, new Sprite(sprite));
  entityManager.addComponent(mage, Health.typeName, health);

  return mage;
};

export default createMage;
