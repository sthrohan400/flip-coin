import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { config } from "./config";

function threeRender() {
    const resultTextMessage = {
        0: {
            message: "TAIL",
            description: "It's a"
        },
        1: {
            message: "HEAD",
            description: "It's a"
        }
    }
    const state = {
        result: false,
        coinObject: false,
        animation: {
            renderId: false,
            clicked: false,
            completed: false,
            position: {
                reversed: false,
                max: 50,
                min: 10
            }
        }
    };
    const popup = document.getElementById("popup-window");
    const flipBtn = document.getElementById("btn-flip-start");
    const popCloseBtn = document.getElementById("popup-window-close");
    // Generate true or false 1 || 0 based on random odd even numbers
    // 1- HEAD ,  0 - TAIL
    function generateWinner() {
        return (Math.floor(Math.random() * config.result.maxLimit) % 2) == 0 ? 1 : 0;
    }
    // Coin Object Rotation to X axis 
    function setRotation(isCompleted) {
        if(isCompleted === false) {
            state.coinObject.rotation.x += Math.abs((state.animation.position.max - state.animation.position.min) / (Math.abs(state.coinObject.position.y + 1) * parseInt(config.coin.rotation.speed)));
        } else {
            state.coinObject.rotation.set(config.coin.rotation.x,config.coin.rotation.y,config.coin.rotation.z);
        }
    }
    // Coin object move to y position both direction based on max and min position set in config
    // Coin will revert the position to original position if reach max position
    function setPosition(isCompleted) {
        if(isCompleted === false) {
            if(state.animation.position.reversed === true) {
                state.coinObject.position.y -= Math.abs((state.animation.position.max - state.animation.position.min) / (Math.abs(state.coinObject.position.y + 1) * parseInt(config.coin.position.speed)));
            } else {
                state.coinObject.position.y += Math.abs((state.animation.position.max - state.animation.position.min) / (Math.abs(state.coinObject.position.y + 1) * parseInt(config.coin.position.speed)));
            }
        } else {
            state.coinObject.position.set(config.coin.position.x,config.coin.position.y,config.coin.position.z);
        }
    }
    function handlePopup(side) {
        popup.style.display = "block";
        const textMessage =  resultTextMessage[side].message;
        popup.getElementsByClassName("win-msg")[0].textContent = textMessage;
    }

    function render() {
        // Load Textures
        const sceneBackground = new THREE.TextureLoader().load(config.scene.backgroundImage);
        const coinTexture = new THREE.TextureLoader().load(config.coin.modelTexture);
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
        // 1 - HEAD
        // 2 - TAIL
        function setWinner(side) {
            if(side !== 0 && side !== 1) {
                return;
            }
            // Set rotation and position to initial state
            if(side === 0) {
                state.coinObject.rotation.x = (Math.PI + Math.PI / 8);

            } else {
                // No need to as default rotation is head always
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
                        // Add texture to cylinder only
                        if(child.name == "Cylinder") {
                            newMeshMaterial.map = coinTexture;
                        } else {
                            newMeshMaterial.color = config.coin.color;
                        }
                        child.material = newMeshMaterial.clone();
                    }
                });
                state.coinObject = object.clone();
                state.coinObject.rotation.set(config.coin.rotation.x,config.coin.rotation.y,config.coin.rotation.z);
                state.coinObject.position.set(config.coin.position.x,config.coin.position.y, config.coin.position.z);
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

            setPosition(state.animation.completed);
            setRotation(state.animation.completed);

            if(!!state.animation.renderId && state.animation.completed === true) {
                setWinner(state.result);
                handlePopup(state.result);
                cancelAnimationFrame(handleAnimateLogic);
                state.animation.completed = false;
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
            popCloseBtn.addEventListener("click", () => {
                popup.style.display = "none";
            });
            flipBtn.addEventListener("click", () => {
                if(state.animation.clicked === false) {
                    popCloseBtn.click();
                    state.result = generateWinner();
                    setRotation(false);
                    setPosition(false);
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