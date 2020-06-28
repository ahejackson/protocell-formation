import LipidSim from './sim/lipid-sim';
import * as viz from './viz/lipid-sim-viz';
import Stats from 'stats.js';

// Sim Settings
const timestep = 0.1;
let running = false;
let sim: LipidSim;
let ctx: CanvasRenderingContext2D;
let stats: Stats;

// Init
const init = () => {
  // Get references to the canvas
  const canvas = document.getElementById(
    'awesome-simple-lipids'
  )! as HTMLCanvasElement;
  ctx = canvas.getContext('2d')!;

  // Create the sim
  sim = new LipidSim();

  // Create the stats
  stats = new Stats();
  stats.showPanel(1);
  document.body.appendChild(stats.dom);

  viz.drawSim(ctx, sim);
};

// Update loop
const updateAndRender = () => {
  stats.begin();
  sim.iterate(timestep);
  viz.drawSim(ctx, sim);
  stats.end();

  if (running) {
    window.requestAnimationFrame(updateAndRender);
  }
};

// Setup keyboard controls
document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    running = !running;

    if (running) {
      window.requestAnimationFrame(updateAndRender);
    }
  }

  if (event.code === 'Digit1') {
    viz.settings.showTails = !viz.settings.showTails;
    window.requestAnimationFrame(() => viz.drawSim(ctx, sim));
  }

  if (event.code === 'Digit2') {
    viz.settings.showForces = !viz.settings.showForces;
    window.requestAnimationFrame(() => viz.drawSim(ctx, sim));
  }

  if (event.code === 'Digit3') {
    viz.settings.showTotalForces = !viz.settings.showTotalForces;
    window.requestAnimationFrame(() => viz.drawSim(ctx, sim));
  }

  if (event.code === 'KeyF') {
    sim.iterate(timestep);
    viz.drawSim(ctx, sim);
  }
});

init();
console.log('A');
