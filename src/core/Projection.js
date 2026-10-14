// Local tangent-plane projection: [lon, lat] -> Cartesian metres.
// Axes: +X east, +Z south (so that Y is up in a right-handed Three.js frame), origin at the anchor.
const R = 6378137.0;
const D2R = Math.PI / 180;

export class Projection {
  constructor(lon0, lat0) {
    this.lon0 = lon0;
    this.lat0 = lat0;
    this.kx = R * D2R * Math.cos(lat0 * D2R);
    this.kz = R * D2R;
  }
  /** @returns {[number, number]} [x, z] metres */
  toXZ(lon, lat) {
    return [(lon - this.lon0) * this.kx, -(lat - this.lat0) * this.kz];
  }
  toLonLat(x, z) {
    return [this.lon0 + x / this.kx, this.lat0 - z / this.kz];
  }
}
