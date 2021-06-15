export class Health {
  static typeName = <const> "health";
  current: number;
  max: number;

  constructor(current: number, maxHealth: number) {
    this.current = current;
    this.max = maxHealth;
  }
}
