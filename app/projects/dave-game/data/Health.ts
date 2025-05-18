export class Health {
  hp: number;
  maxHp: number;
  isDead: boolean = false;

  constructor(hp: number) {
    this.hp = hp;
    this.maxHp = hp;
  }

  takeDamage(amount: number) {
    if (this.isDead) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
  }

  heal(amount: number) {
    if (this.isDead) return;
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  reset() {
    this.hp = this.maxHp;
    this.isDead = false;
  }
}