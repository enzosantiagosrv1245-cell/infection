console.log("START");
try {
    console.log("INIT 1");
    const express = require('express');
    const http = require('http');
    const { Server } = require("socket.io");
    const Matter = require('matter-js');
    const fs = require('fs-extra');
    const crypto = require('crypto');
    const path = require('path');
    console.log("INIT 2: Deps loaded");
    
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    console.log("INIT 3: App created");

    const commands = require('./commands');
    console.log("INIT 4: Commands loaded");

    const MAX_MESSAGE = 1000;
    let chatMessages = [];
    const USERS_FILE = path.join(__dirname, "users.json");
    const MESSAGES_FILE = path.join(__dirname, "messages.json");
    const LINKS_FILE = path.join(__dirname, "links.json");
    
    console.log("INIT 5: Files loaded");
    let users = fs.existsSync(USERS_FILE) ? fs.readJsonSync(USERS_FILE) : {};
    console.log("INIT 6: Users read");
    let messages = fs.existsSync(MESSAGES_FILE) ? fs.readJsonSync(MESSAGES_FILE) : {};
    console.log("INIT 7: Messages read");
    let links = fs.existsSync(LINKS_FILE) ? fs.readJsonSync(LINKS_FILE) : [];
    console.log("INIT 8: Links read");
    
    console.log("SUCCESS: All basic initialization done");
    process.exit(0);
} catch(e) {
    console.error("ERROR:", e.message, e.stack);
    process.exit(1);
}
