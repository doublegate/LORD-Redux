
import { Item, Enemy, Player, Rival } from './types';

export const WEAPONS: Item[] = [
  { id: 'w0', name: 'Stick', cost: 0, value: 1, type: 'WEAPON', description: 'A humble twig found in the mud. Better than fists.', charm: 0 },
  { id: 'w1', name: 'Dagger', cost: 200, value: 5, type: 'WEAPON', description: 'Small, sharp, and easy to hide in a boot.', charm: 1 },
  { id: 'w2', name: 'Short Sword', cost: 800, value: 10, type: 'WEAPON', description: 'Standard issue militia weapon. Reliable.', charm: 3 },
  { id: 'w3', name: 'Long Sword', cost: 1500, value: 15, type: 'WEAPON', description: 'A knight\'s blade. Commands respect.', charm: 5 },
  { id: 'w4', name: 'Huge Axe', cost: 3000, value: 20, type: 'WEAPON', description: 'Heavy and intimidating. Barbarians love it.', charm: 2 },
  { id: 'w5', name: 'Bone Crusher', cost: 6000, value: 30, type: 'WEAPON', description: 'A massive mace adorned with spikes.', charm: 8 },
  { id: 'w6', name: 'Dragon Slayer', cost: 12000, value: 50, type: 'WEAPON', description: 'A legendary glowing blade humming with power.', charm: 20 },
];

export const ARMOR: Item[] = [
  { id: 'a0', name: 'T-Shirt', cost: 0, value: 0, type: 'ARMOR', description: 'Stained with ale and dirt. Offers no protection.', charm: 0 },
  { id: 'a1', name: 'Leather Vest', cost: 200, value: 2, type: 'ARMOR', description: 'Smells of the forest. Flexible and light.', charm: 1 },
  { id: 'a2', name: 'Chain Mail', cost: 800, value: 5, type: 'ARMOR', description: 'Interlocking metal rings. Clinks when you walk.', charm: 3 },
  { id: 'a3', name: 'Scale Mail', cost: 1500, value: 10, type: 'ARMOR', description: 'Overlapping metal scales like a fish.', charm: 6 },
  { id: 'a4', name: 'Plate Mail', cost: 3000, value: 15, type: 'ARMOR', description: 'Polished steel suits used by royal guards.', charm: 12 },
  { id: 'a5', name: 'Dragon Scale', cost: 10000, value: 30, type: 'ARMOR', description: 'Forged from the hide of a red dragon. Indestructible.', charm: 30 },
];

export const MONSTERS: Enemy[] = [
  { id: 'm1', name: 'Snotling', level: 1, hp: 10, maxHp: 10, str: 2, def: 1, gold: 15, exp: 10, weaponName: 'tiny claws', openingLine: 'A small green creature hisses at you!' },
  { id: 'm2', name: 'Rat', level: 1, hp: 15, maxHp: 15, str: 3, def: 1, gold: 25, exp: 15, weaponName: 'sharp teeth', openingLine: 'A giant rat scurries out of the bushes!' },
  { id: 'm3', name: 'Kobold', level: 2, hp: 25, maxHp: 25, str: 5, def: 2, gold: 50, exp: 40, weaponName: 'rusty knife', openingLine: 'A kobold demands your gold!' },
  { id: 'm4', name: 'Wolf', level: 3, hp: 40, maxHp: 40, str: 8, def: 3, gold: 80, exp: 70, weaponName: 'fangs', openingLine: 'A wolf howls and lunges!' },
  { id: 'm5', name: 'Bandit', level: 4, hp: 60, maxHp: 60, str: 12, def: 5, gold: 150, exp: 120, weaponName: 'scimitar', openingLine: 'Your money or your life!' },
  { id: 'm6', name: 'Ogre', level: 6, hp: 100, maxHp: 100, str: 20, def: 8, gold: 300, exp: 250, weaponName: 'club', openingLine: 'Me smash human!' },
  { id: 'm7', name: 'Red Dragon', level: 10, hp: 500, maxHp: 500, str: 50, def: 20, gold: 5000, exp: 5000, weaponName: 'breath of fire', openingLine: 'THE LEGENDARY RED DRAGON DESCENDS!' },
];

export const RIVALS: Rival[] = [
  { id: 'r1', name: 'DarkAvenger', level: 1, hp: 25, maxHp: 25, str: 12, def: 2, gold: 200, exp: 100, weapon: WEAPONS[1], armor: ARMOR[0], gender: 'M' },
  { id: 'r2', name: 'LadyDeath', level: 3, hp: 60, maxHp: 60, str: 15, def: 5, gold: 500, exp: 400, weapon: WEAPONS[2], armor: ARMOR[1], gender: 'F' },
  { id: 'r3', name: 'SirGalahad', level: 5, hp: 100, maxHp: 100, str: 25, def: 10, gold: 1200, exp: 1500, weapon: WEAPONS[3], armor: ARMOR[2], gender: 'M' },
  { id: 'r4', name: 'Merlin', level: 8, hp: 200, maxHp: 200, str: 40, def: 15, gold: 3000, exp: 5000, weapon: WEAPONS[4], armor: ARMOR[3], gender: 'M' },
];

export const LEVEL_EXP = [0, 100, 400, 1000, 2500, 5000, 10000, 20000, 40000, 80000, 1000000];

export const INITIAL_PLAYER: Player = {
  name: '',
  level: 1,
  hp: 20,
  maxHp: 20,
  str: 10,
  def: 1,
  exp: 0,
  gold: 100,
  bank: 0,
  forestFights: 10,
  userFights: 3,
  weapon: WEAPONS[0],
  armor: ARMOR[0],
  isDead: false,
  charm: 10,
};
