# AVOLVE

## About
Avolve is an evolution simulation where colorful organisms interact, compete, and evolve in a physics-based environment. Each color represents different behaviors and abilities, creating complex ecosystem dynamics.

## Setup
1. Run `npm start` to build the project
2. Open `index.html` in your browser
3. Use WASD keys to move the camera around the simulation
4. Watch the organisms interact and evolve!

## Color Guide

### 🟢 **GREEN** - The Producers
- **Ability**: Photosynthesis - converts CO2 to energy
- **Behavior**: Passive, essential for ecosystem energy
- **Interactions**: Gets eaten by many predator colors
- **Role**: Primary producers, foundation of the food chain

### 🔵 **BLUE** - The Terrorizers  
- **Ability**: Causes fear - makes other organisms flee on contact
- **Behavior**: Aggressive crowd control through intimidation
- **Interactions**: Makes ALL other organisms flee when touched (no direct damage)
- **Role**: Population control through fear and dispersal

### 🔴 **RED** - The Predators
- **Ability**: Absorbs energy from contacted organisms
- **Behavior**: Direct energy vampirism
- **Interactions**: Hunts MAROON, ORANGE, PINK, INDIGO, OCHRE
- **Role**: Top predator, maintains population balance

### 🟡 **YELLOW** - The Reproducers
- **Ability**: Enhances reproduction - increases brood size and reduces reproduction threshold  
- **Behavior**: Focused on rapid population growth
- **Interactions**: Generally peaceful, avoids conflicts
- **Role**: Population expansion specialist

### 🟠 **ORANGE** - The Scavengers
- **Ability**: Absorbs energy from various organisms
- **Behavior**: Opportunistic feeding
- **Interactions**: Eats BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, SKY, WHITE
- **Role**: Cleanup crew and generalist predator

### 🔵 **CYAN** - The Movers
- **Ability**: Fast movement - high mobility body parts
- **Behavior**: Quick, evasive organisms
- **Interactions**: Peaceful, focuses on mobility over combat
- **Role**: Swift survivors, genetic diversity carriers

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

### 🟤 **MAROON** - The Specialists
- **Ability**: Absorbs energy from dead and plant matter
- **Behavior**: Scavenges dead organisms and plants
- **Interactions**: Feeds on DEAD, GREEN, BARK, DEAD_BARK
- **Role**: Decomposer and plant specialist

### 🌊 **TEAL** - The Escapists
- **Ability**: Flees from all contact
- **Behavior**: Ultimate survival through avoidance
- **Interactions**: Runs away from everything
- **Role**: Pure survivor, maintains genetic diversity

### 🌲 **BARK** - The Defenders
- **Ability**: Hardens into protective shell when attacked
- **Behavior**: Defensive transformation under threat
- **Interactions**: Becomes DEAD_BARK when contacted by MAROON or MAHOGANY
- **Role**: Defensive specialist, creates barriers

### 🌫️ **DEAD_BARK** - The Remnants
- **Ability**: Inert protective material
- **Behavior**: Static defensive structures
- **Interactions**: No active behaviors
- **Role**: Environmental obstacles and protection

### 🌤️ **SKY** - The Controllers
- **Ability**: Attraction/movement manipulation
- **Behavior**: Influences organism movement patterns
- **Interactions**: Affects most other colors' movement
- **Role**: Environmental force, behavior modifier

### 🔮 **INDIGO** - The Efficient Hunters
- **Ability**: Moderate energy absorption with high efficiency
- **Behavior**: Calculated predation
- **Interactions**: Absorbs 20% energy from BLUE, YELLOW, CYAN, DEAD, TEAL, GREEN, SKY, WHITE
- **Role**: Efficient mid-tier predator

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

### 🟣 **VIOLET** - The Healers *(New!)*
- **Ability**: Energy redistribution and healing
- **Behavior**: Transfers energy to low-health organisms, cooperates with other VIOLET
- **Interactions**: Heals organisms below 70% reproduction threshold, shares energy with other VIOLET
- **Role**: Ecosystem stabilizer, prevents population crashes, enables cooperation

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



