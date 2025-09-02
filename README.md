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

### 🔴 **RED** - The Predators
- **Ability**: Absorbs energy from contacted organisms
- **Behavior**: Direct energy vampirism
- **Interactions**: Hunts MAROON, ORANGE, PINK, INDIGO, OCHRE
- **Role**: Top predator, maintains population balance

### 🟠 **ORANGE** - The Scavengers
- **Ability**: Absorbs energy from various organisms
- **Behavior**: Opportunistic feeding
- **Interactions**: Eats BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, SKY, WHITE
- **Role**: Cleanup crew and generalist predator

### 🟤 **MAROON** - The Specialists
- **Ability**: Absorbs energy from dead and plant matter
- **Behavior**: Scavenges dead organisms and plants
- **Interactions**: Feeds on DEAD, GREEN, BARK, DEAD_BARK
- **Role**: Decomposer and plant specialist

### 🌸 **PINK** - The Cleaners
- **Ability**: Specializes in consuming dead matter and specific targets
- **Behavior**: Cleanup and targeted predation
- **Interactions**: Eats DEAD, WHITE, GREEN
- **Role**: Ecosystem cleaner and parasite controller

### 🍫 **MAHOGANY** - The Bark Specialists  
- **Ability**: Efficient consumption of wood-like materials
- **Behavior**: Specialized feeding on defensive organisms
- **Interactions**: 20% energy absorption from DEAD, GREEN, BARK, DEAD_BARK
- **Role**: Defensive structure breaker

### 🟤 **OCHRE** - The Generalists
- **Ability**: Broad-spectrum energy absorption
- **Behavior**: Adaptable feeding strategy
- **Interactions**: 20% absorption from DEAD, GREEN, BLUE, CYAN, YELLOW, TEAL, BARK, DEAD_BARK, SKY, INDIGO, WHITE
- **Role**: Adaptable survivor, ecosystem stabilizer

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



