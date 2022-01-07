const config =  {
    result: {
        maxLimit: 100000 //MAX limit for randomness
    },
    canvasContainerId:  "canvas",
    containerId: "game-container",
    scene: {
        backgroundImage: "/textures/background-2.jpg",
        backgroundColor: "0x000000",
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
        color: "0xFFFFFF",
        intensity: 1,
        position: {
            x: 0,
            y: 20,
            z: 80
        }
    },
    coin: {
        modelObj: "/textures/coin-model.obj",
        cylinderColor: "0xFFB606",
        color: "0x000000",
        position: {
            x: 0,
            y: 10,
            z: 0
        },
        rotation: { 
            x: 0,
            y: Math.PI,
            z: 0
        }
    }
};
export { config };