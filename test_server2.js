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

console.log("REACHED END OF INITIALIZATION");
