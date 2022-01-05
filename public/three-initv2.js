import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

// Textures
const coinModel = "/textures/coin-model.obj";
const sceneBackgroundImg = "/textures/background-2.jpg";
const sceneBackground = new THREE.TextureLoader().load(sceneBackgroundImg);
const objLoader = new OBJLoader();

// Canvas config
const gameContainer = document.getElementsByClassName("canvas-game-container")[0];
const canvas = document.getElementById("canvas-paper");
const canvasWidth = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;

// Scene Initialzation
const scene = new THREE.Scene();
scene.background = sceneBackground;
// Creating Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas,  antialias: true, alpha: true});
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(0x000000, 1);
gameContainer.prepend(renderer.domElement);

// Add Camera to Scene
const camera =  new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 1, 2000);
camera.position.set(0, 25, 60);

// Add Light to Scene
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 25, 60);
scene.add(light);

// Variable configurations
let coinObject = null;
let coinObjectInitRotation =  null;
let coinObjectInitPosition =  null;

// Loader Object
objLoader.load(coinModel, (object) =>{
    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            const newMeshMaterial = child.material.clone();
            const color = (child.name == "Cylinder") ? new THREE.Color(0x000000) : new THREE.Color(0xFFFFFF);
            newMeshMaterial.color = color;
            child.material = newMeshMaterial.clone();

            if(child.name == "Cylinder") {
                const meshMaterial = child.clone();
            }
        }
    });
    coinObject = object.clone();
    coinObject.rotation.y = Math.PI;
    coinObject.position.set(0,1,0);
    coinObjectInitPosition = coinObject.position.clone();
    coinObjectInitRotation = coinObject.rotation.clone();
    object = coinObject;
    scene.add(object);
    render();
});

// Render Functionality Configuration
let animationFlagObj = {
    pause: false,
    rotation: false,
    position: false
};
let renderId = null;

const position = {
    reversed: false,
    max: 55,
    min: 0
};

function setRotation(flag) {
    if(flag === true) {
        coinObject.rotation.x += Math.abs((position.max - position.min) / (Math.abs(coinObject.position.y + 1) * 11));
    } else {
        console.log(coinObjectInitRotation.x, coinObjectInitRotation.y, coinObjectInitRotation.z);
        coinObject.rotation.set(coinObjectInitRotation.x, coinObjectInitRotation.y, coinObjectInitRotation.z);
    }
}
function setPosition(flag) {
    if(flag === true) {
        if(position.reversed === true) {
            coinObject.position.y -= Math.abs((position.max - position.min) / (Math.abs(coinObject.position.y + 1) * 10));
        } else {
            coinObject.position.y += Math.abs((position.max - position.min) / (Math.abs(coinObject.position.y + 1) * 10));
        }
    } else {
        coinObject.position.set(coinObjectInitPosition.x, coinObjectInitPosition.y, coinObjectInitPosition.z);
        console.log(coinObjectInitPosition.x, coinObjectInitPosition.y, coinObjectInitPosition.z);
    }
}


function renderWithRotate() {
    // Check and handle POSITION - REVERSE VS 
    if(coinObject.position.y >= position.max) {
        position.reversed = true;
     } else if(coinObject.position.y <= position.min && position.reversed === true) {
        animationFlagObj.pause = true;
        position.reversed = false;
     }

     // Pause animation if it completes position shift

    if(!!coinObjectInitPosition) {
        setPosition(animationFlagObj.position);
    }
    if(!!coinObjectInitRotation) {
        setRotation(animationFlagObj.rotation);
    }
    if(!!renderId && animationFlagObj.pause === true) {
        cancelAnimationFrame(renderId);
        animationFlagObj.pause = false;
        animationFlagObj.rotation = false;
        animationFlagObj.position = false;
    } else {
        renderId = requestAnimationFrame(renderWithRotate);
        renderer.render(scene, camera);
    }
}
function render() {
    renderer.render(scene, camera);
}

// Added Functionality
const flipStartBtnDom = document.getElementById("btn-flip-start");
const flipStopBtnDom = document.getElementById("btn-flip-stop");

flipStartBtnDom.addEventListener("click", () => {
    if(animationFlagObj.rotation === false) {
        animationFlagObj.pause = false;
        animationFlagObj.rotation = true;
        animationFlagObj.position = true;
        renderWithRotate();
    }
    
});
// flipStopBtnDom.addEventListener("click", () => {
//     if(animationFlagObj.rotation === true) {
//         animationFlagObj.rotation = false;
//         animationFlagObj.position = false;
//         animationFlagObj.pause = true;
//         renderWithRotate();
//     }
// });
