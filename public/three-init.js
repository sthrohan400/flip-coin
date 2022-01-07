import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { config } from "./config";

function threeRender() {
    const state = {
        result: false,
        coinObject: false,
        coinObjectInitRotation: false,
        coinObjectInitPosition: false,
        animation: {
            renderId: false,
            clicked: false,
            completed: false,
            position: {
                reversed: false,
                max: 50,
                min: 0
            }
        }
    };
    // Generate true or false 1 || 0 based on random odd even numbers
    // 1- HEAD ,  0 - TAIL
    function generateWinner() {
        return (Math.floor(Math.random() * config.result.maxLimit) % 2) == 0 ? 1 : 0;
    }
    // Coin Object Rotation to X axis 
    function setRotation(isCompleted) {
        if(isCompleted === false) {
            state.coinObject.rotation.x += Math.abs((state.animation.position.max - state.animation.position.min) / (Math.abs(state.coinObject.position.y + 1) * 11));
        } else {
            state.coinObject.rotation.set(state.coinObjectInitRotation.x, state.coinObjectInitRotation.y, state.coinObjectInitRotation.z);
        }
    }
    // Coin object move to y position both direction based on max and min position set in config
    // Coin will revert the position to original position if reach max position
    function setPosition(isCompleted) {
        if(isCompleted === false) {
            if(state.animation.position.reversed === true) {
                state.coinObject.position.y -= Math.abs((state.animation.position.max - state.animation.position.min) / (Math.abs(state.coinObject.position.y + 1) * 10));
            } else {
                state.coinObject.position.y += Math.abs((state.animation.position.max - state.animation.position.min) / (Math.abs(state.coinObject.position.y + 1) * 10));
            }
        } else {
            state.coinObject.position.set(state.coinObjectInitPosition.x, state.coinObjectInitPosition.y, state.coinObjectInitPosition.z);
        }
    }

    function render() {
        state.result = generateWinner();
        console.log("Winner", state.result);
        // Load Textures
        const sceneBackground = new THREE.TextureLoader().load(config.scene.backgroundImage);
        const objLoader = new OBJLoader();
        // Canvas Setup
        const gameContainer = document.getElementById(config.containerId);
        const canvas = document.getElementById(config.canvasContainerId);
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        // Scene Initialization
        const scene = new THREE.Scene();
        scene.background = sceneBackground;
        // Creating Renderer
        const renderer = new THREE.WebGLRenderer({ canvas: canvas,  antialias: true, alpha: true});
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setClearColor(config.scene.backgroundColor, config.scene.intensity);
        gameContainer.prepend(renderer.domElement);
        // Add Camera to Scene
        const camera =  new THREE.PerspectiveCamera(config.camera.fov, canvasWidth / canvasHeight, config.camera.near, config.camera.far);
        camera.position.set(config.camera.position.x, config.camera.position.y, config.camera.position.z);
        // Add Light to Scene
        const light = new THREE.DirectionalLight(config.light.color, config.light.intensity);
        light.position.set(config.light.position.x, config.light.position.y, config.light.position.z);
        scene.add(light);
        // Function animates to display winning coin side
        // if winner is head it animates movement to convert coin to winning head side
        function setWinner(side) {
            if(side === null || side !== 0 || side !== 1) {
                return;
            }
            // Set rotation to initial state
            setRotation(false);
            setPosition(false);
            if(side === 0) {
                // Tail winning side
                state.coinObjectInitRotation.y = Math.PI;
            } else {
                //Head WInning side
            }
        }
        function loadModelObject() {
            // Loader Object
            const objLoader = new OBJLoader();
            objLoader.load(config.coin.modelObj, (object) =>{
                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        // Non primitive data types in JS are passed by reference thus need to use clone func
                        const newMeshMaterial = child.material.clone();
                        const color = (child.name == "Cylinder") ? new THREE.Color(config.coin.cylinderColor) : new THREE.Color(config.coin.color);
                        newMeshMaterial.color = color;
                        child.material = newMeshMaterial.clone();
                    }
                });
                state.coinObject = object.clone();
                state.coinObject.rotation.y = Math.PI;
                state.coinObject.rotation.set(config.coin.rotation.x,config.coin.rotation.y,config.coin.rotation.z);
                state.coinObject.position.set(config.coin.position.x,config.coin.position.y, config.coin.position.z);
                state.coinObjectInitPosition = state.coinObject.position.clone();
                state.coinObjectInitRotation = state.coinObject.rotation.clone();
                object = state.coinObject;
                scene.add(object);
                animate();
            });
        }
        // Function handles game logic
        function handleAnimateLogic() {
            //Addition of rotation and position change logic
            // Check if current position of coin object is greter or equal to max position set otherwise need to reverse
            if(state.coinObject.position.y >= state.animation.position.max) {
                state.animation.position.reversed = true;
            } // if position y is smaller than min set after the traversal it will be termed as completed
            else if(state.coinObject.position.y <= state.animation.position.min && state.animation.position.reversed === true) {
                state.animation.position.reversed = false;
                state.animation.completed = true;
            }
             // Check if coin object is ready and start the position change / y axis translate
            if(!!state.coinObjectInitPosition) {
                setPosition(state.animation.completed);
            }
            if(!!state.coinObjectInitRotation) {
                setRotation(state.animation.completed);
            }

            if(!!state.animation.renderId && state.animation.completed === true) {
                setWinner(state.result);
                cancelAnimationFrame(handleAnimateLogic);
                state.animation.completed = true;
                state.animation.clicked = false;
                state.animation.position.renderId = null;
                state.animation.position.reversed = false;
            } else {
                state.animation.renderId = requestAnimationFrame(handleAnimateLogic);
                renderer.render(scene,camera);
            }
        }
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene,camera);
        }
        function addListeners() {
            const flipBtn = document.getElementById("btn-flip-start");
            flipBtn.addEventListener("click", () => {
                if(state.animation.clicked === false) {
                    state.animation.clicked = true;
                    handleAnimateLogic();
                }
            });
        }
        //Load Model Object
        loadModelObject();
        renderer.render(scene, camera);
        addListeners();
    }
    return {
        render
    }
}
threeRender().render();