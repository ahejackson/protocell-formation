export default class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
  }

  addScaled(v: Vector2, scale: number) {
    this.x += scale * v.x;
    this.y += scale * v.y;
  }

  distance() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distanceSquared() {
    return this.x * this.x + this.y * this.y;
  }

  set(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
  }
}
