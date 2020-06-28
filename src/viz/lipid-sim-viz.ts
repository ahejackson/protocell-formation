import LipidSim from '../sim/lipid-sim';
import Lipid from '../sim/lipid';

const forceColors = ['blue', 'red'];

// Viz Settings
export const settings = {
  showTails: false,
  showForces: true,
  showTotalForces: true,
};

// Draw the current state of the simulation
export const drawSim = (context: CanvasRenderingContext2D, sim: LipidSim) => {
  context.fillStyle = 'lightgray';
  context.fillRect(0, 0, sim.WIDTH, sim.HEIGHT);

  drawIterations(context, sim);
  sim.lipids.forEach((lipid) => drawLipid(context, lipid));
};

const drawLipid = (context: CanvasRenderingContext2D, lipid: Lipid) => {
  context.beginPath();
  context.arc(
    lipid.position.x,
    lipid.position.y,
    LipidSim.HEAD_RADIUS,
    0,
    2 * Math.PI
  );
  context.fillStyle = 'red';
  context.fill();
  context.strokeStyle = 'gray';
  context.stroke();

  // If we were drawing the tails...
  if (settings.showTails) {
    context.beginPath();
    context.moveTo(lipid.head.x, lipid.head.y);
    context.lineTo(lipid.tail.x, lipid.tail.y);
    context.stroke();
  }

  if (settings.showForces) {
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      context.beginPath();
      context.moveTo(lipid.position.x, lipid.position.y);
      context.lineTo(
        lipid.position.x + lipid.forces[i].x,
        lipid.position.y + lipid.forces[i].y
      );
      context.strokeStyle = forceColors[i];
      context.stroke();
    }
  }

  if (settings.showTotalForces) {
    context.beginPath();
    context.moveTo(lipid.position.x, lipid.position.y);
    context.lineTo(
      lipid.position.x + lipid.force.x,
      lipid.position.y + lipid.force.y
    );
    context.strokeStyle = 'white';
    context.stroke();
  }
};

const drawIterations = (context: CanvasRenderingContext2D, sim: LipidSim) => {
  context.fillStyle = 'black';
  context.font = '16px Helvetica';
  context.fillText(`t = ${sim.t}`, 20, 20);
};
