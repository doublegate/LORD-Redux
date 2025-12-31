
export interface Item {
  id: string;
  name: string;
  cost: number;
  value: number; // Attack for weapons, Defense for armor
  type: 'WEAPON' | 'ARMOR';
  description: string;
  charm: number;
  generatedLore?: string; // AI generated backstory
}

export interface Player {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  str: number;
  def: number;
  exp: number;
  gold: number;
  bank: number;
  forestFights: number;
  userFights: number; // PvP fights per day
  weapon: Item;
  armor: Item;
  isDead: boolean;
  charm: number; // For social interactions
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  str: number;
  def: number;
  gold: number;
  exp: number;
  weaponName: string;
  openingLine: string;
  asciiArt?: string; // Procedurally generated art
  isPlayer?: boolean; // Flag to identify PvP targets
}

export interface ForestEvent {
  id: string;
  title: string;
  description: string;
  effect: 'GOLD' | 'XP' | 'HEAL' | 'DAMAGE' | 'NOTHING';
  value: number;
  resultText: string;
  asciiArt?: string;
}

export interface Rival {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  str: number;
  def: number;
  gold: number;
  exp: number;
  weapon: Item;
  armor: Item;
  gender: string;
}

export interface MessagePost {
  id: number;
  author: string;
  content: string;
  date: string;
}

export interface ChatMessage {
  sender: 'User' | 'Violet';
  text: string;
}

export enum GameLocation {
  LOGIN,
  TOWN,
  FOREST,
  INN,
  WEAPON_SHOP,
  ARMOR_SHOP,
  BANK,
  TRAINING,
  STATS,
  BOARD,
  BATTLE,
  HEALERS_HUT,
  LIBRARY,
  PVP_LIST
}

export enum LogType {
  INFO,
  COMBAT_PLAYER,
  COMBAT_ENEMY,
  GAIN,
  DANGER
}

export interface LogEntry {
  id: string;
  text: string;
  type: LogType;
  timestamp: number;
}
