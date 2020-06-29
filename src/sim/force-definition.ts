import LipidSim from './lipid-sim';
import Vector2 from './vector-2';

export default class ForceDefinition {
  // the maximum strength of the force
  readonly maxStrength: number;

  // minimum strength of the force
  readonly minStrength: number;

  // the radius of the range within which the force is at maximum strength
  readonly minRadius: number;

  // the range over which the strength of the force reduces from max to min
  readonly falloffRange: number;

  readonly rangeStrength: number;

  // the radius of the range beyond which the force is at minimum strength
  readonly maxRadius: number;

  constructor(
    maxStrength: number,
    minStrength: number,
    minRadius: number,
    falloffRange: number
  ) {
    this.maxStrength = maxStrength;
    this.minStrength = minStrength;
    this.minRadius = minRadius;
    this.falloffRange = falloffRange;

    this.maxRadius = minRadius + falloffRange;
    this.rangeStrength = maxStrength - minStrength;
  }

  // Get the strength of this force at the given distance
  strength(distance: number) {
    if (distance <= this.minRadius) {
      return this.maxStrength;
    } else if (distance >= this.maxRadius) {
      return this.minStrength;
    } else {
      return (
        this.maxStrength -
        (this.rangeStrength * (distance - this.minRadius)) / this.falloffRange
      );
    }
  }

  // Get the vector of the force from one vector to another, and write it to the dest vector
  forceVector(from: Vector2, to: Vector2, dest: Vector2) {
    dest.x = to.x - from.x;
    dest.y = to.y - from.y;
    let distance = dest.magnitude();
    let f = this.strength(distance) / distance;
    return dest.multLocal(f);
  }

  torque(position: Vector2, force: Vector2, actionPoint: Vector2) {
    let forceOffset = position.offset(actionPoint);
    let angle = this.angleBetween(forceOffset, force);
    return force.magnitude() * forceOffset.magnitude() * Math.sin(angle);
  }

  /* angle between two vectors (when drawn from same origin) */
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
