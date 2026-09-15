# 🥔 Lay3d: The Absurdly Fun Lays Chip Eating Simulator

> *Born from an absolute dare to make something ridiculous with Three.js*
### ⚠ Note : Sometimes the link may deactivate! every time i come back i activate it
## What Even Is This?

Lay3d is a 3D first-person simulator where you do one thing and one thing only: **walk around and eat Lays chips**. That's it. That's the whole game. No plot. No missions. No sense. Just you, a virtual Lays bag, and the satisfying crunch of digital snacking.

Someone threw out a ridiculous prompt to prove we don't use AI to code. We said yes. Here we are.

## Features

- **First-Person Chip Eating** – Move around freely with WASD controls and eat chips by clicking
- **Physics-Based Chip Particles** – When you eat a chip, it actually explodes out with gravity and rotation
- **Satisfying Sound Effects** – Hear the crunch of each chip (if you have audio enabled)
- **Chip Counter** – Keep track of your shameful eating habits with a persistent counter
- **Smooth Camera Controls** – Pointer lock support for immersive 3D navigation
- **Dynamic Lighting** – Golden directional light and ambient lighting make the chips look almost edible
- **3D Grid Environment** – Walk around on an infinite-feeling grid floor

## How to Play

1. **Move** – Use `W`, `A`, `S`, `D` to walk around
2. **Look Around** – Click anywhere to lock your pointer, then move your mouse to look
3. **Eat** – Click to grab and eat a Lays chip from the bag
4. **Escape** – Press `ESC` to unlock your pointer
5. **Keep Score** – Watch as your chip counter grows with existential dread

## Tech Stack

Built with **TypeScript** and **Three.js** for the 3D rendering magic. Bundled with **Vite** for blazing fast development and production builds.

```json
{
  "three": "^0.160.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0"
}
```

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the dev server with hot reload:

```bash
npm run dev
```

Then open your browser and head to `http://localhost:5173` (or whatever Vite tells you).

### Building for Production

```bash
npm run build
```

This will compile your TypeScript and bundle everything for deployment.

## Project Structure

- **game.ts** – The entire game logic lives here. Three.js setup, input handling, particle effects, animation loop—all in one file of beautiful chaos
- **index.html** – Minimal HTML entry point with styling for the crosshair and UI counter
- **package.json** – Dependencies and scripts

## Under the Hood

### Camera & Controls

The game uses pointer lock for immersive FPS-style controls. Your camera position is tracked and updated based on keyboard input, with proper forward/right vector calculations relative to where you're looking.

### Hand & Bag Animation

When you click to eat, a hand animates from off-screen, grabs a chip from the bag, and retracts. The bag sits in your view as a 3D red mesh with a golden Lays logo.

### Chip Particles

Each eaten chip spawns as a physics-simulated particle. They have:
- Velocity with random scatter
- Rotation speeds on all axes
- Gravity simulation (9.8 m/s² for realism, ironically)
- Gradual fade-out and removal from the scene

### Audio

A crunching sound plays whenever you successfully eat a chip. It's wired up to actually reset and play each time, so you get that satisfying crunch repeatedly.

## Performance

- **WebGL Rendering** – Uses high-performance power preference
- **Shadow Mapping** – Dynamic shadows from the directional light
- **Fog** – Exponential fog adds depth and hides the grid at distance
- **Antialiasing** – Smooth edges throughout

## Why This Exists

Honestly? Pure absurdity. Someone challenged us to make a game where you just walk around eating chips, and we went full-send with it. No regrets. Sometimes the best projects are the ones that make absolutely no sense.

## License

Do whatever you want with it. Eat virtual chips in peace. 🥔

---

**Made by:** Shahadah Studios Elite  
**Status:** Complete and unapologetically ridiculous  
**Best played at:** Maximum volume with maximum crunch
