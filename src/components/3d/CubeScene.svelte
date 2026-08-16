<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
  import gsap from 'gsap';
  import CSS3DFaces from './CSS3DFaces.svelte';
  import WebGLBackground from './WebGLBackground.js';

  let viewport: HTMLDivElement;

  const FACE_SIZE = 600;
  const FACE_RADIUS = FACE_SIZE / 2;
  const HALF_PI = Math.PI / 2;
  const orientations = [
    { id: 'profile', position: [0, 0, FACE_RADIUS], rotation: [0, 0, 0] },
    { id: 'projects', position: [FACE_RADIUS, 0, 0], rotation: [0, HALF_PI, 0] },
    { id: 'experience', position: [-FACE_RADIUS, 0, 0], rotation: [0, -HALF_PI, 0] },
    { id: 'education', position: [0, FACE_RADIUS, 0], rotation: [-HALF_PI, 0, 0] },
    { id: 'skills', position: [0, -FACE_RADIUS, 0], rotation: [HALF_PI, 0, 0] },
    { id: 'contact', position: [0, 0, -FACE_RADIUS], rotation: [0, Math.PI, 0] },
  ] as const;

  onMount(() => {
    const scene = new THREE.Scene();
    const cssScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 1, 5000);
    const cube = new THREE.Group();
    cssScene.add(cube);

    const webglRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    webglRenderer.setClearColor(0x000000, 1);
    webglRenderer.domElement.className = 'webgl-layer';
    Object.assign(webglRenderer.domElement.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '0',
      pointerEvents: 'none',
    });

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.domElement.className = 'css3d-layer';
    viewport.append(webglRenderer.domElement, cssRenderer.domElement);

    const source = document.querySelector<HTMLElement>('#cube-face-source');
    const faceElements = source
      ? Array.from(source.querySelectorAll<HTMLElement>('[data-face]'))
      : [];

    faceElements.forEach((element, index) => {
      const orientation = orientations[index];
      if (!orientation) return;
      const face = new CSS3DObject(element);
      face.position.set(...orientation.position);
      face.rotation.set(...orientation.rotation);
      cube.add(face);
    });

    source?.remove();

    const background = new WebGLBackground(scene);
    const targetEuler = { x: 0, y: 0, z: 0 };
    let activeFace = 'profile';
    let animationFrame = 0;

    const normalByFace = new Map<string, THREE.Vector3>();
    orientations.forEach((orientation) => {
      normalByFace.set(
        orientation.id,
        new THREE.Vector3(...orientation.position).normalize(),
      );
    });

    const updateActiveFace = () => {
      let bestFace = activeFace;
      let bestZ = -Infinity;
      const quaternion = cube.quaternion;

      normalByFace.forEach((normal, id) => {
        const z = normal.clone().applyQuaternion(quaternion).z;
        if (z > bestZ) {
          bestZ = z;
          bestFace = id;
        }
      });

      activeFace = bestFace;
      faceElements.forEach((element) => {
        const isActive = element.dataset.face === activeFace;
        element.classList.toggle('is-active', isActive);
        element.setAttribute('aria-hidden', String(!isActive));
      });
      window.dispatchEvent(new CustomEvent('cube-face-change', { detail: { face: activeFace } }));
    };

    const rotateTo = (direction: string) => {
      if (direction === 'HOME') {
        targetEuler.x = 0;
        targetEuler.y = 0;
        targetEuler.z = 0;
      }
      if (direction === 'UP') targetEuler.x += HALF_PI;
      if (direction === 'DOWN') targetEuler.x -= HALF_PI;
      if (direction === 'LEFT') targetEuler.y -= HALF_PI;
      if (direction === 'RIGHT') targetEuler.y += HALF_PI;
      if (!['HOME', 'UP', 'DOWN', 'LEFT', 'RIGHT'].includes(direction)) return;

      gsap.to(cube.rotation, {
        x: targetEuler.x,
        y: targetEuler.y,
        z: targetEuler.z,
        duration: 0.82,
        ease: 'power3.inOut',
        overwrite: true,
        onUpdate: updateActiveFace,
        onComplete: updateActiveFace,
      });
    };

    const handleNavigation = (event: Event) => {
      rotateTo((event as CustomEvent<{ direction: string }>).detail.direction);
    };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = window.innerWidth < 720 ? 1380 : window.innerHeight < 760 ? 1260 : 1200;
      camera.updateProjectionMatrix();
      webglRenderer.setSize(window.innerWidth, window.innerHeight, false);
      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    const render = () => {
      background.update();
      webglRenderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
      animationFrame = requestAnimationFrame(render);
    };

    window.addEventListener('cube-navigate', handleNavigation);
    window.addEventListener('resize', resize);
    resize();
    updateActiveFace();
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      gsap.killTweensOf(cube.rotation);
      window.removeEventListener('cube-navigate', handleNavigation);
      window.removeEventListener('resize', resize);
      background.dispose();
      webglRenderer.dispose();
      webglRenderer.domElement.remove();
      cssRenderer.domElement.remove();
    };
  });
</script>

<div class="scene-viewport" bind:this={viewport} aria-label="Interactive 3D portfolio cube">
  <CSS3DFaces />
  <div class="scene-status" aria-hidden="true">
    <span>CSS3D://ONLINE</span>
    <span>WEBGL://ONLINE</span>
  </div>
</div>

<style>
  .scene-viewport {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #000000;
  }

  .scene-status {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 30;
    display: flex;
    gap: 16px;
    color: #71717a;
    font: 10px/1.4 'Silkscreen', monospace;
    pointer-events: none;
  }

  :global(.webgl-layer),
  :global(.css3d-layer) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  :global(.webgl-layer) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
  }

  :global(.css3d-layer) {
    z-index: 10;
    pointer-events: none;
  }

  :global(.css3d-layer > div) {
    transform-style: preserve-3d;
  }

  @media (max-width: 640px) {
    .scene-status { top: 12px; left: 12px; flex-direction: column; gap: 2px; font-size: 7px; }
  }
</style>
