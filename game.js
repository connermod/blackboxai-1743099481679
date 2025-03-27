// Dragon Taming Game State
let dragonAffinity = 0;
let bondStrength = 1;
let dragonStage = 'egg'; // egg -> hatchling -> juvenile -> adult -> elder
let dragonType = getRandomDragonType();
let dragonStats = {
    health: 100,
    hunger: 0,
    happiness: 50,
    energy: 100
};

// Dragon types with different traits
const dragonTypes = {
    fire: { 
        emoji: '🔥', 
        trait: 'Bonding gives +2 affinity',
        color: 'text-red-600'
    },
    ice: {
        emoji: '❄️',
        trait: 'Hunger decays slower',
        color: 'text-blue-400'
    },
    forest: {
        emoji: '🌿',
        trait: 'Happiness decays slower',
        color: 'text-green-600'
    }
};

let medievalUpgrades = [
    { 
        id: 1, 
        name: "Dragon Stable", 
        cost: 50, 
        effect: "Reduces hunger decay by 2", 
        owned: 0,
        icon: '🏰'
    },
    { 
        id: 2, 
        name: "Royal Trainer", 
        cost: 200, 
        effect: "Boosts bond strength by 50%", 
        owned: 0,
        icon: '👑'
    },
    { 
        id: 3, 
        name: "Wizard Tower", 
        cost: 1000, 
        effect: "Unlocks magic training", 
        owned: 0,
        icon: '🧙'
    },
    { 
        id: 4, 
        name: "Feeding Trough", 
        cost: 300, 
        effect: "Unlocks feeding mechanic", 
        owned: 0,
        icon: '🍗'
    },
    { 
        id: 5, 
        name: "Dragon Armory", 
        cost: 800, 
        effect: "Unlocks dragon equipment", 
        owned: 0,
        icon: '🛡️'
    }
];

// DOM elements
let affinityDisplayEl, bondButtonEl, upgradesContainerEl, dragonDisplayEl;

// Initialize game
function initGame() {
    // Get DOM elements
    affinityDisplayEl = document.getElementById('clickCount');
    bondButtonEl = document.getElementById('clickButton');
    feedButtonEl = document.getElementById('feedButton');
    upgradesContainerEl = document.getElementById('upgradesContainer');
    dragonDisplayEl = document.getElementById('dragonDisplay');
    
    // Create dragon display if it doesn't exist
    if (!dragonDisplayEl) {
        dragonDisplayEl = document.createElement('div');
        dragonDisplayEl.id = 'dragonDisplay';
        document.querySelector('.game-container').appendChild(dragonDisplayEl);
    }

    // Initialize game state
    loadGame();
    renderUpgrades();
    updateDisplay();
    setInterval(dragonNeeds, 3000); // Update dragon needs every 3 seconds

    // Set up feed button if feeding trough is owned
    const feedingTrough = medievalUpgrades.find(u => u.id === 4);
    if (feedingTrough.owned > 0) {
        feedButtonEl.style.display = 'block';
        feedButtonEl.addEventListener('click', handleFeed);
    } else {
        feedButtonEl.style.display = 'none';
    }
}

// Get random dragon type
function getRandomDragonType() {
    const types = Object.keys(dragonTypes);
    return types[Math.floor(Math.random() * types.length)];
}

// Handle bonding action
function handleBond() {
    let affinityGain = bondStrength;
    
    // Apply dragon type bonuses
    if (dragonType === 'fire') affinityGain += 1;
    
    dragonAffinity += affinityGain;
    dragonStats.happiness = Math.min(100, dragonStats.happiness + 5);
    dragonStats.energy = Math.max(0, dragonStats.energy - 10);
    
    updateDisplay();
    animateBond();
    checkEvolution();
    saveGame();
    
    // Show floating text effect
    showFloatingText(`+${affinityGain} Affinity`, dragonDisplayEl);
}

// Handle feeding action
function handleFeed() {
    if (dragonStats.hunger > 0) {
        dragonStats.hunger = Math.max(0, dragonStats.hunger - 30);
        dragonStats.health = Math.min(100, dragonStats.health + 5);
        dragonStats.energy = Math.min(100, dragonStats.energy + 20);
        
        updateDisplay();
        animateFeed();
        saveGame();
        
        // Show floating text effect
        showFloatingText('Nom nom!', dragonDisplayEl);
    }
}

