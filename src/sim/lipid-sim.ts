import ForceDefinition from './force-definition';
import Lipid from './lipid';
import Vector2 from './vector-2';

export default class LipidSim {
  static readonly TWO_PI = Math.PI * 2;
  static readonly NUM_FORCES = 9;

  // These are really parameters
  static readonly FRICTION_LINEAR = 1;
  static readonly FRICTION_ANGULAR = 1;
  static readonly STOCHASTIC_LINEAR = 0.1;
  static readonly STOCHASTIC_ANGULAR = 0.1;

  static readonly HEAD_RADIUS = 5;
  static readonly TAIL_HALFLENGTH = 15;
  static readonly TAIL_LENGTH = LipidSim.TAIL_HALFLENGTH * 2;
  static readonly LENGTH = LipidSim.HEAD_RADIUS * 2 + LipidSim.TAIL_LENGTH;
  static readonly ROTATIONAL_INTERTIA = (2 * LipidSim.LENGTH) / 12.0;

  // parameters
  readonly width: number;
  readonly height: number;
  readonly numLipids: number;

  // state
  forceDefinitions: ForceDefinition[] = [];
  lipids: Lipid[];
  iterations = 1;
  t = 0.002;

  constructor(width: number, height: number, numLipids: number) {
    this.width = width;
    this.height = height;
    this.numLipids = numLipids;

    // setup the forces
    this.forceDefinitions[0] = new ForceDefinition(40, 0.4, 15, 15); // blue
    this.forceDefinitions[1] = new ForceDefinition(-30, 0, 30, 0.001); // red
    this.forceDefinitions[2] = new ForceDefinition(-30, -0.6, 30, 30); // yellow
    this.forceDefinitions[3] = new ForceDefinition(-30, -0.6, 30, 30); // green
    this.forceDefinitions[4] = new ForceDefinition(40, 0.4, 40, 40); // cyan
    this.forceDefinitions[5] = new ForceDefinition(-1600, 0, 15, 0.001);
    this.forceDefinitions[6] = new ForceDefinition(-1600, 0, 15, 0.001);

    // add lipids
    this.lipids = this.createLipids(this.numLipids, this.width, this.height);
  }

  createLipids(n: number, width: number, height: number) {
    const lipids: Lipid[] = [];
    let intersects = false;
    let lipid: Lipid;

    for (let i = 0; i < n; i++) {
      // attempt to place a randomly generated lipid
      while (true) {
        lipid = new Lipid(
          width * Math.random(),
          height * Math.random(),
          LipidSim.TWO_PI * Math.random()
        );

        intersects = false;

        for (let j = 0; j < i; j++) {
          if (lipid.intersects(lipids[j])) {
            intersects = true;
            break;
          }
        }

        if (!intersects) {
          lipids[i] = lipid;
          break;
        }
      }
    }
    return lipids;
  }

  // advance the sim one timestep
  iterate() {
    // reset forces
    for (let i = 0; i < this.numLipids; i++) {
      this.lipids[i].resetForces();
    }

    // calculate forces
    for (let i = 0; i < this.numLipids; i++) {
      for (let j = 0; j < this.numLipids; j++) {
        if (i != j) {
          this.updateForces(this.lipids[i], this.lipids[j]);
        }
      }
    }

    // update physics
    for (let i = 0; i < this.numLipids; i++) {
      this.lipids[i].iterate(this.t);
    }

    this.iterations++;
  }

  updateForces(l1: Lipid, l2: Lipid) {
    const tmp = new Vector2(0, 0);

    // force 1: head-head attraction
    l1.forces[0].addLocal(
      this.forceDefinitions[0].forceVector(l1.head, l2.head, tmp)
    );
    l1.torques[0] += this.forceDefinitions[0].torque(l1.position, tmp, l1.head);

    // force 2: head-head repulsion
    l1.forces[1].addLocal(
      this.forceDefinitions[1].forceVector(l1.head, l2.head, tmp)
    );
    l1.torques[1] += this.forceDefinitions[1].torque(l1.position, tmp, l1.head);

    // force 3: tail-head repulsion
    l1.forces[2].addLocal(
      this.forceDefinitions[2].forceVector(l1.head, l2.tail, tmp)
    );
    l1.torques[2] += this.forceDefinitions[2].torque(l1.position, tmp, l1.head);

    // force 4: head-tail repulsion
    l1.forces[3].addLocal(
      this.forceDefinitions[3].forceVector(l1.tail, l2.head, tmp)
    );
    l1.torques[3] += this.forceDefinitions[3].torque(l1.position, tmp, l1.tail);

    // force 5: tail-tail attraction
    l1.forces[4].addLocal(
      this.forceDefinitions[4].forceVector(l1.tail, l2.tail, tmp)
    );
    l1.torques[4] += this.forceDefinitions[4].torque(l1.position, tmp, l1.tail);

    // two force 6s
    l1.forces[5].addLocal(
      this.forceDefinitions[5].forceVector(
        l1.head,
        this.shortestVector(l1.head, l2),
        tmp
      )
    );
    l1.torques[5] += this.forceDefinitions[5].torque(l1.position, tmp, l1.head);

    l1.forces[6].addLocal(
      this.forceDefinitions[5].forceVector(
        l1.tail,
        this.shortestVector(l1.tail, l2),
        tmp
      )
    );
    l1.torques[6] += this.forceDefinitions[5].torque(l1.position, tmp, l1.tail);

    // two reaction force 7s
    let offset = this.shortestVector(l2.head, l1);
    l1.forces[7].addLocal(
      this.forceDefinitions[6].forceVector(offset, l2.head, tmp)
    );
    l1.torques[7] += this.forceDefinitions[6].torque(l1.position, tmp, offset);

    offset = this.shortestVector(l2.tail, l1);
    l1.forces[8].addLocal(
      this.forceDefinitions[6].forceVector(offset, l2.tail, tmp)
    );
    l1.torques[8] += this.forceDefinitions[6].torque(l1.position, tmp, offset);
  }

  /* returns the vector for the shortest line from the point to the given lipid */
  shortestVector(point: Vector2, lipid: Lipid) {
    let tX = lipid.tail.x - lipid.head.x; // tail x
    let tY = lipid.tail.y - lipid.head.y; // tail y
    let r = 0;

    // calculate intersection of the infinite extension of rod and the perpendicular line
    if (tX == 0 && tY == 0) {
      // should never happen
      r = 0;
    } else if (tX == 0 && tY != 0) {
      r = (point.y - lipid.head.y) / tY;
    } else if (tY == 0 && tX != 0) {
      r = (point.x - lipid.head.x) / tX;
    } else {
      r =
        (point.x * tX - lipid.head.x * tX + point.y * tY - lipid.head.y * tY) /
        (tX * tX + tY * tY);
    }

    let result = new Vector2(0, 0);
    if (r <= 0) {
      result.set(lipid.head);
    } else if (r >= 1) {
      result.set(lipid.tail);
    } else {
      result.x = lipid.head.x + r * tX;
      result.y = lipid.head.y + r * tY;
    }
    return result;
  }
}
