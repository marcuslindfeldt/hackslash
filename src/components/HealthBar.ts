export class HealthBar {
  static typeName = "healthBar" as const;
  text: PIXI.Text;

  constructor(sprite: PIXI.Text) {
    this.text = sprite;
    this.text.zIndex = 1
  }
}
