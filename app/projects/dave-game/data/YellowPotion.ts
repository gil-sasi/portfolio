import { PotionBase } from "./PotionBase";
import { Player } from "../engine/player";
import { FloatingText } from "../effects/FloatingText";
import { potionSprites } from "../engine/initPotions";

export class YellowPotion extends PotionBase {
  constructor(x: number, y: number) {
    super(x, y, potionSprites.yellow, "yellow");
  }

  applyEffect(player: Player, effects: FloatingText[]) {
    player.canDoubleJump = true;
    effects.push(new FloatingText(this.x, this.y, "Double Jump!", "yellow"));
    this.collected = true;
  }
}