// Show floating text animation
function showFloatingText(text, parentEl) {
    const floatText = document.createElement('div');
    floatText.className = 'floating-text animate-float opacity-0';
    floatText.textContent = text;
    parentEl.appendChild(floatText);
    
    setTimeout(() => {
        floatText.remove();
    }, 1000);
}

// Dragon needs system
function dragonNeeds() {
    dragonStats.hunger = Math.min(100, dragonStats.hunger + 5);
    dragonStats.happiness = Math.max(0, dragonStats.happiness - 2);
    
    // Apply upgrade effects
    medievalUpgrades.forEach(upgrade => {
        if (upgrade.owned > 0) {
            if (upgrade.id === 1) dragonStats.hunger = Math.max(0, dragonStats.hunger - 2);
            if (upgrade.id === 2) bondStrength = 1 + (upgrade.owned * 0.5);
        }
    });
    
    updateDisplay();
    saveGame();
}

// Buy medieval upgrade
function buyUpgrade(id) {
    const upgrade = medievalUpgrades.find(u => u.id === id);
    if (dragonAffinity >= upgrade.cost) {
        dragonAffinity -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        updateDisplay();
        renderUpgrades();
        saveGame();
    }
}

// Check dragon evolution
function checkEvolution() {
    if (dragonStage === 'egg' && dragonAffinity >= 50) {
        dragonStage = 'hatchling';
        updateDragonDisplay();
    } else if (dragonStage === 'hatchling' && dragonAffinity >= 200) {
        dragonStage = 'juvenile';
        updateDragonDisplay();
    } else if (dragonStage === 'juvenile' && dragonAffinity >= 1000) {
        dragonStage = 'adult';
        updateDragonDisplay();
    } else if (dragonStage === 'adult' && dragonAffinity >= 5000) {
        dragonStage = 'elder';
        updateDragonDisplay();
    }
}

// Update dragon display with type and stage
function updateDragonDisplay() {
    let emoji = '';
    const type = dragonTypes[dragonType];
    
    switch(dragonStage) {
        case 'egg':
            emoji = '🥚';
            break;
        case 'hatchling':
            emoji = '🐲';
            break;
        case 'juvenile':
            emoji = '🐉';
            break;
        case 'adult':
            emoji = type.emoji + '🐲' + type.emoji;
            break;
        case 'elder':
            emoji = '🐉✨';
            break;
    }
    
    dragonDisplayEl.innerHTML = `
        <div class="text-6xl mb-2 ${type.color}">${emoji}</div>
        <p class="text-sm ${type.color}">${dragonType} dragon</p>
    `;
}

// Render medieval upgrades
function renderUpgrades() {
    upgradesContainerEl.innerHTML = '';
    medievalUpgrades.forEach(upgrade => {
        const upgradeEl = document.createElement('div');
        upgradeEl.className = 'bg-amber-100 p-4 rounded-lg border-2 border-amber-800 shadow-md';
        upgradeEl.innerHTML = `
            <div class="flex items-start">
                <div class="text-2xl mr-3">${upgrade.icon}</div>
                <div>
                    <h3 class="font-semibold text-amber-900 text-lg">${upgrade.name}</h3>
                    <p class="text-amber-800">Cost: ${upgrade.cost} affinity</p>
                    <p class="text-amber-800">Effect: ${upgrade.effect}</p>
                    <p class="text-amber-800">Owned: ${upgrade.owned}</p>
                    <button onclick="buyUpgrade(${upgrade.id})" 
                            class="mt-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 border border-amber-900 ${dragonAffinity < upgrade.cost ? 'opacity-50 cursor-not-allowed' : ''}">
                        <i class="fas fa-hammer mr-2"></i>Construct
                    </button>
                </div>
            </div>
        `;
        upgradesContainerEl.appendChild(upgradeEl);
    });
}

