```javascript
const THREE = require('three');

class GraphicsEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    createPlayer(player) {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ color: player.color });
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(player.x, player.y, player.z);
        this.scene.add(cube);
        return cube;
    }

    updatePlayer(player, cube) {
        cube.position.set(player.x, player.y, player.z);
    }

    createEnvironment(environment) {
        // Add your environment creation code here
        // This could include creating terrain, buildings, etc.
    }

    updateEnvironment(environment) {
        // Add your environment update code here
        // This could include changing terrain based on game state, etc.
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

module.exports = new GraphicsEngine();
```
