import LipidSim from './sim/lipid-sim';
import * as viz from './viz/lipid-sim-viz';

// Sim Settings
let running = false;
let stepCount = 2;

let sim: LipidSim;
let ctx: CanvasRenderingContext2D;

// Init
const init = () => {
  // Get references to the canvas
  const canvas = document.getElementById('lipids')! as HTMLCanvasElement;
  ctx = canvas.getContext('2d')!;

  // Create the sim
  sim = new LipidSim(900, 900, 200);

  // Show the sim
  viz.drawSim(ctx, sim);
};

// Update loop
const updateAndRender = () => {
  // stats.begin();
  for (let i = 0; i < stepCount; i++) {
    sim.iterate();
  }
  viz.drawSim(ctx, sim);
  // stats.end();

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
    for (let i = 0; i < stepCount; i++) {
      sim.iterate();
    }
    viz.drawSim(ctx, sim);
  }
});

init();
