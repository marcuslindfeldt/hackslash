import * as PIXI from "pixi.js";
import { Physics, Sprite } from "../components";
import { Vec2, Box } from "planck-js";
import { PPM } from "../constants";
import { div } from "../utils/Vec2";
import { Health } from '../components/Health';
import { ECS } from '../entityManager';

const createMage = (
  app,
  texture,
  ecs: ECS,
  world: planck.World,
  pos: Vec2,
  dynamic = false
) => {
  let sprite = new PIXI.AnimatedSprite(texture);
  app.stage.addChild(sprite);

  const mage = ecs.entityManager.createEntity();
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

  ecs.entityManager.addComponent(mage, Physics.typeName, new Physics(body));
  ecs.entityManager.addComponent(mage, Sprite.typeName, new Sprite(sprite));
  ecs.entityManager.addComponent(mage, Health.typeName, new Health(100, 100));

  return mage;
};

export default createMage;
