import * as PIXI from "pixi.js";
import { Physics } from "../components/Physics";
import { Health } from '../components/Health';
import { EntityManager } from '../entityManager';
import { Sprite } from '../components/Sprite';
import { Transform } from '../components/Transform';

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 12,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
});

const createHealthBar = (
  app,
  entityManager: EntityManager,
  health: Health,
  physics: Physics,
  transform: Transform,
) => {
  const basicText = new PIXI.Text(`${health.value} / ${health.max}`, style);
  app.stage.addChild(basicText);

  const healthBar = entityManager.createEntity();

  entityManager.addComponent(healthBar, Physics.typeName, physics);
  entityManager.addComponent(healthBar, Health.typeName, health);
  entityManager.addComponent(healthBar, Sprite.typeName, new Sprite(basicText));
  entityManager.addComponent(healthBar, Transform.typeName, transform);

  return healthBar;
};

export default createHealthBar;
