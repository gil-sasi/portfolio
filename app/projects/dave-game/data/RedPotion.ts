import { PotionBase } from "./PotionBase";
import { Player } from "../engine/player";
import { FloatingText } from "../effects/FloatingText";
import { potionSprites } from "../engine/initPotions";

export class RedPotion extends PotionBase {
  constructor(x: number, y: number) {
    super(x, y, potionSprites.red, "red");
  }

  applyEffect(player: Player, effects: FloatingText[]) {
    player.health.heal(25);
    effects.push(new FloatingText(this.x, this.y, "+25 HP", "green"));
    this.collected = true;
  }
}
