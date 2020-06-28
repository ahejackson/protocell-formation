import LipidSim from './lipid-sim';
import Vector2 from './vector-2';

export default class Body {
  position: Vector2; // center of body
  theta: number; // angle of rotation

  force: Vector2; // NB assumed to have unit mass so force = acceleration
  velocity: Vector2;

  torque: number;
  angularVelocity: number;

  forces: Vector2[] = []; // The individual forces
  torques: number[] = [];

  constructor(x: number, y: number, theta: number) {
    this.position = new Vector2(x, y);
    this.theta = theta;

    // set forces
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.forces[i] = new Vector2(0, 0);
      this.torques[i] = 0;
    }

    // set physics stuff
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.torque = 0;
    this.angularVelocity = 0;
  }

  resetForces() {
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.forces[i].x = 0;
      this.forces[i].y = 0;
      this.torques[i] = 0;
    }
    this.force.x = 0;
    this.force.y = 0;
    this.torque = 0;
  }

  iterate(t: number) {
    // linear movement

    // 1. sum forces
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.force.addLocal(this.forces[i]);
    }

    // Apply friction damping
    this.force.x -= LipidSim.FRICTION_LINEAR * this.velocity.x;
    this.force.y -= LipidSim.FRICTION_LINEAR * this.velocity.y;

    // 2. forward Euler integration of velocity
    this.velocity.x += this.force.x * t;
    this.velocity.y += this.force.y * t;

    // 3. forward Euler integration of position
    this.position.x += 0.5 * this.force.x * t * t + this.velocity.x * t;
    this.position.y += 0.5 * this.force.y * t * t + this.velocity.y * t;

    // Angular movement
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.torque += this.torques[i];
    }
    this.torque -= this.angularVelocity * LipidSim.FRICTION_ANGULAR;
    this.angularVelocity += t * (this.torque / LipidSim.ROTATIONAL_INTERTIA);
    this.theta +=
      0.5 * (this.torque / LipidSim.ROTATIONAL_INTERTIA) * t * t +
      this.angularVelocity * t;
  }
}
