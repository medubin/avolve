# AVOLVE

## About
Avolve is an evolution simulation where colorful organisms interact, compete, and evolve in a physics-based environment. Each color represents different behaviors and abilities, creating complex ecosystem dynamics.

## Setup
1. Run `npm start` to build the project
2. Open `index.html` in your browser
3. Use WASD keys to move the camera around the simulation
4. Watch the organisms interact and evolve!

## Color Guide

### Thematic Organization
The organism colors follow three primary themes with specialized variants:

**🔵 Blue Spectrum - Movement Domain**
- Self-locomotion, movement avoidance, and controlling others' movement

**🟢 Green Spectrum - Energy Production** 
- Photosynthesis and energy generation from the environment

**🔴 Red/Orange Spectrum - Predation**
- Energy absorption and consumption from other organisms

**⚪ Special Mechanics**
- Unique abilities that transcend the core themes

## Blue Spectrum - Movement Domain

### 🔵 **BLUE** - The Terrorizers  
- **Ability**: Causes fear - makes other organisms flee on contact
- **Behavior**: Aggressive crowd control through intimidation
- **Interactions**: Makes ALL other organisms flee when touched (no direct damage)
- **Role**: Population control through fear and dispersal

### 🔵 **CYAN** - The Movers
- **Ability**: Fast movement - high mobility body parts (speed 10)
- **Behavior**: Quick, evasive organisms
- **Interactions**: Peaceful, focuses on mobility over combat
- **Role**: Swift survivors, genetic diversity carriers

### 🔮 **INDIGO** - The Efficient Hunters
- **Ability**: Moderate energy absorption + slow movement (speed 3)
- **Behavior**: Calculated predation with tactical mobility
- **Interactions**: Absorbs 20% energy from BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, SKY, WHITE
- **Role**: Mobile mid-tier predator

### 🌤️ **SKY** - The Timid Touchers
- **Ability**: Slow retreat - gently flees from any contact (speed 2)
- **Behavior**: Contacts all organisms but immediately retreats
- **Interactions**: Touches ALL organism types then slowly flees away
- **Role**: Gentle interaction catalyst, spreads contact effects while avoiding danger

### 🌊 **TEAL** - The Escapists
- **Ability**: Flees from all contact
- **Behavior**: Ultimate survival through avoidance
- **Interactions**: Runs away from everything
- **Role**: Pure survivor, maintains genetic diversity

### 🩵 **TURQUOISE** - The Magnetic Controllers *(New!)*
- **Ability**: Magnetic attraction field - controls others' movement
- **Behavior**: Creates gravitational-like attraction within radius, enhanced orbital mechanics on contact
- **Interactions**: Attracts all living organisms within 60 pixel radius, orbital force on contact, energy sharing with other TURQUOISE
- **Role**: Environmental manipulator, creates organism clusters, ecosystem coordinator

## Green Spectrum - Energy Production

### 🟢 **GREEN** - The Producers
- **Ability**: Photosynthesis - converts CO2 to energy
- **Behavior**: Passive, essential for ecosystem energy
- **Interactions**: Gets eaten by many predator colors
- **Role**: Primary producers, foundation of the food chain

### 🌲 **BARK** - The Defensive Producers
- **Ability**: Photosynthesis (0.8x efficiency) + hardens into protective shell when attacked
- **Behavior**: Defensive transformation under threat
- **Interactions**: Becomes DEAD_BARK when contacted by MAROON or MAHOGANY
- **Role**: Defensive specialist with energy production

### 🌫️ **DEAD_BARK** - The Remnants
- **Ability**: Inert protective material
- **Behavior**: Static defensive structures
- **Interactions**: No active behaviors
- **Role**: Environmental obstacles and protection

## Red/Orange Spectrum - Predation

### 🔴 **RED** - The Apex Predators
- **Ability**: Top-tier energy absorption from all other predators
- **Behavior**: Hunts and dominates the predator hierarchy
- **Interactions**: Feeds on ORANGE, MAROON, PINK, MAHOGANY, OCHRE, BURGUNDY (90% efficiency)
- **Role**: Apex predator - controls predator populations, cannot feed on itself

### 🟠 **ORANGE** - The Utility Hunters
- **Ability**: Specializes in hunting utility and movement organisms
- **Behavior**: Targets mobile and special-function organisms
- **Interactions**: Hunts BLUE, CYAN, TEAL, SKY, INDIGO, TURQUOISE, YELLOW, WHITE, and DEAD (90% efficiency)
- **Role**: Utility specialist - prevents movement/special genes from dominating

