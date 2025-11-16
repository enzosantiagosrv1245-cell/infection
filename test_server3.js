const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const Matter = require('matter-js');
const fs = require('fs-extra');
const crypto = require('crypto');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const commands = require('./commands');

const MAX_MESSAGE = 1000;
let chatMessages = [];

let a = "abc"

// --- Estado do jogo ---
let gameState = {
    players: {},
    objects: [],
    timeLeft: 120,
    startTime: 60,
    gamePhase: 'waiting'
};

// --- Dados persistentes ---
const USERS_FILE = path.join(__dirname, "users.json");
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const LINKS_FILE = path.join(__dirname, "links.json");

let users = fs.existsSync(USERS_FILE) ? fs.readJsonSync(USERS_FILE) : {};
let messages = fs.existsSync(MESSAGES_FILE) ? fs.readJsonSync(MESSAGES_FILE) : {};
let links = fs.existsSync(LINKS_FILE) ? fs.readJsonSync(LINKS_FILE) : [];

// --- Segurança: hash de senhas ---
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = crypto.scryptSync(password, salt, 64);
    return { salt, hash: derived.toString('hex') };
}

function verifyPassword(userObj, password) {
    if (!userObj) return false;
    // compat com campo antigo 'password' (texto puro)
    if (userObj.password) return userObj.password === password;
    if (userObj.passwordHash && userObj.salt) {
        const derived = crypto.scryptSync(password, userObj.salt, 64).toString('hex');
        return derived === userObj.passwordHash;
    }
    return false;
}

// Migra usuários com senha em texto para hash (segurança e "codificação")
function migrateUsersToHashed() {
    let changed = false;
    for (const name in users) {
        const u = users[name];
        if (u && u.password && !u.passwordHash) {
            const { salt, hash } = hashPassword(u.password);
            u.salt = salt;
            u.passwordHash = hash;
            delete u.password; // remove plaintext
            changed = true;
        }
    }
    if (changed) saveUsers();
}

migrateUsersToHashed();

function saveUsers() {
    fs.writeJsonSync(USERS_FILE, users, { spaces: 2 });
}

// --- Middlewares ---
app.use(express.static(__dirname));
app.use(express.json());

// --- Socket.io ---
const sockets = {};

// Nota: A lógica de conexão principal é definida mais abaixo (única handler).
// Aqui apenas inicializamos o mapa de sockets para uso nas rotas de amizade/login.

const PORT = process.env.PORT || 3000;


if (fs.existsSync(USERS_FILE)) users = fs.readJsonSync(USERS_FILE);
if (fs.existsSync(MESSAGES_FILE)) messages = fs.readJsonSync(MESSAGES_FILE);
if (fs.existsSync(LINKS_FILE)) links = fs.readJsonSync(LINKS_FILE);

function saveUsers() {
    fs.writeJsonSync(USERS_FILE, users, {
        spaces: 2
    });
}

