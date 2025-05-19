import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x1e1e1e, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById("threejs-container");
container.appendChild(renderer.domElement);
renderer.setSize(container.clientWidth, container.clientHeight);

// OrbitControls for 360° interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = false;

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 1));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Model and animation variables
let model, mixer, idleAction, hoverAction;
const clock = new THREE.Clock();

// Load the model
const loader = new GLTFLoader();
loader.load(
  "assets/baymax.glb",
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    scene.add(model);

    // Setup animations
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    if (clips && clips.length > 0) {
      idleAction = mixer.clipAction(clips[0]);
      hoverAction = mixer.clipAction(clips[1] || clips[0]);

      idleAction.setLoop(THREE.LoopRepeat);
      hoverAction.setLoop(THREE.LoopOnce);
      hoverAction.clampWhenFinished = true;
      hoverAction.weight = 0.7;
      hoverAction.setEffectiveTimeScale(1);

      idleAction.play();

      // Automatic animation every 8 seconds
      setInterval(() => {
        idleAction.fadeOut(0.3);
        hoverAction.reset().fadeIn(0.3).play();

        setTimeout(() => {
          hoverAction.fadeOut(0.3);
          idleAction.reset().fadeIn(0.3).play();
        }, hoverAction._clip.duration * 10000);
      }, 10000);
    }

    // Center camera around model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();

    camera.position.set(center.x, center.y, center.z + size * 0.7);
    camera.lookAt(center);

    controls.target.copy(center);
    controls.update();
  },
  undefined,
  (error) => console.error("Error loading model:", error)
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});