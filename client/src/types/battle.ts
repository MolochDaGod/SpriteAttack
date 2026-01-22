// Battle system type definitions

import { Hero } from './hero';

export type ChallengeType = 'bounty' | 'raid' | 'boss' | 'survival' | 'tournament';
export type Composition = '3v2' | '3v3' | '3v4' | '3v1-miniboss' | '3v1-boss';
export type Faction = 'crusade' | 'fabled' | 'legion' | 'worge' | 'demon';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Challenge {
  id: string;
  type: ChallengeType;
  composition: Composition;
  faction: Faction;
  difficulty: Difficulty;
  title: string;
  description: string;
  enemies: EnemyTemplate[];
  rewards: ChallengeRewards;
  expiresAt: Date;
  completed: boolean;
}

export interface ChallengeRewards {
  gux: number;
  exp: number;
  equipment?: EquipmentDrop;
}

export interface EquipmentDrop {
  itemId: string;
  tier: number;
  dropChance: number;
}

export interface EnemyTemplate {
  id: string;
  name: string;
  raceId: string;
  classId: string;
  level: number;
  isBoss: boolean;
  statMultiplier: number; // For mini-boss (2.5x) and boss (5x)
  spriteUuid: string;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  speed: number;
  isBoss: boolean;
  statusEffects: StatusEffect[];
  spriteUuid: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff';
  duration: number;
  effect: {
    stat?: string;
    modifier?: number;
    damagePerTurn?: number;
  };
}

export type CombatantType = 'hero' | 'enemy';

export interface Combatant {
  type: CombatantType;
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  speed: number;
  atbGauge: number; // 0-100, turn happens at 100
  isAlive: boolean;
  statusEffects: StatusEffect[];
}

export interface BattleState {
  challengeId: string;
  heroes: Hero[];
  enemies: Enemy[];
  turnOrder: Combatant[];
  currentTurn: Combatant | null;
  battleLog: LogEntry[];
  isVictory: boolean;
  isDefeat: boolean;
  isPaused: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'damage' | 'heal' | 'status' | 'death' | 'info';
}

export interface BattleAction {
  type: 'attack' | 'skill' | 'defend' | 'item';
  actorId: string;
  targetId: string;
  skillId?: string;
  itemId?: string;
}

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  isDodged: boolean;
  isBlocked: boolean;
}
