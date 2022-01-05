import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Textures
const goldTextureImg = "/textures/gold-texture-2.jpg";

// const headTexture = new THREE.TextureLoader().load(headTextureImg);
// const tailTexture = new THREE.TextureLoader().load(tailTextureImg);
const coinHeadBottomTexture = new THREE.TextureLoader().load(goldTextureImg);

// Canvas config
const canvas = document.getElementById("canvas-paper");
// Scene Initialzation
const scene = new THREE.Scene();
// Creating Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// Add Camera to Scene
const camera =  new THREE.PerspectiveCamera(45, window.innerHeight / window.innerWidth, 0.01, 1000);
camera.position.set(0, 60, 80);

// Add Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Add Light to Scene
const light = new THREE.PointLight(0xFFFFFF, 0.9);
light.position.set(0, 80, 50);
scene.add(light);
// Creating Coin Object
const coinGeometry  = new THREE.CylinderGeometry(
    5 , 5, 2, 164, 10 , false
);
const coinHeadBottomMaterial = new THREE.MeshPhongMaterial( {
    map: coinHeadBottomTexture,
    color: 0xFFD700,
    emissive: 0x000000,
    specular: 0x111111,
    shininess: 10,
    reflectivity: 1,
    refractionRatio: 0.98,
    wireframe: false
});
const coinSideMaterial = new THREE.MeshPhongMaterial({
    map: coinHeadBottomTexture,
    color: 0xFFD700
});
const coinMaterials = [
    coinSideMaterial,
    coinHeadBottomMaterial,
    coinHeadBottomMaterial
];
const coin = new THREE.Mesh(coinGeometry, coinMaterials);
scene.add(coin);

// Creating Text Texture - H
const cylGeometry = new THREE.CylinderGeometry(1,1,5,64);
const cylMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFD700
});
const cylh1 = new THREE.Mesh(cylGeometry, cylMaterial);
cylh1.rotation.x = Math.PI / 2;
cylh1.position.z = -10;
scene.add(cylh1);


function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();

