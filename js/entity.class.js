/*
 * Rogue 
 * Copyright (c) 2021 Olivier Nocent
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * 
 * -----------------------------------------------------------------------------
 * Entity and its subclasses represent each element (player, monster, object)
 * of the game.
 * 
 */ 
 
class Entity {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Portal extends Entity {
  constructor(x, y) {
    super(18, x, y);
  }
}

class Pebble extends Entity {
  constructor(x = 1, y = 1) {
    super(27, x, y);
  }
}

class Collectible extends Entity {
  constructor(id, x, y) {
    super(id, x, y);
  }
}

class Heart extends Collectible {
  constructor(x, y) {
    super(19, x, y);
  }

  description() {
    return 'health potion (+2 stamina)'
  }

  isTakenBy(player) {
    player.stamina += 2;
    if (player.stamina > player.initialStamina) player.stamina = player.initialStamina;
  }
}

class Gem extends Collectible {
  constructor(x, y) {
    super(20, x, y);
  }

  description() {
    return 'gem'
  }

  isTakenBy(player) {
    player.gems++;
  }
}

class MagicRing extends Collectible {
  constructor(x, y) {
    super(21, x, y);
  }

  description() {
    return 'magic ring (+1 mana)'
  }

  isTakenBy(player) {
    player.mana++;
  }
}

class Sword extends Collectible {
  constructor(x, y) {
    super(22, x, y);
  }

  description() {
    return 'sword (+1 damage)'
  }

  isTakenBy(player) {
    player.damage = 1;
  }
}

class MagicSword extends Collectible {
  constructor(x, y) {
    super(23, x, y);
  }

  description() {
    return 'magic sword (+3 damage)'
  }

  isTakenBy(player) {
    player.damage = 3;
  }
}

class LivingEntity extends Entity {
  constructor(id, x, y, skill, stamina) {
    super(id, x, y);
    this.skill = skill
    this.stamina = stamina;
  }

  isAlive() {
    return (this.stamina > 0);
  }

  isDead() {
    return (this.stamina <= 0);
  }
}

function rollDice(faceCount) {
  return Math.floor(Math.random() * faceCount) + 1;
}

class Player extends LivingEntity {
  constructor(x = 1, y = 1) {
    super(24, x, y, rollDice(4) + 8, rollDice(6) + 18);
    this.initialStamina = this.stamina;
    this.damage = 0;
    this.mana = 0;
    this.gems = 0;
  }

  attack(opponent) {
    if (this.skill + rollDice(6) + rollDice(6) >= opponent.skill + rollDice(6) + rollDice(6))
      opponent.stamina -= 2 + this.damage;
    else
      this.stamina -= 2;

    if (opponent.isDead()) opponent.id = 26;
    if (this.isDead()) this.id = 26;
  }
}

class Monster extends LivingEntity {
  constructor(x, y, skill, stamina) {
    super(25, x, y, rollDice(6) + 4, rollDice(6) + 6);
  }
}
