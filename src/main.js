import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  // Private fields for renderer, camera, scene, etc.
  #threejs_ = null;
  #camera_ = null;
  #scene_ = null;
  #clock_ = new THREE.Clock();
  #controls_ = null;
  #mesh_ = null;

  constructor() {
    // Automatically handle window resize
    window.addEventListener("resize", () => {
      this.#onWindowResize_();
    });
  }

  initialize() {
    // Initialize WebGL renderer
    this.#threejs_ = new THREE.WebGLRenderer();
    this.#threejs_.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.#threejs_.domElement);

    // Create a perspective camera
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera_ = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
    this.#camera_.position.z = 5;

    // Add orbit controls (mouse drag to rotate view)
    this.#controls_ = new OrbitControls(
      this.#camera_,
      this.#threejs_.domElement,
    );
    this.#controls_.enableDamping = true;
    this.#controls_.target.set(0, 0, 0);

    // Create the scene
    this.#scene_ = new THREE.Scene();

    // Create a wireframe cube mesh
    this.#mesh_ = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      }),
    );
    this.#scene_.add(this.#mesh_);

    // Adjust to current window size and start animation loop
    this.#onWindowResize_();
    this.#raf();
  }

  // Handle window resizing
  #onWindowResize_() {
    const canvas = this.#threejs_.domElement;
    const dpr = window.devicePixelRatio;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    console.log(`Resizing to ${w} x ${h}`);

    // Set canvas size in CSS
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    // Set actual render size (multiplied by device pixel ratio)
    this.#threejs_.setSize(w * dpr, h * dpr, false);
    // Optional: this.#threejs_.setPixelRatio(dpr);

    // Update camera projection
    this.#camera_.aspect = aspect;
    this.#camera_.updateProjectionMatrix();
  }

  // Recursive animation frame loop
  #raf() {
    requestAnimationFrame(() => {
      const deltaTime = this.#clock_.getDelta(); // Time since last frame
      this.#step_(deltaTime); // Update logic
      this.#render_(); // Render scene
      this.#raf(); // Loop again
    });
  }

  // Update animation state
  #step_(timeElapsed) {
    // Example: rotate mesh over time (currently commented out)
    // this.#mesh_.rotation.y += timeElapsed * 0.1;
    this.#controls_.update(timeElapsed); // Update controls (damping)
  }

  // Render the scene using the camera
  #render_() {
    this.#threejs_.render(this.#scene_, this.#camera_);
  }
}

// Create and initialize the app
const APP_ = new App();
APP_.initialize();
