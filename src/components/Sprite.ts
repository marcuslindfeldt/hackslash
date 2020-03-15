export class Sprite {
  static typeName = "sprite" as const;
  pixiSprite: PIXI.Sprite;

  constructor(sprite: PIXI.Sprite) {
    this.pixiSprite = sprite;
    this.pixiSprite.zIndex = 1
  }
}
