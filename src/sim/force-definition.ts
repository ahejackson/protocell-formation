import LipidSim from './lipid-sim';
import Vector2 from './vector-2';

export default class ForceDefinition {
  // the maximum magnitude of the force
  readonly maxMagnitude: number;

  // minimum magnitude of the force
  readonly minMagnitude: number;

  // the radius of the range within which the force maintains the maximum magnitude
  readonly maxRadius: number;

  // the radius of the range within which the force mantains the minimum magnitude
  readonly minRadius: number;

  readonly rangeMagnitude: number;
  readonly rangeRadius: number;

  constructor(
    maxMagnitude: number,
    minMagnitude: number,
    minRadius: number,
    maxRadius: number
  ) {
    this.maxMagnitude = maxMagnitude;
    this.minMagnitude = minMagnitude;
    this.maxRadius = maxRadius;
    this.minRadius = minRadius;
    this.rangeMagnitude = maxMagnitude - minMagnitude;
    this.rangeRadius = maxRadius - minRadius;
  }

  // Get the magnitude of this force at the given distance
  magnitude(distance: number) {
    if (distance <= this.minRadius) {
      return this.maxMagnitude;
    } else if (distance >= this.maxRadius) {
      return this.minMagnitude;
    } else {
      return (
        this.maxMagnitude -
        (this.rangeMagnitude * (distance - this.minRadius)) / this.rangeRadius
      );
    }
  }

  // Get the vector of the force from one vector to another, and write it to the dest vector
  forceVector(from: Vector2, to: Vector2, dest: Vector2) {
    dest.x = to.x - from.x;
    dest.y = to.y - from.y;
    let distance = dest.magnitude();
    let f = this.magnitude(distance) / distance;
    return dest.multLocal(f);
  }

  torque(position: Vector2, force: Vector2, actionPoint: Vector2) {
    let forceOffset = position.offset(actionPoint);
    let angle = this.angleBetween(forceOffset, force);
    return force.magnitude() * forceOffset.magnitude() * Math.sin(angle);
  }

  /* angle between two vectors (when drawn from same origin */
  angleBetween(angleFrom: Vector2, angleTo: Vector2) {
    let a =
      -Math.atan2(angleTo.y, angleTo.x) + Math.atan2(angleFrom.y, angleFrom.x);
    a %= LipidSim.TWO_PI;
    if (a > Math.PI) {
      a -= LipidSim.TWO_PI;
    }
    if (a < -Math.PI) {
      a += LipidSim.TWO_PI;
    }
    return a;
  }
}
