console.log("STEP 0: Starting");
const express = require('express');
console.log("STEP 1: Express loaded");
const http = require('http');
console.log("STEP 2: HTTP loaded");
const { Server } = require("socket.io");
console.log("STEP 3: Socket.io loaded");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
console.log("STEP 4: App and server created");

console.log("STEP 5: Done with basic setup");
console.log("Server would start now");
