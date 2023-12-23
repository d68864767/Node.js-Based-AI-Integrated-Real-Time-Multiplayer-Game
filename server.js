```javascript
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const aiEngine = require('./aiEngine');
const gameMechanics = require('./gameMechanics');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players = {};

wss.on('connection', (ws) => {
    let id = Math.random().toString(36).substring(7);
    players[id] = ws;

    ws.on('message', (message) => {
        let data = JSON.parse(message);
        gameMechanics.handlePlayerAction(id, data);
    });

    ws.on('close', () => {
        delete players[id];
        gameMechanics.handlePlayerDisconnect(id);
    });
});

setInterval(() => {
    let gameState = gameMechanics.getGameState();
    let aiActions = aiEngine.calculateAIActions(gameState);

    gameMechanics.handleAIActions(aiActions);

    let updatedGameState = gameMechanics.getGameState();
    let gameStateString = JSON.stringify(updatedGameState);

    for(let playerId in players) {
        players[playerId].send(gameStateString);
    }
}, 1000 / 60); // 60 updates per second

server.listen(8080, () => {
    console.log('Server started on port 8080');
});
```
