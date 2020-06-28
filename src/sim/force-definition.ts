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
    maxRadius: number,
    minRadius: number
  ) {
    this.maxMagnitude = maxMagnitude;
    this.minMagnitude = minMagnitude;
    this.maxRadius = maxRadius;
    this.minRadius = minRadius;
    this.rangeMagnitude = maxMagnitude - minMagnitude;
    this.rangeRadius = maxRadius - minRadius;
  }

  // Get the magnitude of this force at the given distance
  forceMagnitude(distance: number) {
    if (distance <= this.maxRadius) {
      return this.maxMagnitude;
    } else if (distance >= this.minRadius) {
      return this.minMagnitude;
    } else {
      return (
        this.minMagnitude +
        (this.rangeMagnitude * (distance - this.maxRadius)) / this.rangeRadius
      );
    }
  }

  // Get the vector of this force on the target, and write it to the dest vector
  forceVector(target: Vector2, dest: Vector2) {
    let distance = target.distance();
    let f = this.forceMagnitude(distance) / distance;
    dest.x = target.x * f;
    dest.y = target.y * f;
    return dest;
  }
}
