import * as PIXI from "pixi.js";
import { Health, HealthBar, Sprite, Transform, Position } from '../components';
import { EntityManager } from '../entityManager';

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
  position: Position,
  transform: Transform,
) => {
  const basicText = new PIXI.Text('', style);
  app.stage.addChild(basicText);

  const healthBar = entityManager.createEntity();

  entityManager.addComponent(healthBar, Position.typeName, position);
  entityManager.addComponent(healthBar, Health.typeName, health);
  entityManager.addComponent(healthBar, Transform.typeName, transform);
  entityManager.addComponent(healthBar, Sprite.typeName, new Sprite(basicText))
  entityManager.addComponent(healthBar, HealthBar.typeName, new HealthBar(basicText))

  return healthBar;
};

export default createHealthBar;
