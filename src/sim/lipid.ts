import Body from './body';
import LipidSim from './lipid-sim';
import Vector2 from './vector-2';

export default class Lipid extends Body {
  /* Lipid structure
   * A lipid has a head and a tail.
   * the head has radius r, the tail length t, total length is 2r+t
   * the center is r+t/2 units along the lipid
   * the head vector stores the position of the center of the head.
   * this is r units from one end point of the lipid, r+t units from the
   * tail end of the lipid and t/2 units from the center
   */

  // The position of the lipid head and tail
  head: Vector2;
  tail: Vector2;

  constructor(x: number, y: number, theta: number) {
    super(x, y, theta);

    this.head = new Vector2(0, 0);
    this.tail = new Vector2(0, 0);
    this.updatePosition();
  }

  // syncs the position of the helper vectors (eg head, tail) based on the current center position and tail angle (theta)
  updatePosition() {
    let cosT = Math.cos(this.theta);
    let sinT = Math.sin(this.theta);

    this.head.x = this.position.x - LipidSim.TAIL_HALFLENGTH * cosT;
    this.head.y = this.position.y + LipidSim.TAIL_HALFLENGTH * sinT;
    this.tail.x =
      this.position.x +
      (LipidSim.HEAD_RADIUS + LipidSim.TAIL_HALFLENGTH) * cosT;
    this.tail.y =
      this.position.y -
      (LipidSim.HEAD_RADIUS + LipidSim.TAIL_HALFLENGTH) * sinT;
  }

  iterate(t: number) {
    // update physics
    super.iterate(t);

    this.updatePosition();
  }

  intersects(other: Lipid) {
    let xLMin = Math.min(this.head.x, this.tail.x);
    let xLMax = Math.max(this.head.x, this.tail.x);
    let yLMin = Math.min(this.head.y, this.tail.y);
    let yLMax = Math.max(this.head.y, this.tail.y);

    let xOMin = Math.min(other.head.x, other.tail.x);
    let xOMax = Math.max(other.head.x, other.tail.x);
    let yOMin = Math.min(other.head.y, other.tail.y);
    let yOMax = Math.max(other.head.y, other.tail.y);

    if (xLMax < xOMin || xLMin > xOMax) {
      return false;
    }
    if (yLMax < yOMin || yLMin > yOMax) {
      return false;
    }

    return true;
  }
}
