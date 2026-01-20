# Character Reference Guide - Grudge 2D Heroes

## Character Archetypes & Gameplay Roles

This reference provides tactical information for each character type available in the Grudge 2D Heroes sprite system.

---

## 🛡️ MELEE WARRIORS

### Knight (`knight`)
**Role**: Tank / Defender  
**Weapon**: Sword & Shield  
**Armor**: Heavy Plate  

**Animations**: 8 total
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (7f) - Quick sword slash
- Attack 2 (10f) - Powerful overhead strike
- Attack 3 (11f) - Shield bash combo
- Block (4f) - Defensive stance
- Hurt (4f)
- Death (4f)

**Gameplay Notes**:
- High defense, moderate attack
- Block ability reduces incoming damage
- Best for front-line defense
- Effective against melee attackers

---

### Knight Templar (`knight-templar`)
**Role**: Holy Warrior / DPS  
**Weapon**: Dual Wielding / Holy Blade  
**Armor**: Heavy Plate  

**Animations**: 9 total
- Idle (6f, loop)
- Walk 1 (8f, loop) - Standard march
- Walk 2 (8f, loop) - Combat ready
- Attack 1 (7f) - Quick strike
- Attack 2 (8f) - Cross slash
- Attack 3 (11f) - Holy smite
- Block (4f)
- Hurt (4f)
- Death (4f)

**Gameplay Notes**:
- Balanced offense and defense
- Holy attacks deal bonus damage to undead
- Two walk cycles for tactical flexibility
- Strong against Legion faction

---

### Soldier (`soldier`)
**Role**: Infantry / Versatile Fighter  
**Weapon**: Sword & Shield  
**Armor**: Medium Plate  

**Animations**: 8 total
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (8f) - Standard slash
- Attack 2 (9f) - Thrust attack
- Attack 3 (10f) - Whirlwind
- Block (4f)
- Hurt (4f)
- Death (4f)

**Gameplay Notes**:
- Reliable all-rounder
- Moderate stats in all areas
- Good for flexible formations
- Cost-effective unit

---

### Swordsman (`swordsman`)
**Role**: Agile DPS / Duelist  
**Weapon**: Single Sword  
**Armor**: Light/Medium  

**Animations**: 7 total
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (7f) - Fast slice
- Attack 2 (15f) - Multi-hit combo (longest attack!)
- Attack 3 (12f) - Spinning slash
- Hurt (5f)
- Death (4f)

**Gameplay Notes**:
- High attack speed, lower defense
- Attack 2 is devastating but vulnerable
- Excellent for flanking maneuvers
- Requires tactical positioning

---

### Lancer (`lancer`)
**Role**: Polearm Specialist / Area Control  
**Weapon**: Lance/Spear  
**Armor**: Medium Plate  

**Animations**: 8 total
- Idle (6f, loop)
- Walk 1 (8f, loop)
- Walk 2 (8f, loop)
- Attack 1 (6f) - Quick thrust
- Attack 2 (9f) - Sweep attack
- Attack 3 (8f) - Charge strike
- Hurt (4f)
- Death (4f)

**Gameplay Notes**:
- Extended attack range (2 tiles)
- Effective against cavalry/mounted units
- Control positioning with reach
- Vulnerable to close-range fighters

---

### Armored Axeman (`armored-axeman`)
**Role**: Heavy DPS / Destroyer  
**Weapon**: Battle Axe  
**Armor**: Heavy Plate  

**Animations**: 7 total
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (9f) - Overhead chop
- Attack 2 (9f) - Horizontal cleave
- Attack 3 (12f) - Ground slam AOE
- Hurt (4f)
- Death (4f)

**Gameplay Notes**:
- Highest melee damage
- Attack 3 damages adjacent enemies
- Slow attack speed
- Armor break abilities

---

### Greatsword Skeleton (`greatsword-skeleton`)
**Role**: Undead Elite / Glass Cannon  
**Weapon**: Greatsword  
**Armor**: Heavy (Bone)  

**Animations**: 7 total
- Idle (6f, loop)
- Walk (9f, loop) - Longest walk animation
- Attack 1 (9f) - Wide slash
- Attack 2 (12f) - Jumping strike
- Attack 3 (8f) - Execute
- Hurt (4f)
- Death (4f)

**Gameplay Notes**:
- Legion faction elite
- High damage, low HP
- Immune to poison/bleed
- Weak to holy damage

---

## 🏹 RANGED UNITS

### Archer (`archer`)
**Role**: Standard Ranged DPS  
**Weapon**: Bow  
**Armor**: Leather  

