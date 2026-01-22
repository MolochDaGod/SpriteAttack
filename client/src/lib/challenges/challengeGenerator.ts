// Challenge generation system for Battle Board

import { 
  Challenge, 
  ChallengeType, 
  Composition, 
  Faction, 
  Difficulty,
  EnemyTemplate 
} from '@/types/battle';

const FACTION_NAMES = {
  crusade: ['Holy Knight', 'Templar', 'Crusader', 'Paladin'],
  fabled: ['Elven Archer', 'Dwarven Guard', 'High Mage', 'Forest Priest'],
  legion: ['Orc Brute', 'Skeleton Warrior', 'Dark Mage', 'Undead Knight'],
  worge: ['Werewolf', 'Werebear', 'Beast Shaman', 'Alpha Worge'],
  demon: ['Demon Warrior', 'Infernal Mage', 'Hellspawn', 'Demon Lord']
};

const CHALLENGE_TITLES = {
  bounty: [
    'Bounty: Defeat {enemy}',
    'Wanted: {enemy}',
    'Hunt: {enemy} Pack'
  ],
  raid: [
    '{faction} Raid',
    'Assault on {faction} Forces',
    '{faction} Incursion'
  ],
  boss: [
    'Boss: {enemy}',
    'Challenge: The Mighty {enemy}',
    'Trial of {enemy}'
  ],
  survival: [
    'Survival: {faction} Onslaught',
    'Endure: {faction} Waves',
    'Last Stand vs {faction}'
  ],
  tournament: [
    '{faction} Tournament',
    'Arena: {faction} Champions',
    'Proving Grounds: {faction}'
  ]
};

const CHALLENGE_DESCRIPTIONS = {
  crusade: [
    'The Crusade seeks to test worthy challengers against their holy warriors.',
    'Crusaders march forth. Prove your strength against the faithful.',
    'The holy order demands combat. Face their champions for glory.'
  ],
  fabled: [
    'Ancient alliances of Elves and Dwarves challenge all comers.',
    'The Fabled races offer trials of skill and magic.',
    'Elven archers and Dwarven defenders await your challenge.'
  ],
  legion: [
    'The Legion of Orcs and Undead threatens the borderlands. Stop them.',
    'Dark forces gather. Defeat the Legion for great rewards.',
    'Orcish brutality and undead horrors await. Face them if you dare.'
  ],
  worge: [
    'Beast clans prowl the wilderness. Hunt them down.',
    'Worge packs roam free. Defeat them to claim your bounty.',
    'Savage beasts challenge all who enter their territory.'
  ],
  demon: [
    'Infernal forces breach the realm. Banish them back to the abyss.',
    'Demon Lords offer deadly challenges for the brave.',
    'Face the horrors of the underworld. Only the strongest survive.'
  ]
};

function getCompositionEnemyCount(composition: Composition): number {
  switch (composition) {
    case '3v2': return 2;
    case '3v3': return 3;
    case '3v4': return 4;
    case '3v1-miniboss':
    case '3v1-boss':
      return 1;
  }
}

function getCompositionMultiplier(composition: Composition): number {
  switch (composition) {
    case '3v2': return 0.8;
    case '3v3': return 1.0;
    case '3v4': return 1.1;
    case '3v1-miniboss': return 2.5;
    case '3v1-boss': return 5.0;
  }
}

function getGuxReward(difficulty: Difficulty, composition: Composition): number {
  const baseRewards = [100, 250, 500, 1000, 2500];
  const base = baseRewards[difficulty - 1];
  const multiplier = getCompositionMultiplier(composition);
  return Math.floor(base * multiplier);
}

