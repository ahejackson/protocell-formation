import ForceDefinition from './force-definition';
import Lipid from './lipid';
import Vector2 from './vector-2';

export default class LipidSim {
  static readonly NUM_FORCES = 2;
  static readonly HEAD_RADIUS = 5;
  static readonly TAIL_LENGTH = 30;

  // parameters
  readonly WIDTH = 900;
  readonly HEIGHT = 600;
  readonly NUM_LIPIDS = 100;

  // state
  forceDefinitions: ForceDefinition[] = [];
  lipids: Lipid[] = [];
  t = 0;

  constructor() {
    // setup the forces
    this.forceDefinitions[0] = new ForceDefinition(40, 0.4, 15, 2 * 15);
    this.forceDefinitions[1] = new ForceDefinition(-30, 0, 30, 30 + 0.001);

    // add lipids
    for (let i = 0; i < this.NUM_LIPIDS; i++) {
      this.lipids[i] = new Lipid(
        this.WIDTH * Math.random(),
        this.HEIGHT * Math.random(),
        0
      );
    }
  }

  // advance the sim one timestep
  iterate(timestep: number) {
    // calculate forces
    const target = new Vector2(0, 0);
    const dest = new Vector2(0, 0);

    // calculate forces
    for (let i = 0; i < this.NUM_LIPIDS; i++) {
      // reset forces
      this.lipids[i].resetForces();

      for (let j = 0; j < this.NUM_LIPIDS; j++) {
        if (i != j) {
          target.x = this.lipids[j].position.x - this.lipids[i].position.x;
          target.y = this.lipids[j].position.y - this.lipids[i].position.y;

          this.lipids[i].addForce(
            0,
            this.forceDefinitions[0].forceVector(target, dest)
          );
          this.lipids[i].addForce(
            1,
            this.forceDefinitions[1].forceVector(target, dest)
          );
        }
      }
    }

    // update positions of all lipids
    for (let i = 0; i < this.NUM_LIPIDS; i++) {
      this.lipids[i].iterate(timestep);
    }

    this.t++;
  }
}