### 🟤 **MAROON** - The Plant Specialists
- **Ability**: Efficient consumption of all plant matter
- **Behavior**: Pure herbivore - feeds only on photosynthetic organisms
- **Interactions**: Feeds on GREEN, BARK, DEAD_BARK, and DEAD (90% efficiency)
- **Role**: Plant population control, decomposer of plant material

### 🌸 **PINK** - The Ultimate Generalist Feeders
- **Ability**: Extremely broad feeding strategy with reduced efficiency
- **Behavior**: Feeds on almost everything except other predators and STEEL
- **Interactions**: Eats GREEN, BARK, YELLOW, WHITE, VIOLET, BLUE, CYAN, TEAL, SKY, INDIGO, TURQUOISE, GRAY, DEAD, DEAD_BARK (70% efficiency)
- **Role**: Ultimate generalist - can feed on nearly all organism types but at reduced efficiency

### 🍫 **MAHOGANY** - The Living Plant Specialists
- **Ability**: Highly efficient feeding on living plants only
- **Behavior**: Targets healthy plant matter, avoids dead material
- **Interactions**: Feeds only on GREEN, BARK (100% efficiency)
- **Role**: Efficient herbivore - pressure on healthy plant populations

### 🟤 **OCHRE** - The Scavenger Specialists
- **Ability**: Highly efficient decomposer of dead material
- **Behavior**: Pure scavenger - feeds only on dead organisms
- **Interactions**: Feeds only on DEAD, DEAD_BARK (100% efficiency)
- **Role**: Ecosystem recycler - cleans up dead material efficiently

### 🍷 **BURGUNDY** - The Universal Parasite
- **Ability**: Parasitic feeding on all organisms with improved efficiency
- **Behavior**: Attaches and steadily drains energy from any target
- **Interactions**: Feeds on everything except STEEL and DEAD types (60% efficiency, 15% absorption rate)
- **Role**: Universal parasite - creates sticking behavior and significant energy drain

## Special Mechanics

### 🟡 **YELLOW** - The Reproducers
- **Ability**: Enhances reproduction - increases brood size and reduces reproduction threshold  
- **Behavior**: Focused on rapid population growth
- **Interactions**: Generally peaceful, avoids conflicts
- **Role**: Population expansion specialist

### ⚪ **WHITE** - The Parasites
- **Ability**: Infection - spreads genetic material to other organisms
- **Behavior**: Biological warfare through gene transmission
- **Interactions**: Infects GREEN, RED, MAROON, ORANGE, BARK
- **Role**: Horizontal gene transfer, evolutionary catalyst

### ⚫ **GRAY** - The Killers
- **Ability**: Instant death - kills organisms on contact
- **Behavior**: Ultimate predator with lethal touch
- **Interactions**: Destroys GREEN, RED, CYAN, YELLOW, MAROON, ORANGE, TEAL, BARK, SKY, INDIGO, WHITE
- **Role**: Population limiter, ecosystem reset mechanism

### 🟣 **VIOLET** - The Healers *(New!)*
- **Ability**: Energy redistribution and healing
- **Behavior**: Transfers energy to low-health organisms, cooperates with other VIOLET
- **Interactions**: Heals organisms below 70% reproduction threshold, shares energy with other VIOLET
- **Role**: Ecosystem stabilizer, prevents population crashes, enables cooperation

### 🔘 **STEEL** - The Living Shields *(New!)*
- **Ability**: Complete immunity to all attacks and effects
- **Behavior**: Pure defensive survival, no offensive capabilities
- **Interactions**: Immune to ALL other colors' abilities (including GRAY's instant death)
- **Role**: Ultimate survivor, genetic preservation, evolutionary insurance

## Ecosystem Dynamics
- **Energy Flow**: GREEN produces → Others consume → VIOLET redistributes
- **Population Control**: GRAY and BLUE control overpopulation
- **Genetic Diversity**: WHITE spreads genes, TEAL preserves rare traits
- **Cooperation**: VIOLET creates the first truly cooperative behavior
- **Balance**: Each color has predators and prey, creating stable cycles

## Evolution Mechanics
- Organisms reproduce when they accumulate enough energy
- Genetic mutations can change color ratios in offspring
- Natural selection favors successful color combinations
- Environmental pressures drive evolutionary adaptations

### BUGS
- O2 can become negative if there are no photosynthesizers



