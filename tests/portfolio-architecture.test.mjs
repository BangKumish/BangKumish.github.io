import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('cube geometry and navigation wave follow the revised scene contract', async () => {
  const [scene, navigation, background] = await Promise.all([
    read('src/components/3d/CubeScene.svelte'),
    read('src/components/ui/NavFAB.astro'),
    read('src/components/3d/WebGLBackground.js'),
  ]);

  assert.match(scene, /const FACE_SIZE = 600;/);
  assert.doesNotMatch(scene, /dispatchEvent\(new CustomEvent\('trigger-bg-wave'/);
  assert.match(navigation, /dispatchEvent\(new CustomEvent\('trigger-bg-wave'/);
  assert.match(background, /this\.mesh\.rotation\.y \+= 0\.001;/);
  assert.doesNotMatch(background, /const idle =/);
});

test('content schema accepts every supported employment type', async () => {
  const config = await read('src/content.config.ts');
  for (const type of ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance']) {
    assert.match(config, new RegExp(`['"]${type}['"]`));
  }
});

test('project and experience faces expose interactive inspector contracts', async () => {
  const [projects, experience] = await Promise.all([
    read('src/components/faces/ProjectsFace.astro'),
    read('src/components/faces/ExperienceFace.astro'),
  ]);

  assert.match(projects, /id="project-preview-img"/);
  assert.match(projects, /data-image=/);
  assert.match(projects, /lg:grid-cols-12/);
  assert.match(experience, /data-experience-entry/);
  assert.match(experience, /data-exp-logo=/);
  assert.match(experience, /lg:grid-cols-12/);
  for (const filter of ['ALL', 'FULL-TIME', 'INTERNSHIP', 'CONTRACT']) {
    assert.match(experience, new RegExp(`['"]${filter}['"]`));
  }
});

test('experience filters render as compact horizontal tabs above a dark dual-pane inspector', async () => {
  const experience = await read('src/components/faces/ExperienceFace.astro');

  assert.match(experience, /class="experience-tabs flex flex-row space-x-1 p-1 bg-zinc-900 border border-zinc-700 rounded-none w-full mb-4"/);
  assert.match(experience, /px-3 py-1\.5 text-xs font-mono uppercase transition-all border border-transparent/);
  assert.match(experience, /bg-white text-black font-bold border-white/);
  assert.match(experience, /text-zinc-400 hover:text-white hover:bg-zinc-800/);
  assert.match(experience, /experience-inspector/);
  assert.match(experience, /text-white/);
});

test('scene fills the viewport and HOME resets the cube while triggering a wave', async () => {
  const [scene, navigation, background] = await Promise.all([
    read('src/components/3d/CubeScene.svelte'),
    read('src/components/ui/NavFAB.astro'),
    read('src/components/3d/WebGLBackground.js'),
  ]);

  assert.match(navigation, /data-cube-direction="HOME"/);
  assert.match(navigation, /trigger-bg-wave/);
  assert.match(scene, /direction === 'HOME'/);
  assert.match(scene, /targetEuler\.x = 0;/);
  assert.match(scene, /targetEuler\.y = 0;/);
  assert.match(scene, /z: 0/);
  assert.match(scene, /camera\.aspect = window\.innerWidth \/ window\.innerHeight;/);
  assert.match(scene, /webglRenderer\.setSize\(window\.innerWidth, window\.innerHeight/);
  assert.match(scene, /webglRenderer\.setPixelRatio\(Math\.min\(window\.devicePixelRatio, 2\)\)/);
  assert.match(scene, /position: fixed;/);
  assert.match(scene, /width: 100vw;/);
  assert.match(scene, /height: 100vh;/);
  assert.match(scene, /pointer-events: none;/);
  assert.match(background, /const GRID_SIZE = 35;/);
});