**Animations**: 6 base + 2 effects + 1 projectile
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (9f) - Standard shot
- Attack 2 (12f) - Power shot
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2 effects (9f/12f)
- **Projectile**: Arrow (1f)

**Gameplay Notes**:
- Attack range: 3-5 tiles
- Line of sight required
- Weak in melee combat
- Vulnerable to cavalry charges

---

### Skeleton Archer (`skeleton-archer`)
**Role**: Undead Ranged / Siege Support  
**Weapon**: Bone Bow  
**Armor**: Light (Bones)  

**Animations**: 5 base + 1 effect + 1 projectile
- Idle (6f, loop)
- Walk (8f, loop)
- Attack (9f) - Fire arrow
- Hurt (4f)
- Death (4f)
- **Effect**: Attack effect (9f)
- **Projectile**: Arrow (1f)

**Gameplay Notes**:
- Legion faction archer
- Immune to poison
- Can shoot over allies
- Weak to blunt weapons

---

## 🔮 MAGIC CASTERS

### Wizard (`wizard`)
**Role**: Arcane Mage / Burst Damage  
**Weapon**: Staff  
**Armor**: Cloth Robes  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (6f) - Magic missile
- Attack 2 (6f) - Fireball
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1 (10f), Attack 2 (7f)

**Gameplay Notes**:
- High magic damage
- Low HP and defense
- Area-of-effect spells
- Requires mana management

---

### Priest (`priest`)
**Role**: Healer / Support  
**Weapon**: Holy Staff  
**Armor**: Cloth Robes  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack (9f) - Holy bolt
- **Heal (6f)** - Unique healing ability!
- Hurt (4f)
- Death (4f)
- **Effects**: Attack (5f), Heal (4f)

**Gameplay Notes**:
- Only unit with healing
- Buffs allies
- Weak to physical damage
- Essential for prolonged battles

---

## 👹 MONSTERS & BEASTS

### Orc (`orc`)
**Role**: Basic Melee / Swarm Fighter  
**Weapon**: Axe/Club  
**Armor**: Light Leather  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (6f) - Quick chop
- Attack 2 (6f) - Brutal slam
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2 (6f each)

**Gameplay Notes**:
- Legion faction basic
- High attack, low defense
- Cost-effective grunt
- Effective in groups

---

### Armored Orc (`armored-orc`)
**Role**: Heavy Melee / Bruiser  
**Weapon**: Warhammer  
**Armor**: Heavy Plate  

**Animations**: 8 base + 3 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (7f) - Hammer swing
- Attack 2 (8f) - Overhead crush
- Attack 3 (9f) - War stomp
- **Block (4f)** - Defensive stance
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2/3 (7f/8f/9f)

**Gameplay Notes**:
- Heavily armored variant
- Block ability like knights
- Armor penetration attacks
- Slow but durable

---

### Elite Orc (`elite-orc`)
**Role**: Orc Champion / Elite DPS  
**Weapon**: Enchanted Axe  
**Armor**: Heavy Battle Armor  

**Animations**: 7 base + 3 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (7f) - Cleave
- Attack 2 (11f) - Rage strike (longest orc attack)
- Attack 3 (9f) - Execute
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2/3 (7f/11f/9f)

**Gameplay Notes**:
- Legion faction elite
- High damage and HP
- Rage mechanic (damage increases when low HP)
- Boss-level threat

---

### Werewolf (`werewolf`)
**Role**: Beast Form / High Mobility DPS  
**Weapon**: Claws  
**Armor**: None (Fur)  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (9f) - Claw swipe
- Attack 2 (13f) - Pounce attack (longest attack!)
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2 (9f/13f)

**Gameplay Notes**:
- Worge class transformation
- Extra movement speed
- Critical strike bonus
- Weak to silver weapons (if implemented)

---

### Werebear (`werebear`)
**Role**: Tank Beast / Damage Sponge  
**Weapon**: Claws  
**Armor**: Thick Hide  

**Animations**: 7 base + 3 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (9f) - Maul
- Attack 2 (13f) - Bear hug
- Attack 3 (9f) - Ground pound
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2/3 (9f/13f/9f)

**Gameplay Notes**:
- Worge tank variant
- Highest HP pool
- Regeneration ability
- Slow attack speed

---

### Orc Rider (`orc-rider`)
**Role**: Mounted Cavalry / Charge Unit  
**Weapon**: Lance  
**Armor**: Medium  

