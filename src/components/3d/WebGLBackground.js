import * as THREE from 'three';

const GRID_SIZE = 35;
const SPACING = 88;
const WAVE_DURATION = 2.8;

export default class WebGLBackground {
  constructor(scene) {
    this.scene = scene;
    this.clock = new THREE.Clock();
    this.waveStartedAt = -Infinity;
    this.instance = new THREE.Object3D();
    this.positions = [];

    const geometry = new THREE.BoxGeometry(42, 42, 42);
    const material = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, GRID_SIZE * GRID_SIZE);
    this.mesh.position.z = -620;
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);

    const offset = ((GRID_SIZE - 1) * SPACING) / 2;
    let index = 0;
    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let column = 0; column < GRID_SIZE; column += 1) {
        const x = column * SPACING - offset;
        const y = row * SPACING - offset;
        this.positions.push({ x, y, distance: Math.hypot(x, y) / SPACING });
        this.instance.position.set(x, y, 0);
        this.instance.updateMatrix();
        this.mesh.setMatrixAt(index, this.instance.matrix);
        index += 1;
      }
    }
    this.mesh.instanceMatrix.needsUpdate = true;

    this.handleWave = () => this.triggerWave();
    window.addEventListener('trigger-bg-wave', this.handleWave);
  }

  triggerWave() {
    this.waveStartedAt = this.clock.getElapsedTime();
  }

  update() {
    const elapsed = this.clock.getElapsedTime();
    const waveTime = elapsed - this.waveStartedAt;
    const active = waveTime >= 0 && waveTime < WAVE_DURATION;
    const envelope = active ? Math.sin((waveTime / WAVE_DURATION) * Math.PI) : 0;

    for (let index = 0; index < this.positions.length; index += 1) {
      const { x, y, distance } = this.positions[index];
      // A phase offset based on radial distance sends the displacement outward.
      const z = active ? Math.sin(distance - waveTime * 8) * 110 * envelope : 0;
      const scale = 1 + Math.max(0, z) / 360;

      this.instance.position.set(x, y, z);
      this.instance.rotation.set(0, 0, 0);
      this.instance.scale.setScalar(scale);
      this.instance.updateMatrix();
      this.mesh.setMatrixAt(index, this.instance.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.rotation.y += 0.001;
    this.mesh.position.y = Math.sin(elapsed * 0.35) * 12;
  }

  dispose() {
    window.removeEventListener('trigger-bg-wave', this.handleWave);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }
}
