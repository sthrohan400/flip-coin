import * as THREE from "three";

const config =  {
    result: {
        maxLimit: 100000, //MAX limit for randomness,
        autoClose: 5000
    },
    canvasContainerId:  "canvas",
    containerId: "game-container",
    scene: {
        backgroundImage: "/textures/background-2.jpg",
        backgroundColor: new THREE.Color(0x000000),
        intensity: 1
    },
    camera: {
        fov: 60,
        aspect: 1,
        near: 1,
        far: 2000,
        position: {
            x: 0,
            y: 25,
            z: 60
        }
    },
    light: {
        color: new THREE.Color(0xFEFEFE),
        intensity: 1,
        position: {
            x: 0,
            y: 20,
            z: 75
        }
    },
    coin: {
        modelObj: "/textures/coin-model.obj",
        modelTexture: "/textures/coin-texture.jpg",
        cylinderColor: new THREE.Color(0x282454),
        color: new THREE.Color(0x282454),
        position: {
            speed: 3,
            x: 0,
            y: 10,
            z: 0
        },
        rotation: { 
            speed: 3,
            x: Math.PI / 8,
            y: Math.PI,
            z: 0
        }
    }
};
export { config };