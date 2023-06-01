import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//Loader
const textureLoading = new THREE.TextureLoader();
const normalTexture = textureLoading.load("/textures/555.png");
const texture = textureLoading.load("/textures/5.jpg");
const space = textureLoading.load("/textures/space.svg");
const moonMap = textureLoading.load("/textures/moon.jpg");

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereGeometry(0.5, 64, 64);
const geometry2 = new THREE.SphereGeometry(1.5, 70, 70);
const moonGeometry = new THREE.SphereGeometry(0.02, 32, 32);

// Materials

const material1 = new THREE.MeshStandardMaterial();
material1.normalMap = normalTexture;
material1.lightMapIntensity = 1;
material1.map = texture;

const material2 = new THREE.MeshStandardMaterial();
material2.map = space;
material1.roughness = 1;
material2.side = THREE.DoubleSide;
material2.map.wrapS = THREE.RepeatWrapping;
material2.map.wrapT = THREE.RepeatWrapping;
material2.map.repeat.set(5, 5);
material2.castShadow = false;

const moonMaterial = new THREE.MeshStandardMaterial();
moonMaterial.map = moonMap;
moonMaterial.roughness = 1;

// Mesh
const sphere = new THREE.Mesh(geometry, material1);
const sphere2 = new THREE.Mesh(geometry2, material2);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(0, 0, 0); // Налаштуйте позицію місяця
scene.add(sphere, sphere2, moon);

// Lights

const pointLight2 = new THREE.PointLight(0xffffff, 2);
pointLight2.position.set(-1, 1, 1);
pointLight2.intensity = 0.7;
scene.add(pointLight2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1.5;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // sphere.rotation.x = Math.PI / 2;
  sphere.rotation.y = 0.01 * elapsedTime + Math.PI / 1.2;
  // sphere.rotation.y = 0.01 * elapsedTime;
  sphere2.rotation.y = 0.005 * elapsedTime;

  const radius = 1; // Радіус сфери
  const rotationSpeed = 0.01; // Швидкість обертання місяця

  moon.position.set(
    radius * 1.2 * Math.cos(rotationSpeed * elapsedTime),
    // radius * Math.cos(rotationSpeed * (elapsedTime -1.4) ),
    0.1,
    radius * Math.sin(rotationSpeed * elapsedTime)
  );

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
