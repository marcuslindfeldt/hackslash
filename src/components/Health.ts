export class Health {
  static typeName = <const> "Health";
  value: number;
  max: number;

  constructor(currentHealth: number, maxHealth: number) {
    this.value = currentHealth;
    this.max = maxHealth;
  }
}
