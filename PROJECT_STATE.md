# Project State

Architectural handoff for future agents working on the BangKumish portfolio.

## Project Architecture Overview

This project is a static portfolio built with Astro and Tailwind CSS. Astro owns the page shell, content collections, static generation, and the HTML face components. Svelte is used for the interactive 3D scene lifecycle. Three.js provides the scene graph, camera, animation loop, `WebGLRenderer`, and `CSS3DRenderer` integration. Astro content collections provide typed Markdown-backed project and experience records.

The portfolio uses a dual-renderer system:

- `WebGLRenderer` renders the ambient wireframe cube matrix and its animated background wave. It uses a transparent full-viewport canvas positioned behind the interface.
- `CSS3DRenderer` renders the portfolio faces as regular HTML elements positioned in 3D space. The faces remain accessible and interactive DOM content while being arranged as a cube around the central scene.
- `CubeScene.svelte` owns both renderers, the shared camera, the central cube group, resize behavior, face activation, animation, and navigation event handling.
- Tailwind utility classes are used for the newer inspector/tab layout, while the retro visual system is primarily defined in the global styles in `src/pages/index.astro` and component-local styles.

The application is configured as a static site in `astro.config.mjs` with the canonical site URL `https://bangkumish.github.io` and no `base` path because this is a GitHub user-site repository.

## 3D Cube Mapping Matrix

The face orientation is defined in `src/components/3d/CubeScene.svelte`. Each face is created from the matching `[data-face]` HTML element and positioned relative to the cube center.

| Direction | Cube orientation | Face component | Responsibility |
|---|---|---|---|
| FRONT | `(0, 0)` | `ProfileFace.astro` | Main profile, portrait, identity, role, and specialties. |
| RIGHT | `(+90 Y)` | `ProjectsFace.astro` | Project archive with a selected-project preview and project list. |
| LEFT | `(-90 Y)` | `ExperienceFace.astro` | Work history with filter tabs, selected-role summary, and employment records. |
| TOP | `(-90 X)` | `EducationFace.astro` | Education and certification records. |
| BOTTOM | `(+90 X)` | `SkillsFace.astro` | Skill groups and proficiency indicators. |
| BACK | `(180 Y)` | `ContactFace.astro` | Contact links and the transmission form. |

Implementation detail: the profile face is positioned at `[0, 0, FACE_RADIUS]`, projects at `[FACE_RADIUS, 0, 0]`, experience at `[-FACE_RADIUS, 0, 0]`, education at `[0, FACE_RADIUS, 0]`, skills at `[0, -FACE_RADIUS, 0]`, and contact at `[0, 0, -FACE_RADIUS]`.

## Key Components and State Management

### 3D components

- `src/components/3d/CubeScene.svelte`: Main client-side scene controller. Creates the Three.js scenes, camera, CSS3D cube group, WebGL renderer, CSS3D renderer, animation loop, responsive resize logic, navigation handling, and active-face state.
- `src/components/3d/CSS3DFaces.svelte`: Lightweight Svelte placeholder component retained in the scene markup; the actual face DOM is supplied by `#cube-face-source` in `src/pages/index.astro` and converted into `CSS3DObject` instances by `CubeScene.svelte`.
- `src/components/3d/WebGLBackground.js`: Three.js ambient background class. Creates the instanced wireframe cube matrix, updates its idle motion and radial wave, listens for wave events, and disposes its geometry/material/event listener.

### Face components

- `src/components/faces/ProfileFace.astro`: Front/profile face containing the portrait, name, role, introduction, and specialty signals.
- `src/components/faces/ProjectsFace.astro`: Project archive face with a two-column inspector: selected project preview on the left and scrollable project records on the right.
- `src/components/faces/ExperienceFace.astro`: Work log face with horizontal category tabs (`ALL`, `FULL-TIME`, `INTERNSHIP`, `CONTRACT`), a left selected-role summary, and a right filtered employment list.
- `src/components/faces/EducationFace.astro`: Education and certifications face with formal education and certificate records.
- `src/components/faces/SkillsFace.astro`: Capability matrix face grouping technologies into languages, interfaces, systems, and specialties.
- `src/components/faces/ContactFace.astro`: Contact face with email/social links and the configurable Formspree form.

### Navigation and events

Navigation is coordinated through browser `CustomEvent` instances rather than direct component coupling:

- `'cube-navigate'`: Dispatched by `NavFAB.astro` with `{ detail: { direction } }`. `CubeScene.svelte` listens for it and passes the direction to `rotateTo()`.
- `'trigger-bg-wave'`: Dispatched by clickable FAB controls, including the center HOME button. `WebGLBackground.js` listens for it and starts the radial background wave.
- `'cube-face-change'`: Dispatched by `CubeScene.svelte` whenever the face with the strongest forward-facing normal changes. The event includes `{ detail: { face } }`.

`NavFAB.astro` maps the four directional controls to `UP`, `DOWN`, `LEFT`, and `RIGHT`. Arrow keys dispatch the same directional commands without triggering the background wave. The center `+` button dispatches `HOME` and triggers the wave.

`CubeScene.svelte` maintains `targetEuler` state. Directional commands increment the X or Y target by 90 degrees. `HOME` sets X, Y, and Z to zero, then GSAP animates the central cube back to the initial profile orientation. `updateActiveFace()` updates `is-active` and `aria-hidden` on every face during the animation.

## Recent Changes and Fixes Applied

### Experience filter layout

- Replaced the old filter layout with a horizontal shadcn-style tab bar.
- Added the requested dark zinc container styling: horizontal flex layout, compact padding, zinc background/border, full width, and bottom spacing.
- Added compact monospace tab styling with explicit active and inactive states.
- Added `role="tablist"`, `role="tab"`, and `aria-selected` state updates.
- Added an `experience-face` four-row layout so the tabs occupy their own row and cannot obscure the inspector content.
- Preserved the dual-pane inspector: selected-role summary/badge on the left and a scrollable filtered employment list on the right.
- Explicitly applied dark backgrounds and white text to the inspector panels for reliable contrast.

### Project inspector

- The existing project face uses the same desktop dual-pane inspector pattern: preview and selected-record metadata on the left, scrollable project records on the right.
- Project hover, focus, and click update the preview image, title, summary, code, and technology tags.

### Full-viewport WebGL background

- The WebGL canvas is forced to `position: fixed`, `top: 0`, `left: 0`, `width: 100vw`, `height: 100vh`, `z-index: 0`, and `pointer-events: none`.
- Renderer sizing and pixel ratio are applied during initialization through the shared resize function and again whenever the window resizes.
- Camera aspect ratio is recalculated from `window.innerWidth / window.innerHeight` and the projection matrix is updated after every resize.
- The background instanced grid was expanded from `20x20` to `35x35` cubes and spacing was widened to improve coverage on ultra-wide and high-resolution displays.

### HOME navigation reset

- Converted the center D-pad `+` indicator from a passive `<span>` into an accessible button.
- The center button sends the `HOME` navigation command.
- `HOME` resets the animated cube target Euler coordinates to `(0, 0, 0)`, returning to the Profile face.
- HOME also dispatches `'trigger-bg-wave'` through the shared FAB dispatch logic.

## Known Technical Debt and Next Steps

1. Add browser-level visual regression coverage for desktop ultra-wide, standard desktop, tablet, and mobile dimensions. The current tests validate source contracts and Astro build health but do not inspect rendered pixels or actual CSS3D/WebGL layering in a browser.
2. Consider splitting or lazily loading the Three.js client chunk. The current production build reports a chunk-size warning for the generated `CubeScene` bundle, although the build succeeds.
3. Improve scene resource cleanup and accessibility testing around the CSS3D face source lifecycle. In particular, verify focus behavior while faces are hidden and confirm that reduced-motion preferences are consistently respected by GSAP cube rotations.

## Local Execution and Build Instructions

From the project root:

```sh
npm install
npm run dev
```

The development server normally runs at the Astro-provided local URL, commonly `http://localhost:4321`.

Run the project checks and production build with:

```sh
npm test
# Equivalent package script: npm run test
# This runs: astro check && astro build
```

Preview the generated static export locally:

```sh
npm run build
npm run preview
```

The production output is written to `dist/`.

### GitHub Actions deployment

Deployment is defined in `.github/workflows/deploy.yml` and runs automatically on pushes to `main`. It can also be started manually with the GitHub Actions `workflow_dispatch` trigger.

The workflow:

1. Checks out the repository.
2. Installs Node 20 and runs `npm ci`.
3. Runs `npm run build`.
4. Uploads `dist/` as a GitHub Pages artifact.
5. Deploys the artifact with `actions/deploy-pages`.

To deploy through GitHub Actions:

```sh
git add .
git commit -m "docs: add project state handoff"
git push origin main
```

Before the first deployment, GitHub repository settings must use **Settings -> Pages -> Source: GitHub Actions**. The optional `PUBLIC_FORMSPREE_ENDPOINT` repository secret is passed into the build by the workflow for contact-form delivery.