// Update display with dragon stats
function updateDisplay() {
    affinityDisplayEl.textContent = dragonAffinity.toLocaleString();
    
    // Update dragon status display
    let statsDisplay = document.getElementById('dragonStats');
    if (!statsDisplay) {
        statsDisplay = document.createElement('div');
        statsDisplay.id = 'dragonStats';
        statsDisplay.className = 'mt-4 text-center bg-amber-50 p-3 rounded-lg border border-amber-200';
        dragonDisplayEl.appendChild(statsDisplay);
    }
    
    // Create status bars
    const healthBar = createStatusBar(dragonStats.health, 'bg-red-500');
    const hungerBar = createStatusBar(dragonStats.hunger, 'bg-yellow-600');
    const happinessBar = createStatusBar(dragonStats.happiness, 'bg-green-500');
    const energyBar = createStatusBar(dragonStats.energy, 'bg-blue-500');
    
    statsDisplay.innerHTML = `
        <p class="mb-2 font-semibold">${dragonType} Dragon (${dragonStage})</p>
        <div class="mb-1">
            <p class="text-sm text-left mb-1">Health</p>
            ${healthBar}
        </div>
        <div class="mb-1">
            <p class="text-sm text-left mb-1">Hunger</p>
            ${hungerBar}
        </div>
        <div class="mb-1">
            <p class="text-sm text-left mb-1">Happiness</p>
            ${happinessBar}
        </div>
        <div class="mb-1">
            <p class="text-sm text-left mb-1">Energy</p>
            ${energyBar}
        </div>
    `;
}

// Create status bar HTML
function createStatusBar(value, colorClass) {
    return `
        <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="h-2.5 rounded-full ${colorClass}" style="width: ${value}%"></div>
        </div>
    `;
}

// Bonding animation
function animateBond() {
    bondButtonEl.classList.add('scale-90');
    dragonDisplayEl.classList.add('animate-pulse');
    setTimeout(() => {
        bondButtonEl.classList.remove('scale-90');
        dragonDisplayEl.classList.remove('animate-pulse');
    }, 200);
}

// Feeding animation
function animateFeed() {
    feedButtonEl.classList.add('scale-90');
    dragonDisplayEl.classList.add('animate-bounce');
    
    // Create food particle effect
    const food = document.createElement('div');
    food.className = 'absolute text-xl animate-float';
    food.innerHTML = '🍖';
    food.style.left = `${feedButtonEl.offsetLeft + feedButtonEl.offsetWidth/2}px`;
    food.style.top = `${feedButtonEl.offsetTop}px`;
    document.body.appendChild(food);
    
    setTimeout(() => {
        feedButtonEl.classList.remove('scale-90');
        dragonDisplayEl.classList.remove('animate-bounce');
        food.remove();
    }, 500);
}

// Save game
function saveGame() {
    const gameState = {
        dragonAffinity,
        bondStrength,
        dragonStage,
        dragonStats,
        medievalUpgrades
    };
    localStorage.setItem('dragonTamer', JSON.stringify(gameState));
}

// Load game
function loadGame() {
    const savedGame = localStorage.getItem('dragonTamer');
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        dragonAffinity = gameState.dragonAffinity || 0;
        bondStrength = gameState.bondStrength || 1;
        dragonStage = gameState.dragonStage || 'egg';
        dragonStats = gameState.dragonStats || {
            health: 100,
            hunger: 0,
            happiness: 50
        };
        medievalUpgrades = gameState.medievalUpgrades || medievalUpgrades;
        
        // Set appropriate dragon display based on stage
        if (dragonStage === 'hatchling') {
            dragonDisplayEl.innerHTML = '<div class="text-6xl mb-4">🐲</div>';
        } else if (dragonStage === 'juvenile') {
            dragonDisplayEl.innerHTML = '<div class="text-6xl mb-4">🐉</div>';
        } else if (dragonStage === 'adult') {
            dragonDisplayEl.innerHTML = '<div class="text-6xl mb-4">🔥🐲🔥</div>';
        }
    }
}

// Initialize game and set up event listeners
function startGame() {
    initGame();
    
    // Set up event listeners after initialization
    if (bondButtonEl) {
        bondButtonEl.addEventListener('click', handleBond);
    } else {
        console.error('Could not find bond button element');
    }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
} else {
    startGame();
}

// Add animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    .animate-bounce {
        animation: bounce 0.5s ease;
    }
`;
document.head.appendChild(style);