function saveMessages() {
    fs.writeJsonSync(MESSAGES_FILE, messages, {
        spaces: 2
    });
    // Casa 1
    if (s === gameState.house) {
        const originalHouseWalls = [
            { x: s.x, y: s.y, width: s.width, height: wt },
            { x: s.x, y: s.y + s.height - wt - 200, width: s.width - 1300, height: wt },
            { x: s.x, y: s.y, width: wt, height: 820 },
            { x: s.x, y: s.y + 1020, width: wt, height: s.height - 1220 },
            { x: s.x + s.width - wt, y: s.y, width: wt, height: 250 },
            { x: s.x + s.width - wt, y: s.y + 650, width: wt, height: (s.height - 770) - 650 },
            { x: s.x + 900, y: s.y, width: wt, height: 470 },
            { x: s.x + 600, y: s.y + 1020, width: wt, height: 450 },
            { x: s.x + 1500, y: s.y, width: wt, height: 300 },
            { x: s.x + 1338, y: s.y + 1030, width: wt, height: 440 },
            { x: s.x + 2200, y: s.y, width: wt, height: 470 },
            { x: s.x + 2195, y: s.y + 750, width: wt, height: 150 },
            { x: s.x, y: s.y + 400, width: 700, height: wt },
            { x: s.x + 1800, y: s.y + 400, width: 270, height: wt },
            { x: s.x + 250, y: s.y + 1020, width: 850, height: wt },
            { x: s.x + 1150, y: s.y + 400, width: 720, height: wt },
            { x: s.x + 1800, y: s.y, width: wt, height: 400 + wt },
            { x: s.x, y: s.y + 750, width: 550, height: wt },
            { x: s.x + 1330, y: s.y + 830, width: 533, height: wt },
            { x: s.x + 2000, y: s.y + 830, width: 697, height: wt },
            { x: s.x + 480, y: s.y + 620, width: wt, height: 200 }
        ];
        s.walls.push(...originalHouseWalls);

        // mirrored (bottom) house walls
        const mirroredHouseWalls = [
            { x: s.x, y: WORLD_HEIGHT - s.y - wt, width: s.width, height: wt },
            { x: s.x, y: WORLD_HEIGHT - (s.y + s.height - wt - 200) - wt, width: s.width - 1300, height: wt },
            { x: s.x, y: WORLD_HEIGHT - s.y - 820, width: wt, height: 820 },
            { x: s.x, y: WORLD_HEIGHT - (s.y + 1020) - (s.height - 1220), width: wt, height: s.height - 1220 },
            { x: s.x + s.width - wt, y: WORLD_HEIGHT - s.y - 250, width: wt, height: 250 },
            { x: s.x + s.width - wt, y: WORLD_HEIGHT - (s.y + 650) - ((s.height - 770) - 650), width: wt, height: (s.height - 770) - 650 },
            { x: s.x + 900, y: WORLD_HEIGHT - s.y - 470, width: wt, height: 470 },
            { x: s.x + 1500, y: WORLD_HEIGHT - s.y - 300, width: wt, height: 300 },
            { x: s.x + 1338, y: WORLD_HEIGHT - (s.y + 1030) - 440, width: wt, height: 440 },
            { x: s.x + 2200, y: WORLD_HEIGHT - s.y - 470, width: wt, height: 470 },
            { x: s.x + 2195, y: WORLD_HEIGHT - (s.y + 750) - 150, width: wt, height: 150 },
            { x: s.x, y: WORLD_HEIGHT - (s.y + 400) - wt, width: 700, height: wt },
            { x: s.x + 1800, y: WORLD_HEIGHT - (s.y + 400) - wt, width: 270, height: wt },
            { x: s.x + 250, y: WORLD_HEIGHT - (s.y + 1020) - wt, width: 850, height: wt },
            { x: s.x + 1150, y: WORLD_HEIGHT - (s.y + 400) - wt, width: 300, height: wt },
            { x: s.x + 1570, y: WORLD_HEIGHT - (s.y + 400) - wt, width: 300, height: wt },
            { x: s.x + 1800, y: WORLD_HEIGHT - s.y - (400 + wt), width: wt, height: 400 + wt },
            { x: s.x, y: WORLD_HEIGHT - (s.y + 750) - wt, width: 550, height: wt },
            { x: s.x + 1330, y: WORLD_HEIGHT - (s.y + 830) - wt, width: 533, height: wt },
            { x: s.x + 2000, y: WORLD_HEIGHT - (s.y + 830) - wt, width: 697, height: wt },
            { x: s.x + 480, y: WORLD_HEIGHT - (s.y + 620) - 200, width: wt, height: 200 }
        ];
        s.walls.push(...mirroredHouseWalls);
    } else if (s === gameState.house2) {
        // house2 (nova casa posicionada acima)
        const wt2 = s.wallThickness;
        const house2Walls = [
            { x: s.x, y: s.y, width: s.width, height: wt2 }, // Topo
            { x: s.x, y: s.y + s.height - wt2, width: s.width, height: wt2 }, // Base
            { x: s.x, y: s.y, width: wt2, height: s.height }, // Esquerda
            { x: s.x + s.width - wt2, y: s.y, width: wt2, height: s.height }, // Direita
            { x: s.x + 400, y: s.y + 200, width: wt2, height: s.height - 400 },
            { x: s.x + 1200, y: s.y + 100, width: wt2, height: s.height - 200 },
            { x: s.x + 800, y: s.y + 600, width: s.width - 1000, height: wt2 }
        ];
        s.walls.push(...house2Walls);
    } else if (s === gameState.garage) {
const PLAYER_ACCELERATION = 1.2;
const PLAYER_FRICTION = 0.90;
const ZOMBIE_SPEED_BOOST = 1.50;
const ZOMBIE_PUSH_MODIFIER = 2;
const ZOMBIE_MIN_SPEED = 3;
const SPRINT_DURATION = 10000;
const SPRINT_COOLDOWN = 30000;
const SPY_DURATION = 15000;
const SPY_COOLDOWN = 30000;
const BUTTERFLY_DURATION = 5000;
const BUTTERFLY_SPEED = 4;
const INVISIBILITY_CLOAK_BREAK_DISTANCE = 250;
const SKATEBOARD_SPEED_BOOST = 7;
const SKATEBOARD_WIDTH = 90;
const SKATEBOARD_HEIGHT = 35;
const DRONE_FOLLOW_FACTOR = 0.05;
const DRONE_MAX_AMMO = 10;
const GRENADE_FUSE_TIME = 1500;
const GRENADE_RADIUS = 200;
const GRENADE_KNOCKBACK_IMPulse = 30;
const LARGE_BALL_SPEED = 12;
const LARGE_BALL_RADIUS = 25;
const CANNON_COOLDOWN = 2000;
const CANNON_FRONT_OFFSET = 100;
const TRAP_DURATION = 1000;
const TRAP_SIZE = 40;
const PORTAL_SIZE = 60;
const PORTAL_COOLDOWN = 1000;
const DROPPED_ITEM_SIZE = 40;
const PICKUP_RADIUS = 60;
const DUCT_TRAVEL_TIME = 1000 / 20;
const ARROW_SPEED = 30;
const ARROW_KNOCKBACK_IMPULSES = 0.4;
const ARROW_LIFESPAN_AFTER_HIT = 3000;
const ARROW_SPAWN_OFFSET = 120;
const MINE_SIZE = 40;
const MINE_EXPLOSION_RADIUS = 100;
const MINE_PRIMARY_KNOCKBACK = 20;
const MINE_SPLASH_KNOCKBACK = 15;
const BOX_PUSH_FORCE = 400;
const ROTATION_ON_COLLISION_FACTOR = 0.000002;
const FORCE_NORMAL_GLOVE_MULTIPLIER = 5;
const LARGE_BALL_OBJECT_KNOCKBACK = 0.5;
const LARGE_BALL_PLAYER_KNOCKBACK = 0.5;
const RHINOCEROS_FORCE = 1.5;
const RHINOCEROS_RADIUS = 150;
const RHINOCEROS_COOLDOWN = 2000;
const RUNNING_TENNIS_SPEED_BOOST = 3;
const SINKING_DURATION = 3000;

const FUNCTION_COSTS = {
    athlete: 700,
    engineer: 650,
    spy: 1000,
    butterfly: 1500,
};
const ZOMBIE_ABILITY_COSTS = {
    trap: 50,
    mine: 50
};

// Categorias de Colisão (RESTAURADO AO ORIGINAL)
const playerCategory = 0x0002;
const wallCategory = 0x0004;
const movableObjectCategory = 0x0008;
const cannonballCategory = 0x0010;

function getDensityById(id) {
    switch (id) {
        // ALTERADO: Densidade do carro muito aumentada
        case 'car':
            return 0.5;
        case 'big_table':
            return 0.0008;;
        case 'sofa':
        case 'big_bed':
        case 'big_bed2':
            return 0.0008;
        case 'box':
            return 0.0006;
        default:
            return 0.0005;
    }
}

function createPlayerBody(player) {
    const infectionRadius = player.width * 0.75;
    const physicsRadius = player.role === 'human' ?
        infectionRadius / 4 :
        infectionRadius / 3;

    const body = Matter.Bodies.circle(player.x, player.y, physicsRadius, {
        inertia: Infinity,
        frictionAir: 0.02,
        friction: 0,
        label: 'player',
        collisionFilter: {
            category: playerCategory,
            mask: 0xFFFFFFFF // RESTAURADO: Colide com tudo
        }
    });
    body.playerId = player.id;
    return body;
}


function initializeGame() {
    nextUniqueObjectId = 0;
    bodiesMap = {};
    engine = Matter.Engine.create();
    world = engine.world;
    world.gravity.y = 0;
    setupCollisionEvents();
    const currentPlayers = gameState.players || {};

    const originalDucts = [{
        x: 3150,
        y: 480,
        width: 80,
        height: 80
    }, {
        x: 275,
        y: 865,
        width: 80,
        height: 80
    }, {
        x: 2315,
        y: 275,
        width: 80,
        height: 80
    }, {
        x: 3940,
        y: 1440,
        width: 80,
        height: 80
    }, {
        x: 2075,
        y: 1845,
        width: 80,
        height: 80
    }];

    const originalSunshades = [{
        x: 4350,
        y: 600,
        width: 320,
        height: 340
    }, {
        x: 4440,
        y: 1400,
        width: 320,
        height: 340
    }];
    const mirroredSunshades = originalSunshades.map(s => ({ ...s,
        y: WORLD_HEIGHT - s.y - s.height
    }));

    gameState = {
        players: currentPlayers,
        arrows: [],
        blowdartArrows: [], // NOVO: Array para flechas do Blowdart
        drones: {},
        grenades: [],
        groundItems: [],
        traps: [],
        mines: [],
        largeBalls: [],
        portals: [],
        sharks: [],
        floatingTexts: [],
        objects: [],
        obstacles: [],
        takenFunctions: [],
        functionCosts: FUNCTION_COSTS,
        zombieAbilityCosts: ZOMBIE_ABILITY_COSTS,
        gamePhase: 'waiting',
        startTime: 60,
        timeLeft: ROUND_DURATION,
        postRoundTimeLeft: 10,
        lastPortalUseTimestamp: 0,
        hidingSpots: [{
            x: 3150,
            y: 2320,
            width: 80,
            height: 80,
            occupiedBy: null
        }, {
            x: 3940,
            y: 3520,
            width: 80,
            height: 80,
            occupiedBy: null
        }, ],
        skateboard: {
            id: 'skateboard',
            x: 0,
            y: 0,
            width: SKATEBOARD_WIDTH,
            height: SKATEBOARD_HEIGHT,
            spawned: false,
            ownerId: null
        },
        runningTennis: {
            id: 'runningTennis',
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            spawned: false,
            ownerId: null
        },
        ducts: [...originalDucts],
        sunshades: [...originalSunshades, ...mirroredSunshades],
        house: {
            x: 200,
            y: 200,
            width: 2697,
            height: 1670,
            wallThickness: 70,
            walls: []
        },
        garage: {
            x: 800,
            y: 1400,
            width: 700,
            height: 600,
            wallThickness: 70,
            walls: []
        },
        house2: {
            x: 400,
            y: 4000, // Casa nova acima da original
            width: 2200,
            height: 1400,
            wallThickness: 60,
            walls: []
        },
    };
    createWorldBodies();
    createSharks();
}

// ** INÍCIO DAS ALTERAÇÕES **
// Função para adicionar gemas e aumentar a velocidade do humano
function addGems(player, amount) {
    if (!player || amount <= 0) {
        if (player) player.gems += amount;
        return;
    }

    if (player.role === 'human') {
        const oldGems = player.gems;
        player.gems += amount;
        const newGems = player.gems;

        const milestonesPassed = Math.floor(newGems / 100) - Math.floor(oldGems / 100);
        if (milestonesPassed > 0) {
            let speedIncrease = 0;
            for (let i = 0; i < milestonesPassed; i++) {
                speedIncrease += Math.random() * (0.02 - 0.01) + 0.01;
            }
            player.speed += speedIncrease;
            player.originalSpeed += speedIncrease; // Aplica o bônus na velocidade base também
        }
    } else {
        // Se não for humano (ex: zumbi pegando gemas de humano infectado), apenas adiciona
        player.gems += amount;
    }
}

// Função para remover gemas e diminuir a velocidade do zumbi
function removeGems(player, amount) {
    if (!player || amount <= 0) return;

    const oldGems = player.gems;
    player.gems = Math.max(0, player.gems - amount);
    const newGems = player.gems;

    if (player.role === 'zombie') {
        const milestonesPassed = Math.floor(oldGems / 100) - Math.floor(newGems / 100);
        if (milestonesPassed > 0) {
            let speedDecrease = 0;
            for (let i = 0; i < milestonesPassed; i++) {
                speedDecrease += Math.random() * (0.02 - 0.01) + 0.01;
            }
            player.speed = Math.max(ZOMBIE_MIN_SPEED, player.speed - speedDecrease);
            player.originalSpeed = Math.max(ZOMBIE_MIN_SPEED, player.originalSpeed - speedDecrease);
        }
    }
}
// ** FIM DAS ALTERAÇÕES **

function createSharks() {
    gameState.sharks = [];
    for (let i = 0; i < 5; i++) {
        const sizeMultiplier = 0.8 + Math.random() * 0.7;
        const shark = {
            id: i,
            width: 150 * sizeMultiplier,
            height: 60 * sizeMultiplier,
            x: SEA_AREA.x + Math.random() * (SEA_AREA.width - 150),
            y: SEA_AREA.y + Math.random() * (SEA_AREA.height - 60),
            speed: (SHARK_BASE_SPEED + Math.random()) * (1 / sizeMultiplier),
            rotation: 0,
            state: 'patrolling', // states: patrolling, attacking, sleeping
            pauseUntil: 0,
            targetPlayerId: null,
            patrolTarget: null,
        };
        gameState.sharks.push(shark);
    }
}

function createWorldBodies() {
    const allBodies = [];
    const wallThickness = 50;
    const boundaries = [
        Matter.Bodies.rectangle(WORLD_WIDTH / 2, -wallThickness / 2, WORLD_WIDTH + (wallThickness * 2), wallThickness, {
            isStatic: true,
            label: 'boundary',
            collisionFilter: {
                category: wallCategory
            }
        }),
        Matter.Bodies.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT + wallThickness / 2, WORLD_WIDTH + (wallThickness * 2), wallThickness, {
            isStatic: true,
            label: 'boundary',
            collisionFilter: {
                category: wallCategory
            }
console.log("REACHED LINE 500");
