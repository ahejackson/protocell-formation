import LipidSim from './lipid-sim';
import Vector2 from './vector-2';

export default class Lipid {
  force: Vector2; // NB assumed to have unit mass so force = acceleration
  velocity: Vector2;
  position: Vector2;

  // The individual forces
  forces: Vector2[] = [];

  angle: number;

  // The position of the lipid head and tail
  head: Vector2;
  tail: Vector2;

  constructor(x: number, y: number, angle: number) {
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.position = new Vector2(x, y);

    this.angle = angle;

    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.forces[i] = new Vector2(0, 0);
    }

    this.head = new Vector2(x, y);
    this.tail = new Vector2(
      x + (LipidSim.HEAD_RADIUS + LipidSim.TAIL_LENGTH) * Math.cos(angle),
      y + (LipidSim.HEAD_RADIUS + LipidSim.TAIL_LENGTH) * Math.sin(angle)
    );
  }

  addForce(index: number, f: Vector2) {
    this.forces[index].x += f.x;
    this.forces[index].y += f.y;
  }

  resetForces() {
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.forces[i].x = 0;
      this.forces[i].y = 0;
    }
    this.force.x = 0;
    this.force.y = 0;
  }

  iterate(t: number) {
    //this.angle += 0.01;

    // Sum the forces
    for (let i = 0; i < LipidSim.NUM_FORCES; i++) {
      this.force.add(this.forces[i]);
    }

    // update the velocity and position based on the force
    this.velocity.addScaled(this.force, t);
    this.position.addScaled(this.velocity, t);
    this.position.addScaled(this.force, 0.5 * t * t);

    this.head.set(this.position);
    this.tail.x =
      this.head.x +
      (LipidSim.HEAD_RADIUS + LipidSim.TAIL_LENGTH) * Math.cos(this.angle);
    this.tail.y =
      this.head.y +
      (LipidSim.HEAD_RADIUS + LipidSim.TAIL_LENGTH) * Math.sin(this.angle);
  }
}
