```javascript
// Import necessary libraries
const tf = require('@tensorflow/tfjs');
const _ = require('lodash');

class AIEngine {
    constructor() {
        // Initialize AI models and parameters
        this.model = this.createModel();
        this.trainingData = [];
    }

    createModel() {
        // Create a simple model.
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
        model.add(tf.layers.dense({units: 50, activation: 'relu'}));
        model.add(tf.layers.dense({units: 20, activation: 'relu'}));
        model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

        // Compile the model.
        model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });

        return model;
    }

    async trainModel() {
        // Convert training data to tensors
        const inputs = tf.tensor2d(this.trainingData.map(item => item.input));
        const labels = tf.tensor2d(this.trainingData.map(item => item.label));

        // Train the model
        await this.model.fit(inputs, labels, {
            epochs: 10,
            shuffle: true,
        });
    }

    predict(input) {
        // Make a prediction based on the input
        const prediction = this.model.predict(tf.tensor2d([input]));
        return _.max(prediction.dataSync());
    }

    calculateAIActions(gameState) {
        // Calculate AI actions based on the game state
        let aiActions = {};

        for (let npcId in gameState.npcs) {
            let npc = gameState.npcs[npcId];
            let input = this.prepareInput(npc, gameState);
            let action = this.predict(input);
            aiActions[npcId] = action;
        }

        return aiActions;
    }

    prepareInput(npc, gameState) {
        // Prepare the input for the AI model
        let input = [];

        // Add NPC's current state to the input
        input.push(npc.x);
        input.push(npc.y);
        input.push(npc.health);
        input.push(npc.stamina);

        // Add the state of the closest player to the input
        let closestPlayer = this.getClosestPlayer(npc, gameState.players);
        input.push(closestPlayer.x);
        input.push(closestPlayer.y);
        input.push(closestPlayer.health);
        input.push(closestPlayer.stamina);

        // Add the current game time to the input
        input.push(gameState.time);

        return input;
    }

    getClosestPlayer(npc, players) {
        // Find the closest player to the NPC
        let closestPlayer = null;
        let closestDistance = Infinity;

        for (let playerId in players) {
            let player = players[playerId];
            let distance = this.getDistance(npc, player);

            if (distance < closestDistance) {
                closestPlayer = player;
                closestDistance = distance;
            }
        }

        return closestPlayer;
    }

    getDistance(a, b) {
        // Calculate the Euclidean distance between two points
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

module.exports = new AIEngine();
```
