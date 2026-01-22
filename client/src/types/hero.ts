// Hero type definitions for Battle Board system

export type RaceId = 'human' | 'orc' | 'elf' | 'dwarf' | 'undead' | 'demon';
export type ClassId = 'warrior' | 'ranger' | 'mage' | 'worge';

export interface HeroStats {
  // Base Attributes
  strength: number;     // STR - Physical damage, HP
  vitality: number;     // VIT - HP, survivability
  endurance: number;    // END - Defense, block chance
  dexterity: number;    // DEX - Accuracy, critical hit
  agility: number;      // AGI - Speed, dodge chance
  intellect: number;    // INT - Magic damage, mana
  wisdom: number;       // WIS - Magic defense, mana regen
  luck: number;         // LCK - Critical chance, loot quality
  
  // Derived Stats
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  speed: number;
  critChance: number;
  dodgeChance: number;
  blockChance: number;
}

export interface Equipment {
  weapon?: EquipmentItem;
  armor?: EquipmentItem;
  accessory?: EquipmentItem;
}

export interface EquipmentItem {
  id: string;
  name: string;
  tier: number; // 0-8 (T0-T8)
  bonuses: Partial<HeroStats>;
}

export interface SkillTree {
  classSkills: Skill[];
  weaponSkills: Skill[];
  allocatedPoints: number;
  availablePoints: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  tier: number;
  pointCost: number;
  unlocked: boolean;
  icon?: string;
  effect: SkillEffect;
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'utility';
  target: 'self' | 'ally' | 'enemy' | 'all-enemies' | 'all-allies';
  power: number;
  mpCost: number;
  cooldown: number;
  statusEffect?: string;
}

export interface Hero {
  id: string;
  raceId: RaceId;
  classId: ClassId;
  name: string;
  level: number;
  exp: number;
  stats: HeroStats;
  skills: SkillTree;
  equipment: Equipment;
  spriteUuid: string; // Links to HERO_SPRITE_MANIFEST
}