function generateEnemies(
  faction: Faction, 
  composition: Composition, 
  difficulty: Difficulty
): EnemyTemplate[] {
  const count = getCompositionEnemyCount(composition);
  const isBoss = composition === '3v1-boss' || composition === '3v1-miniboss';
  const statMultiplier = getCompositionMultiplier(composition);
  const enemyNames = FACTION_NAMES[faction];
  const level = 5 + (difficulty * 3);

  const enemies: EnemyTemplate[] = [];
  
  for (let i = 0; i < count; i++) {
    const nameIndex = isBoss ? enemyNames.length - 1 : Math.floor(Math.random() * enemyNames.length);
    const name = isBoss ? `${enemyNames[nameIndex]} (Boss)` : enemyNames[nameIndex];
    
    enemies.push({
      id: `enemy-${faction}-${i}-${Date.now()}`,
      name,
      raceId: faction,
      classId: ['warrior', 'ranger', 'mage'][Math.floor(Math.random() * 3)],
      level,
      isBoss,
      statMultiplier,
      spriteUuid: `anim-${faction}-warrior-idle-001` // TODO: Link to actual sprite manifest
    });
  }

  return enemies;
}

export function generateChallenge(
  type?: ChallengeType,
  composition?: Composition,
  faction?: Faction,
  difficulty?: Difficulty
): Challenge {
  // Randomize if not specified
  const finalType = type || (['bounty', 'raid', 'boss', 'survival', 'tournament'] as ChallengeType[])[
    Math.floor(Math.random() * 5)
  ];
  
  const finalComposition = composition || (['3v2', '3v3', '3v4', '3v1-miniboss', '3v1-boss'] as Composition[])[
    Math.floor(Math.random() * 5)
  ];
  
  const finalFaction = faction || (['crusade', 'fabled', 'legion', 'worge', 'demon'] as Faction[])[
    Math.floor(Math.random() * 5)
  ];
  
  const finalDifficulty = difficulty || (Math.floor(Math.random() * 5) + 1) as Difficulty;

  const enemies = generateEnemies(finalFaction, finalComposition, finalDifficulty);
  const enemyName = enemies[0]?.name || 'Enemy';
  
  const titleTemplate = CHALLENGE_TITLES[finalType][
    Math.floor(Math.random() * CHALLENGE_TITLES[finalType].length)
  ];
  
  const title = titleTemplate
    .replace('{enemy}', enemyName)
    .replace('{faction}', finalFaction.charAt(0).toUpperCase() + finalFaction.slice(1));
  
  const description = CHALLENGE_DESCRIPTIONS[finalFaction][
    Math.floor(Math.random() * CHALLENGE_DESCRIPTIONS[finalFaction].length)
  ];

  const guxReward = getGuxReward(finalDifficulty, finalComposition);
  const expReward = guxReward * 2;

  // Challenges expire in 4-8 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 4 + Math.floor(Math.random() * 4));

  return {
    id: `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: finalType,
    composition: finalComposition,
    faction: finalFaction,
    difficulty: finalDifficulty,
    title,
    description,
    enemies,
    rewards: {
      gux: guxReward,
      exp: expReward
    },
    expiresAt,
    completed: false
  };
}

export function generateChallengeBoard(count: number = 8): Challenge[] {
  const challenges: Challenge[] = [];
  
  // Ensure variety in the board
  const compositions: Composition[] = ['3v2', '3v3', '3v4', '3v1-miniboss', '3v1-boss'];
  const factions: Faction[] = ['crusade', 'fabled', 'legion', 'worge', 'demon'];
  
  for (let i = 0; i < count; i++) {
    const composition = compositions[i % compositions.length];
    const faction = factions[i % factions.length];
    const difficulty = (Math.floor(i / 2) % 5 + 1) as Difficulty;
    
    challenges.push(generateChallenge(undefined, composition, faction, difficulty));
  }
  
  // Shuffle for variety
  return challenges.sort(() => Math.random() - 0.5);
}

export function refreshExpiredChallenges(challenges: Challenge[]): Challenge[] {
  const now = new Date();
  return challenges.map(challenge => {
    if (challenge.expiresAt < now || challenge.completed) {
      return generateChallenge();
    }
    return challenge;
  });
}
