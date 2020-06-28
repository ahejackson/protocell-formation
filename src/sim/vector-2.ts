export default class Vector2 {
  constructor(public x: number, public y: number) {}

  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  addLocal(v: Vector2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  addScaled(v: Vector2, scale: number) {
    this.x += scale * v.x;
    this.y += scale * v.y;
    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  mult(n: number) {
    return new Vector2(this.x * n, this.y * n);
  }

  multLocal(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  // Returns a new Vector from this vector to the other vector
  offset(other: Vector2) {
    return new Vector2(other.x - this.x, other.y - this.y);
  }

  set(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
}
