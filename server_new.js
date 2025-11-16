#!/usr/bin/env node
"use strict";

console.log("🚀 [SERVER] Initializing...");

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const Matter = require('matter-js');
const fs = require('fs-extra');
const crypto = require('crypto');
const path = require('path');

console.log("✅ [MODULES] All dependencies loaded");

// Setup Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

console.log("✅ [INIT] Express and Socket.io configured");

// Load commands
const commands = require('./commands');
console.log("✅ [COMMANDS] Loaded");

// Constants
const MAX_MESSAGE = 1000;
const USERS_FILE = path.join(__dirname, "users.json");
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const LINKS_FILE = path.join(__dirname, "links.json");

// State
let chatMessages = [];
let gameState = {
    players: {},
    objects: [],
    timeLeft: 120,
    startTime: 60,
    gamePhase: 'waiting'
};

// Load persisted data
console.log("📝 [PERSIST] Loading user data...");
let users = fs.existsSync(USERS_FILE) ? fs.readJsonSync(USERS_FILE) : {};
let messages = fs.existsSync(MESSAGES_FILE) ? fs.readJsonSync(MESSAGES_FILE) : {};
let links = fs.existsSync(LINKS_FILE) ? fs.readJsonSync(LINKS_FILE) : [];
console.log(`✅ [PERSIST] Loaded ${Object.keys(users).length} users, ${messages.length} messages, ${links.length} links`);

// Password hashing
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = crypto.scryptSync(password, salt, 64);
    return { salt, hash: derived.toString('hex') };
}

function verifyPassword(userObj, password) {
    if (!userObj) return false;
    if (userObj.password) return userObj.password === password;
    if (userObj.passwordHash && userObj.salt) {
        const derived = crypto.scryptSync(password, userObj.salt, 64).toString('hex');
        return derived === userObj.passwordHash;
    }
    return false;
}

// Migrate to hashed passwords
function migrateUsersToHashed() {
    let changed = false;
    for (const name in users) {
        const u = users[name];
        if (u && u.password && !u.passwordHash) {
            const { salt, hash } = hashPassword(u.password);
            u.salt = salt;
            u.passwordHash = hash;
            delete u.password;
            changed = true;
        }
    }
    if (changed) saveUsers();
}

function saveUsers() {
    fs.writeJsonSync(USERS_FILE, users, { spaces: 2 });
}

function saveMessages() {
    fs.writeJsonSync(MESSAGES_FILE, messages, { spaces: 2 });
}

migrateUsersToHashed();
console.log("✅ [SECURITY] Password migration complete");

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

console.log("📡 [SERVER] Starting HTTP listener...");

// Main socket.io handler
io.on('connection', (socket) => {
    console.log(`🔌 [CONNECT] User connected: ${socket.id}`);
    
    socket.on('register', ({ username, password }) => {
        if (!username || !password) {
            socket.emit('registerError', 'Username and password required');
            return;
        }
        if (users[username]) {
            socket.emit('registerError', 'User already exists');
            return;
        }
        const { salt, hash } = hashPassword(password);
        users[username] = {
            salt,
            passwordHash: hash,
            role: username === 'MINGAU' ? 'admin' : 'player',
            friends: [],
            friendRequests: [],
            profile: {
                bio: '',
                photo: '',
                stats: { wins: 0, losses: 0 }
            }
        };
        saveUsers();
        socket.emit('registerSuccess', `User ${username} created`);
    });

    socket.on('login', ({ username, password }) => {
        if (!users[username] || !verifyPassword(users[username], password)) {
            socket.emit('loginError', 'Invalid credentials');
            return;
        }
        socket.emit('loginSuccess', {
            username,
            role: users[username].role,
            profile: users[username].profile
        });
    });

    socket.on('disconnect', () => {
        console.log(`🔌 [DISCONNECT] User disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 [SUCCESS] Server running at http://0.0.0.0:${PORT}`);
    console.log(`📍 [PORT] Listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error(`❌ [ERROR] Server error:`, err.message);
    process.exit(1);
});

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error(`❌ [UNCAUGHT] Exception:`, err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error(`❌ [REJECTED] Promise rejection:`, reason);
    process.exit(1);
});

console.log("✅ [READY] Server fully initialized");
