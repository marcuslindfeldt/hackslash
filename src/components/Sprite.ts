export class Sprite {
  static typeName = "sprite" as const;
  pixiSprite: PIXI.Sprite;

  addead: boolean = false

  constructor(sprite: PIXI.Sprite) {
    this.pixiSprite = sprite;
    this.pixiSprite.zIndex = 1
  }
}
