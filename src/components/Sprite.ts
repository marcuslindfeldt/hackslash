export class Sprite {
  static typeName = "Sprite";
  pixiSprite: PIXI.Sprite;

  constructor(sprite: PIXI.Sprite) {
    this.pixiSprite = sprite;
  }
}