**Animations**: 8 base + 3 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (8f) - Lance thrust
- Attack 2 (9f) - Mounted strike
- Attack 3 (11f) - Charge attack
- Block (4f)
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2/3 (8f/9f/11f)

**Gameplay Notes**:
- Cavalry unit (counts as 2 units)
- Charge bonus on first attack
- Extra movement range
- Vulnerable to spears/lances

---

## 💀 UNDEAD

### Skeleton (`skeleton`)
**Role**: Undead Infantry / Disposable Fighter  
**Weapon**: Sword  
**Armor**: Bones  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (7f) - Slash
- Attack 2 (8f) - Stab
- Hurt (4f)
- Death (4f) - Collapses into bones
- **Effects**: Attack 1/2 (7f/8f)

**Gameplay Notes**:
- Legion faction basic undead
- Low cost, disposable
- Immune to fear/poison
- Weak to blunt damage

---

### Armored Skeleton (`armored-skeleton`)
**Role**: Heavy Undead / Durable Attacker  
**Weapon**: Greatsword  
**Armor**: Plate Armor  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (8f, loop)
- Attack 1 (8f) - Overhead smash
- Attack 2 (9f) - Spinning slash
- Hurt (4f)
- Death (4f)
- **Effects**: Attack 1/2 (8f/9f)

**Gameplay Notes**:
- Armored variant
- Higher HP and defense
- No pain/morale system
- Boss minion tier

---

## 🧪 SPECIAL

### Slime (`slime`)
**Role**: Monster / Status Inflictor  
**Weapon**: Acidic Body  
**Armor**: Gelatinous  

**Animations**: 6 base + 2 effects
- Idle (6f, loop)
- Walk (6f, loop) - Shortest walk!
- Attack 1 (6f) - Engulf
- Attack 2 (11f) - Acid spray
- Hurt (4f)
- Death (4f) - Dissolves
- **Effects**: Attack 1/2 (6f/11f)

**Gameplay Notes**:
- Neutral monster
- Inflicts poison/slow
- Resistant to physical damage
- Weak to fire/magic

---

## 🎯 TACTICAL GUIDE

### Faction Matchups

**Crusade (Human + Barbarian)**
- Knights, Templars, Soldiers
- Strong vs: Undead (holy damage)
- Weak vs: Magic users
- Best against: Legion faction

**Fabled (Dwarf + Elf)**
- Wizards, Priests, Archers
- Strong vs: Heavily armored
- Weak vs: Fast melee
- Best against: Crusade faction

**Legion (Orc + Undead)**
- Orcs, Skeletons, Beasts
- Strong vs: Swarm tactics
- Weak vs: Holy damage
- Best against: Fabled faction

### Formation Strategies

**Tank Line**:
- Front: Knights, Armored Orcs, Werebears
- Mid: Soldiers, Lancers
- Back: Archers, Mages

**Speed Comp**:
- Swordsmen, Werewolves, Cavalry
- Hit-and-run tactics
- Flank enemy casters

**Siege Formation**:
- Archers/Skeletons (ranged)
- Priests (healing)
- Knights (protect casters)

---

## 📊 Animation Statistics

### Longest Animations
1. Swordsman Attack 2: **15 frames**
2. Werebear/Werewolf Attack 2: **13 frames**
3. Greatsword Skeleton Attack 2, Armored Axeman Attack 3: **12 frames**

### Most Versatile (Most Attack Types)
1. Knight, Knight Templar, Soldier, Armored Orc: **3 attacks + Block**
2. Swordsman, Elite Orc, Werebear: **3 attacks**

### Special Abilities
- **Only Healer**: Priest (Heal animation)
- **Only Dual Walk**: Knight Templar, Lancer
- **Projectile Users**: Archer, Skeleton Archer
- **Block Users**: Knight, Knight Templar, Soldier, Armored Orc, Orc Rider

---

## 🔧 Technical Notes

### Frame Rates (Standard)
- **Idle/Walk**: 8 FPS (looping)
- **Attacks**: 10-12 FPS (one-shot)
- **Hurt/Death**: 10 FPS (one-shot)
- **Effects**: Match parent animation FPS

### Sprite Dimensions
- **Standard**: 100x100px per frame
- **Format**: PNG with transparency
- **Layout**: Horizontal strip (single row)

### Performance Tips
- Use object pooling for frequently spawned units (skeletons, orcs, slimes)
- Preload textures for all characters in player's roster
- Render effects on separate GPU layer
- Cull off-screen animations

---

**Version**: 1.0.0  
**Last Updated**: January 2026
