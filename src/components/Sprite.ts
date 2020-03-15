export class Sprite {
  static typeName = "Sprite" as const;
  pixiSprite: PIXI.Sprite;

  constructor(sprite: PIXI.Sprite) {
    this.pixiSprite = sprite;
  }
}
