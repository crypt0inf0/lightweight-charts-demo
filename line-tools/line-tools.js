function _t(h) {
  if (h === void 0)
    throw new Error("Value is undefined");
  return h;
}
class wt {
  _chart = void 0;
  _series = void 0;
  requestUpdate() {
    this._requestUpdate && this._requestUpdate();
  }
  _requestUpdate;
  attached({ chart: t, series: e, requestUpdate: i }) {
    this._chart = t, this._series = e, this._series.subscribeDataChanged(this._fireDataUpdated), this._requestUpdate = i, this.requestUpdate();
  }
  detached() {
    this._series?.unsubscribeDataChanged(this._fireDataUpdated), this._chart = void 0, this._series = void 0, this._requestUpdate = void 0;
  }
  get chart() {
    return _t(this._chart);
  }
  get series() {
    return _t(this._series);
  }
  // This method is a class property to maintain the
  // lexical 'this' scope (due to the use of the arrow function)
  // and to ensure its reference stays the same, so we can unsubscribe later.
  _fireDataUpdated = (t) => {
    this.dataUpdated && this.dataUpdated(t);
  };
}
function rt(h, t, e) {
  const i = t.timeScale();
  return h.map((s) => ({
    x: i.logicalToCoordinate(s.logical),
    y: e.priceToCoordinate(s.price)
  }));
}
function T(h, t, e) {
  return {
    x: t.timeScale().logicalToCoordinate(h.logical),
    y: e.priceToCoordinate(h.price)
  };
}
function R(h, t, e) {
  const i = (t.x - e.x) ** 2 + (t.y - e.y) ** 2;
  if (i === 0) return Math.hypot(h.x - t.x, h.y - t.y);
  let s = ((h.x - t.x) * (e.x - t.x) + (h.y - t.y) * (e.y - t.y)) / i;
  return s = Math.max(0, Math.min(1, s)), Math.hypot(h.x - (t.x + s * (e.x - t.x)), h.y - (t.y + s * (e.y - t.y)));
}
function Ct(h, t) {
  const e = Math.min(t.x1, t.x2), i = Math.max(t.x1, t.x2), s = Math.min(t.y1, t.y2), o = Math.max(t.y1, t.y2);
  return h.x >= e && h.x <= i && h.y >= s && h.y <= o;
}
function Vt(h, t, e) {
  return Math.hypot(h.x - t.x, h.y - t.y) <= e;
}
function ct(h, t) {
  h.strokeStyle = t.lineColor, h.lineWidth = t.width, t.lineJoin && (h.lineJoin = t.lineJoin), t.lineCap && (h.lineCap = t.lineCap), t.globalAlpha !== void 0 && (h.globalAlpha = t.globalAlpha);
}
function ht(h) {
  h.lineJoin = "miter", h.lineCap = "butt", h.globalAlpha = 1, h.setLineDash([]);
}
function E(h, t) {
  const e = [
    [],
    // 0: Solid
    [2, 2],
    // 1: Dotted
    [6, 6],
    // 2: Dashed
    [10, 10],
    // 3: Large Dashed
    [2, 10]
    // 4: Sparse Dotted
  ], i = e[t] || e[0];
  h.setLineDash(i);
}
function y(h, t, e, i = "#FFFFFF", s = "#2962FF") {
  const o = h.context;
  o.fillStyle = i, o.strokeStyle = s, o.lineWidth = 2, o.beginPath(), o.arc(t, e, 6 * h.horizontalPixelRatio, 0, 2 * Math.PI), o.fill(), o.stroke();
}
function g(h, t) {
  return Math.round(h * t);
}
class w {
  x;
  y;
  constructor(t, e) {
    this.x = t, this.y = e;
  }
  add(t) {
    return new w(this.x + t.x, this.y + t.y);
  }
  addScaled(t, e) {
    return new w(this.x + e * t.x, this.y + e * t.y);
  }
  subtract(t) {
    return new w(this.x - t.x, this.y - t.y);
  }
  dotProduct(t) {
    return this.x * t.x + this.y * t.y;
  }
  crossProduct(t) {
    return this.x * t.y - this.y * t.x;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  scaled(t) {
    return new w(this.x * t, this.y * t);
  }
  normalized() {
    const t = this.length();
    return t === 0 ? new w(0, 0) : this.scaled(1 / t);
  }
  transposed() {
    return new w(-this.y, this.x);
  }
  clone() {
    return new w(this.x, this.y);
  }
}
class Lt {
  min;
  max;
  constructor(t, e) {
    this.min = new w(Math.min(t.x, e.x), Math.min(t.y, e.y)), this.max = new w(Math.max(t.x, e.x), Math.max(t.y, e.y));
  }
}
function z(h, t) {
  return Math.abs(h.x - t.x) < 1e-6 && Math.abs(h.y - t.y) < 1e-6;
}
function At(h, t, e) {
  return { a: h, b: t, c: e };
}
function Ft(h, t) {
  return At(h.y - t.y, t.x - h.x, h.x * t.y - t.x * h.y);
}
function O(h, t) {
  return [h, t];
}
function dt(h, t) {
  for (let e = 0; e < h.length; e++)
    if (z(h[e], t))
      return !1;
  return h.push(t), !0;
}
function Ot(h, t) {
  if (Math.abs(h.a) < 1e-6) {
    const o = -h.c / h.b;
    return t.min.y <= o && o <= t.max.y ? O(new w(t.min.x, o), new w(t.max.x, o)) : null;
  }
  if (Math.abs(h.b) < 1e-6) {
    const o = -h.c / h.a;
    return t.min.x <= o && o <= t.max.x ? O(new w(o, t.min.y), new w(o, t.max.y)) : null;
  }
  const e = [], i = function(o) {
    const l = -(h.c + h.a * o) / h.b;
    t.min.y <= l && l <= t.max.y && dt(e, new w(o, l));
  }, s = function(o) {
    const l = -(h.c + h.b * o) / h.a;
    t.min.x <= l && l <= t.max.x && dt(e, new w(l, o));
  };
  switch (i(t.min.x), s(t.min.y), i(t.max.x), s(t.max.y), e.length) {
    case 0:
      return null;
    case 1:
      return e[0];
    case 2:
      return z(e[0], e[1]) ? e[0] : O(e[0], e[1]);
  }
  return null;
}
function ut(h, t, e) {
  const i = t.subtract(h), s = [];
  if (i.x !== 0) {
    const o = (e.min.x - h.x) / i.x, l = h.y + o * i.y;
    o >= 0 && l >= e.min.y && l <= e.max.y && s.push({ t: o, p: new w(e.min.x, l) });
  }
  if (i.x !== 0) {
    const o = (e.max.x - h.x) / i.x, l = h.y + o * i.y;
    o >= 0 && l >= e.min.y && l <= e.max.y && s.push({ t: o, p: new w(e.max.x, l) });
  }
  if (i.y !== 0) {
    const o = (e.min.y - h.y) / i.y, l = h.x + o * i.x;
    o >= 0 && l >= e.min.x && l <= e.max.x && s.push({ t: o, p: new w(l, e.min.y) });
  }
  if (i.y !== 0) {
    const o = (e.max.y - h.y) / i.y, l = h.x + o * i.x;
    o >= 0 && l >= e.min.x && l <= e.max.x && s.push({ t: o, p: new w(l, e.max.y) });
  }
  return s.length === 0 ? null : (s.sort((o, l) => o.t - l.t), s[0].p);
}
function Pt(h, t, e, i, s, o) {
  if (z(h, t))
    return null;
  const l = new w(0, 0), a = new w(e, i), n = new Lt(l, a);
  if (s)
    if (o) {
      const r = Ot(Ft(h, t), n);
      return Array.isArray(r) ? r : null;
    } else {
      const r = ut(t, h, n);
      return r === null || z(t, r) ? null : O(t, r);
    }
  if (o) {
    const r = ut(h, t, n);
    return r === null || z(h, r) ? null : O(h, r);
  } else
    return O(h, t);
}
function Dt(h, t, e) {
  const i = 0.5 * e, s = Math.sqrt(2), l = t.subtract(h).normalized();
  let a = 1;
  e === 1 ? a = 3.5 : e === 2 ? a = 2 : e === 3 ? a = 1.5 : e === 4 && (a = 1.25);
  const n = 5 * e * a, r = 1 * i;
  if (n * s * 0.2 <= r)
    return [];
  const c = l.scaled(n), p = t.subtract(c), _ = l.transposed(), d = 1 * n, u = _.scaled(d), f = p.add(u), m = p.subtract(u), x = f.subtract(t).normalized().scaled(r), v = m.subtract(t).normalized().scaled(r), S = t.add(x), V = t.add(v), P = i * (s - 1), k = _.scaled(P), j = Math.min(n - 1 * i / s, i * s * 1), b = l.scaled(j), kt = t.subtract(k), Et = t.add(k), pt = t.subtract(b);
  return [[f, S], [m, V], [kt, pt.subtract(k)], [Et, pt.add(k)]];
}
class Ht {
  _p1;
  _p2;
  _options;
  _selected;
  constructor(t, e, i, s) {
    this._p1 = t, this._p2 = e, this._options = i, this._selected = s;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = new w(s, o), r = new w(l, a), c = e.mediaSize.width * e.horizontalPixelRatio, p = e.mediaSize.height * e.verticalPixelRatio, _ = Pt(
        n,
        r,
        c,
        p,
        !!this._options.extendLeft,
        !!this._options.extendRight
      );
      _ && (i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.lineCap = "butt", E(i, this._options.lineStyle || 0), i.beginPath(), i.moveTo(_[0].x, _[0].y), i.lineTo(_[1].x, _[1].y), i.stroke(), i.setLineDash([])), this._options.leftEnd === 1 && this._drawArrow(i, r, n, this._options.width), this._options.rightEnd === 1 && this._drawArrow(i, n, r, this._options.width), this._selected && (y(e, s, o), y(e, l, a));
    });
  }
  _drawArrow(t, e, i, s) {
    const o = Dt(e, i, s);
    if (o.length !== 0) {
      t.beginPath();
      for (const [l, a] of o)
        t.moveTo(l.x, l.y), t.lineTo(a.x, a.y);
      t.stroke();
    }
  }
}
class zt {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new Ht(
      this._p1,
      this._p2,
      this._source._options,
      this._source._selected
    );
  }
}
const Bt = {
  lineColor: "rgb(0, 0, 0)",
  width: 2,
  lineStyle: 0,
  extendLeft: !1,
  extendRight: !1,
  leftEnd: 0,
  rightEnd: 0,
  locked: !1
};
class D {
  _chart;
  _series;
  _p1;
  _p2;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  _alertId;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._options = {
      ...Bt,
      ...o
    }, this._paneViews = [new zt(this)];
  }
  /**
   * Update both points of the trend line
   */
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  /**
   * Update a single point by index
   * @param index - 0 for p1, 1 for p2
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 && (this._p2 = e), this.updateAllViews();
  }
  setAlertId(t) {
    this._alertId = t;
  }
  getPriceAtLogical(t) {
    if (this._p1.logical === null || this._p1.price === null || this._p2.logical === null || this._p2.price === null || this._p1.logical === this._p2.logical) return null;
    const e = (this._p2.price - this._p1.price) / (this._p2.logical - this._p1.logical), i = this._p1.price + e * (t - this._p1.logical);
    return !this._options.extendLeft && t < Math.min(this._p1.logical, this._p2.logical) || !this._options.extendRight && t > Math.max(this._p1.logical, this._p2.logical) ? null : i;
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    this._options = { ...this._options, ...t }, this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on anchor points or line
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = 8;
    if (Math.hypot(t - o, e - l) < r)
      return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < r)
      return { hit: !0, type: "point", index: 1 };
    const c = this._chart.chartElement?.(), p = c?.clientWidth || window.innerWidth, _ = c?.clientHeight || window.innerHeight, d = new w(o, l), u = new w(a, n), f = Pt(
      d,
      u,
      p,
      _,
      !!this._options.extendLeft,
      !!this._options.extendRight
    );
    if (f) {
      if (R({ x: t, y: e }, f[0], f[1]) < 5)
        return { hit: !0, type: "line" };
    } else if (R({ x: t, y: e }, { x: o, y: l }, { x: a, y: n }) < 5)
      return { hit: !0, type: "line" };
    return null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
function It(h, t) {
  const e = [
    [],
    // 0: Solid
    [2, 2],
    // 1: Dotted
    [6, 6],
    // 2: Dashed
    [10, 10],
    // 3: Large Dashed
    [2, 10]
    // 4: Sparse Dotted
  ], i = e[t] || e[0];
  h.setLineDash(i);
}
function Wt(h, t, e, i = "#FFFFFF", s = "#2962FF") {
  const o = h.context;
  o.fillStyle = i, o.strokeStyle = s, o.lineWidth = 2, o.beginPath(), o.arc(t, e, 6 * h.horizontalPixelRatio, 0, 2 * Math.PI), o.fill(), o.stroke();
}
function Nt(h, t) {
  return Math.round(h * t);
}
class $t {
  _y;
  _options;
  _selected;
  constructor(t, e, i) {
    this._y = t, this._options = e, this._selected = i;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._y === null) return;
      const i = e.context, s = Nt(this._y, e.verticalPixelRatio), o = e.mediaSize.width * e.horizontalPixelRatio;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, It(i, this._options.lineStyle), i.beginPath(), i.moveTo(0, s), i.lineTo(o, s), i.stroke(), i.setLineDash([]), this._selected && Wt(e, o - 30 * e.horizontalPixelRatio, s);
    });
  }
}
class Xt {
  _source;
  _y = null;
  constructor(t) {
    this._source = t;
  }
  update() {
    this._y = this._source._series.priceToCoordinate(this._source._price);
  }
  renderer() {
    return new $t(
      this._y,
      this._source._options,
      this._source._selected
    );
  }
}
const Ut = {
  lineColor: "#2962FF",
  width: 2,
  lineStyle: 0,
  locked: !1
};
class Y {
  _chart;
  _series;
  _price;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._price = i, this._options = {
      ...Ut,
      ...s
    }, this._paneViews = [new Xt(this)];
  }
  /**
   * Update the price level of the horizontal line
   */
  updatePrice(t) {
    this._price = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  /**
   * Hit test to detect clicks on the horizontal line
   * @param _x - Screen x coordinate (unused)
   * @param y - Screen y coordinate
   * @returns Hit test result indicating if line was hit
   */
  toolHitTest(t, e) {
    const i = this._series.priceToCoordinate(this._price);
    if (i === null) return null;
    const l = (this._chart.chartElement?.()?.clientWidth || window.innerWidth) - 30;
    return Math.hypot(t - l, e - i) < 8 ? { hit: !0, type: "point", index: 0 } : Math.abs(e - i) < 5 ? { hit: !0, type: "line" } : null;
  }
  autoscaleInfo(t, e) {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class jt {
  _x;
  _y;
  _options;
  _selected;
  constructor(t, e, i, s) {
    this._x = t, this._y = e, this._options = i, this._selected = s;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._x === null || this._y === null) return;
      const i = e.context, s = g(this._x, e.horizontalPixelRatio), o = g(this._y, e.verticalPixelRatio), l = e.mediaSize.width * e.horizontalPixelRatio;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, E(i, this._options.lineStyle), i.beginPath(), i.moveTo(s, o), i.lineTo(l, o), i.stroke(), i.setLineDash([]), this._selected && y(e, s, o);
    });
  }
}
class Yt {
  _source;
  _x = null;
  _y = null;
  constructor(t) {
    this._source = t;
  }
  update() {
    const t = this._source._chart.timeScale();
    this._x = t.logicalToCoordinate(this._source._point.logical), this._y = this._source._series.priceToCoordinate(this._source._point.price);
  }
  renderer() {
    return new jt(
      this._x,
      this._y,
      this._source._options,
      this._source._selected
    );
  }
}
const qt = {
  lineColor: "#2962FF",
  width: 2,
  lineStyle: 0
};
class q {
  _chart;
  _series;
  _point;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._point = i, this._options = {
      ...qt,
      ...s
    }, this._paneViews = [new Yt(this)];
  }
  /**
   * Update the point of the horizontal ray
   */
  updatePoint(t) {
    this._point = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  /**
   * Hit test to detect clicks on the horizontal ray
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating if line was hit
   */
  toolHitTest(t, e) {
    const s = this._chart.timeScale().logicalToCoordinate(this._point.logical), o = this._series.priceToCoordinate(this._point.price);
    return s === null || o === null ? null : Math.hypot(t - s, e - o) < 8 ? { hit: !0, type: "point", index: 0 } : t >= s && Math.abs(e - o) < 5 ? { hit: !0, type: "line" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Zt {
  _x;
  _text;
  _options;
  _selected;
  constructor(t, e, i, s) {
    this._x = t, this._text = e, this._options = i, this._selected = s;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._x === null) return;
      const i = e.context, s = g(this._x, e.horizontalPixelRatio), o = e.mediaSize.height * e.verticalPixelRatio;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, E(i, this._options.lineStyle), i.beginPath(), i.moveTo(s, 0), i.lineTo(s, o), i.stroke(), i.setLineDash([]), this._options.showLabel && this._text && this._drawTextLabel(e, this._text, s, o - 20 * e.verticalPixelRatio), this._selected && y(e, s, o - 30 * e.verticalPixelRatio);
    });
  }
  _drawTextLabel(t, e, i, s) {
    const o = t.context;
    o.font = "12px Arial", o.beginPath();
    const l = 4 * t.horizontalPixelRatio, a = o.measureText(e).width, n = 16 * t.verticalPixelRatio;
    o.fillStyle = this._options.labelBackgroundColor, o.roundRect(i - a / 2 - l, s - n / 2, a + l * 2, n, 4), o.fill(), o.beginPath(), o.fillStyle = this._options.labelTextColor, o.textBaseline = "middle", o.textAlign = "center", o.fillText(e, i, s), o.textAlign = "left";
  }
}
class Jt {
  _source;
  _x = null;
  constructor(t) {
    this._source = t;
  }
  update() {
    const t = this._source._chart.timeScale();
    this._x = t.logicalToCoordinate(this._source._logical);
  }
  renderer() {
    return new Zt(
      this._x,
      "",
      // Could show time/date here if needed
      this._source._options,
      this._source._selected
    );
  }
}
const Gt = {
  lineColor: "#2962FF",
  width: 2,
  lineStyle: 0,
  showLabel: !1,
  // Default to false since we don't have time text
  labelBackgroundColor: "rgba(255, 255, 255, 0.85)",
  labelTextColor: "rgb(0, 0, 0)",
  locked: !1
};
class Z {
  _chart;
  _series;
  _logical;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._logical = i, this._options = {
      ...Gt,
      ...s
    }, this._paneViews = [new Jt(this)];
  }
  /**
   * Update the logical position of the vertical line
   */
  updatePosition(t) {
    this._logical = t, this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on the vertical line
   * @param x - Screen x coordinate
   * @param _y - Screen y coordinate (unused)
   * @returns Hit test result indicating if line was hit
   */
  toolHitTest(t, e) {
    const s = this._chart.timeScale().logicalToCoordinate(this._logical);
    if (s === null) return null;
    const a = (this._chart.chartElement?.()?.clientHeight || window.innerHeight) - 30;
    return Math.hypot(t - s, e - a) < 8 ? { hit: !0, type: "point", index: 0 } : Math.abs(t - s) < 5 ? { hit: !0, type: "line" } : null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Kt {
  _p1;
  _p2;
  _options;
  _selected;
  constructor(t, e, i, s) {
    this._p1 = t, this._p2 = e, this._options = i, this._selected = s;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = l - s, r = a - o;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.fillStyle = this._options.backgroundColor, E(i, this._options.lineStyle), i.beginPath(), i.rect(s, o, n, r), i.fill(), i.stroke(), this._selected && (y(e, s, o), y(e, l, a), y(e, s, a), y(e, l, o));
    });
  }
}
class Qt {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new Kt(
      this._p1,
      this._p2,
      this._source._options,
      this._source._selected
    );
  }
}
const te = {
  lineColor: "rgb(41, 98, 255)",
  width: 2,
  backgroundColor: "rgba(41, 98, 255, 0.2)",
  lineStyle: 0,
  locked: !1
};
class J {
  _chart;
  _series;
  _p1;
  _p2;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._options = {
      ...te,
      ...o
    }, this._paneViews = [new Qt(this)];
  }
  /**
   * Update both anchor points of the rectangle
   */
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  /**
   * Update a single anchor point by index
   * @param index - 0 for p1, 1 for p2
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 ? this._p2 = e : t === 2 ? (this._p2 = { ...this._p2, logical: e.logical }, this._p1 = { ...this._p1, price: e.price }) : t === 3 && (this._p1 = { ...this._p1, logical: e.logical }, this._p2 = { ...this._p2, price: e.price }), this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on anchors or inside rectangle
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = 8;
    return Math.hypot(t - o, e - l) < r ? { hit: !0, type: "point", index: 0 } : Math.hypot(t - a, e - n) < r ? { hit: !0, type: "point", index: 1 } : Math.hypot(t - a, e - l) < r ? { hit: !0, type: "point", index: 2 } : Math.hypot(t - o, e - n) < r ? { hit: !0, type: "point", index: 3 } : Ct({ x: t, y: e }, { x1: o, y1: l, x2: a, y2: n }) ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class ee {
  _point;
  _text;
  _options;
  _selected;
  constructor(t, e, i, s) {
    this._point = t, this._text = e, this._options = i, this._selected = s;
  }
  draw(t) {
    t.useMediaCoordinateSpace((e) => {
      if (this._point.x === null || this._point.y === null) return;
      const i = e.context, s = this._point.x, o = this._point.y;
      i.font = `${this._options.fontSize}px ${this._options.fontFamily}`, i.fillStyle = this._options.color, i.textBaseline = "middle", i.fillText(this._text, s, o), this._selected && (i.fillStyle = "#FFFFFF", i.strokeStyle = "#2962FF", i.lineWidth = 2, i.beginPath(), i.arc(s, o, 6, 0, 2 * Math.PI), i.fill(), i.stroke());
    });
  }
}
class ie {
  _source;
  _point = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._point = T(
      this._source._point,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new ee(
      this._point,
      this._source._text,
      this._source._options,
      this._source._selected
    );
  }
}
const se = {
  color: "rgb(0, 0, 0)",
  fontSize: 14,
  fontFamily: "Arial",
  locked: !1
};
class oe {
  _chart;
  _series;
  _point;
  _text;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._point = i, this._text = s, this._options = {
      ...se,
      ...o
    }, this._paneViews = [new ie(this)];
  }
  /**
   * Update the position of the text
   */
  updatePoint(t) {
    this._point = t, this.updateAllViews();
  }
  /**
   * Update the text content
   */
  updateText(t) {
    this._text = t, this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Update a specific point by index
   */
  updatePointByIndex(t, e) {
    t === 0 && (this._point = e, this.updateAllViews());
  }
  /**
   * Hit test to detect clicks on text
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating if text was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._point.logical), l = s.priceToCoordinate(this._point.price);
    if (o === null || l === null) return null;
    const a = this._options.fontSize, n = a * 0.6, r = this._text.length * n, c = a;
    return t >= o && t <= o + r && e >= l - c / 2 && e <= l + c / 2 ? { hit: !0, type: "point", index: 0 } : Math.hypot(t - o, e - l) < 8 ? { hit: !0, type: "point", index: 0 } : null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class ne {
  _p1;
  _p2;
  _p3;
  _options;
  _selected;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._p3 = i, this._options = s, this._selected = o;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null || this._p3.x === null || this._p3.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = g(this._p3.x, e.horizontalPixelRatio), r = g(this._p3.y, e.verticalPixelRatio), c = s, p = o, _ = l, d = a;
      let u = 0;
      if (l !== s) {
        const P = (a - o) / (l - s), k = o + P * (n - s);
        u = r - k;
      }
      const f = o + u, m = a + u, x = s, v = l, S = o + u / 2, V = a + u / 2;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.fillStyle = this._options.backgroundColor, E(i, this._options.lineStyle), i.beginPath(), i.moveTo(c, p), i.lineTo(_, d), i.lineTo(v, m), i.lineTo(x, f), i.closePath(), i.fill(), i.beginPath(), i.moveTo(c, p), i.lineTo(_, d), i.stroke(), i.beginPath(), i.moveTo(x, f), i.lineTo(v, m), i.stroke(), i.beginPath(), i.moveTo(c, p), i.lineTo(x, f), i.stroke(), i.beginPath(), i.moveTo(_, d), i.lineTo(v, m), i.stroke(), this._options.showMiddle && (i.setLineDash([5 * e.horizontalPixelRatio, 5 * e.horizontalPixelRatio]), i.beginPath(), i.moveTo(s, S), i.lineTo(l, V), i.stroke(), i.setLineDash([])), this._selected && (y(e, c, p), y(e, _, d), y(e, x, f), y(e, v, m));
    });
  }
}
class le {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  _p3 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    ), this._p3 = T(
      this._source._p3,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new ne(
      this._p1,
      this._p2,
      this._p3,
      this._source._options,
      this._source._selected
    );
  }
}
const ae = {
  lineColor: "rgb(33, 150, 243)",
  backgroundColor: "rgba(33, 150, 243, 0.2)",
  width: 1,
  lineStyle: 0,
  showMiddle: !0,
  locked: !1
};
class B {
  _chart;
  _series;
  _p1;
  _p2;
  _p3;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o, l) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._p3 = o, this._options = {
      ...ae,
      ...l
    }, this._paneViews = [new le(this)];
  }
  /**
   * Update all three points of the channel
   */
  updatePoints(t, e, i) {
    this._p1 = t, this._p2 = e, this._p3 = i, this.updateAllViews();
  }
  /**
   * Update a single point by index
   * @param index - 0 for p1, 1 for p2, 2 for p3
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 ? this._p2 = e : t === 2 && (this._p3 = e), this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on anchors or inside channel
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price), r = i.logicalToCoordinate(this._p3.logical), c = s.priceToCoordinate(this._p3.price);
    if (o === null || l === null || a === null || n === null || r === null || c === null)
      return null;
    let p = 0;
    if (a !== o) {
      const x = (n - l) / (a - o), v = l + x * (r - o);
      p = c - v;
    } else
      p = c - l;
    const _ = 8;
    if (Math.hypot(t - o, e - l) < _)
      return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < _)
      return { hit: !0, type: "point", index: 1 };
    if (Math.hypot(t - o, e - (l + p)) < _)
      return { hit: !0, type: "point", index: 2 };
    if (Math.hypot(t - a, e - (n + p)) < _)
      return { hit: !0, type: "point", index: 2 };
    const d = Math.min(o, a), u = Math.max(o, a), f = Math.min(l, n, l + p, n + p), m = Math.max(l, n, l + p, n + p);
    return t >= d && t <= u && e >= f && e <= m ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class re {
  _p1;
  _p2;
  _p1Price;
  _p2Price;
  _priceToCoordinate;
  _options;
  _selected;
  constructor(t, e, i, s, o, l, a) {
    this._p1 = t, this._p2 = e, this._p1Price = i, this._p2Price = s, this._priceToCoordinate = o, this._options = l, this._selected = a;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p2.x, e.horizontalPixelRatio), l = g(this._p1.y, e.verticalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio);
      i.lineWidth = 1, i.strokeStyle = "rgba(120, 120, 120, 0.5)", i.setLineDash([5, 5]), i.beginPath(), i.moveTo(s, l), i.lineTo(o, a), i.stroke(), i.setLineDash([]);
      const n = this._p2Price - this._p1Price, r = Math.min(s, o), c = Math.max(s, o);
      this._options.levels.forEach((p) => {
        const _ = this._p2Price - n * p.coeff, d = this._priceToCoordinate(_);
        if (d !== null) {
          const u = g(d, e.verticalPixelRatio);
          i.lineWidth = this._options.width, i.strokeStyle = p.color, i.beginPath(), i.moveTo(r, u), i.lineTo(c, u), i.stroke(), i.font = "10px Arial", i.fillStyle = p.color, i.fillText(`${p.coeff} (${_.toFixed(2)})`, r + 2, u - 2);
        }
      }), this._selected && (y(e, s, l), y(e, o, a));
    });
  }
}
class ce {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new re(
      this._p1,
      this._p2,
      this._source._p1.price,
      this._source._p2.price,
      (t) => this._source._series.priceToCoordinate(t),
      this._source._options,
      this._source._selected
    );
  }
}
const he = {
  width: 1,
  levels: [
    { coeff: 0, color: "#787b86" },
    { coeff: 0.236, color: "#f44336" },
    { coeff: 0.382, color: "#81c784" },
    { coeff: 0.5, color: "#4caf50" },
    { coeff: 0.618, color: "#009688" },
    { coeff: 0.786, color: "#64b5f6" },
    { coeff: 1, color: "#787b86" },
    { coeff: 1.618, color: "#2962ff" }
  ]
};
class G {
  _chart;
  _series;
  _p1;
  _p2;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._options = {
      ...he,
      ...o
    }, this._paneViews = [new ce(this)];
  }
  /**
   * Update both anchor points
   */
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  /**
   * Update a single anchor point by index
   * @param index - 0 for p1, 1 for p2
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 && (this._p2 = e), this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on anchor points or fib levels
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = 8;
    if (Math.hypot(t - o, e - l) < r)
      return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < r)
      return { hit: !0, type: "point", index: 1 };
    if (R({ x: t, y: e }, { x: o, y: l }, { x: a, y: n }) < 5)
      return { hit: !0, type: "line" };
    const p = this._p2.price - this._p1.price, _ = Math.min(o, a), d = Math.max(o, a);
    for (const u of this._options.levels) {
      const f = this._p2.price - p * u.coeff, m = s.priceToCoordinate(f);
      if (m !== null && Math.abs(e - m) < 5 && t >= _ && t <= d)
        return { hit: !0, type: "line" };
    }
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class pe {
  _p1;
  _p2;
  _p3;
  _options;
  _selected;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._p3 = i, this._options = s, this._selected = o;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null || this._p3.x === null || this._p3.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = g(this._p3.x, e.horizontalPixelRatio), r = g(this._p3.y, e.verticalPixelRatio);
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.fillStyle = this._options.backgroundColor, E(i, this._options.lineStyle), i.beginPath(), i.moveTo(s, o), i.lineTo(l, a), i.lineTo(n, r), i.closePath(), i.fill(), i.stroke(), this._selected && (y(e, s, o), y(e, l, a), y(e, n, r));
    });
  }
}
class _e {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  _p3 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    ), this._p3 = T(
      this._source._p3,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new pe(
      this._p1,
      this._p2,
      this._p3,
      this._source._options,
      this._source._selected
    );
  }
}
const de = {
  lineColor: "rgb(33, 150, 243)",
  backgroundColor: "rgba(33, 150, 243, 0.2)",
  width: 1,
  lineStyle: 0,
  locked: !1
};
class I {
  _chart;
  _series;
  _p1;
  _p2;
  _p3;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o, l) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._p3 = o, this._options = {
      ...de,
      ...l
    }, this._paneViews = [new _e(this)];
  }
  /**
   * Update all three points of the triangle
   */
  updatePoints(t, e, i) {
    this._p1 = t, this._p2 = e, this._p3 = i, this.updateAllViews();
  }
  /**
   * Update a single point by index
   * @param index - 0 for p1, 1 for p2, 2 for p3
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 ? this._p2 = e : t === 2 && (this._p3 = e), this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on anchor points or inside triangle
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price), r = i.logicalToCoordinate(this._p3.logical), c = s.priceToCoordinate(this._p3.price);
    if (o === null || l === null || a === null || n === null || r === null || c === null)
      return null;
    const p = 8;
    return Math.hypot(t - o, e - l) < p ? { hit: !0, type: "point", index: 0 } : Math.hypot(t - a, e - n) < p ? { hit: !0, type: "point", index: 1 } : Math.hypot(t - r, e - c) < p ? { hit: !0, type: "point", index: 2 } : this._isPointInTriangle({ x: t, y: e }, { x: o, y: l }, { x: a, y: n }, { x: r, y: c }) ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  /**
   * Check if a point is inside a triangle using barycentric coordinates
   */
  _isPointInTriangle(t, e, i, s) {
    const o = 0.5 * (-i.y * s.x + e.y * (-i.x + s.x) + e.x * (i.y - s.y) + i.x * s.y), l = 1 / (2 * o) * (e.y * s.x - e.x * s.y + (s.y - e.y) * t.x + (e.x - s.x) * t.y), a = 1 / (2 * o) * (e.x * i.y - e.y * i.x + (e.y - i.y) * t.x + (i.x - e.x) * t.y);
    return l >= 0 && a >= 0 && l + a <= 1;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class ue {
  _points;
  _options;
  _selected;
  constructor(t, e, i) {
    this._points = t, this._options = e, this._selected = i;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._points.length < 2)
        return;
      const i = e.context;
      ct(i, {
        lineColor: this._options.lineColor,
        width: this._options.width,
        lineJoin: "round",
        lineCap: "round",
        globalAlpha: this._options.opacity
      });
      const s = [];
      for (const o of this._points)
        o.x === null || o.y === null || s.push({
          x: g(o.x, e.horizontalPixelRatio),
          y: g(o.y, e.verticalPixelRatio)
        });
      if (!(s.length < 2)) {
        if (i.beginPath(), i.moveTo(s[0].x, s[0].y), s.length === 2)
          i.lineTo(s[1].x, s[1].y);
        else if (this._options.useSmoothCurve === !1)
          for (let o = 1; o < s.length; o++)
            i.lineTo(s[o].x, s[o].y);
        else {
          i.moveTo(s[0].x, s[0].y);
          let o = 1;
          for (; o < s.length - 2; o++) {
            const l = (s[o].x + s[o + 1].x) / 2, a = (s[o].y + s[o + 1].y) / 2;
            i.quadraticCurveTo(s[o].x, s[o].y, l, a);
          }
          i.quadraticCurveTo(
            s[o].x,
            s[o].y,
            s[o + 1].x,
            s[o + 1].y
          );
        }
        if (i.stroke(), this._selected && !this._options.useSmoothCurve)
          for (const o of s)
            y(e, o.x, o.y);
        ht(i);
      }
    });
  }
}
class fe {
  _source;
  _points = [];
  constructor(t) {
    this._source = t;
  }
  update() {
    this._points = rt(
      this._source._points,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new ue(this._points, this._source._options, this._source._selected);
  }
}
const K = {
  brush: {
    lineColor: "rgba(0, 0, 0, 0.8)",
    width: 2,
    opacity: 1,
    useSmoothCurve: !0
    // Smooth curves for brush strokes
  },
  highlighter: {
    lineColor: "rgba(255, 235, 59, 0.6)",
    width: 20,
    opacity: 0.6,
    useSmoothCurve: !0
    // Smooth curves for highlighter
  },
  path: {
    lineColor: "rgba(33, 150, 243, 1)",
    width: 2,
    opacity: 1,
    useSmoothCurve: !1
    // Straight lines for path tool
  }
}, ge = {
  lineColor: "rgba(0, 0, 0, 0.8)",
  width: 2,
  opacity: 1,
  useSmoothCurve: !0,
  locked: !1
};
class L {
  _chart;
  _series;
  _points;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._points = i, this._options = {
      ...ge,
      ...s
    }, this._paneViews = [new fe(this)];
  }
  updatePoints(t) {
    this._points = t, this.updateAllViews();
  }
  addPoint(t) {
    this._points.push(t), this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  updatePointByIndex(t, e) {
    t >= 0 && t < this._points.length && (this._points[t] = e, this.updateAllViews());
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = this._points.map((a) => {
      const n = i.logicalToCoordinate(a.logical), r = s.priceToCoordinate(a.price);
      return { x: n, y: r };
    });
    if (!this._options.useSmoothCurve)
      for (let n = 0; n < o.length; n++) {
        const r = o[n];
        if (!(r.x === null || r.y === null) && Math.hypot(t - r.x, e - r.y) < 8)
          return { hit: !0, type: "point", index: n };
      }
    const l = Math.max(5, this._options.width / 2 + 2);
    for (let a = 0; a < o.length - 1; a++) {
      const n = o[a], r = o[a + 1];
      if (n.x === null || n.y === null || r.x === null || r.y === null) continue;
      if (R({ x: t, y: e }, n, r) < l)
        return { hit: !0, type: "line" };
    }
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class me {
  _p1;
  _p2;
  _text;
  _options;
  _selected;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._text = i, this._options = s, this._selected = o;
  }
  draw(t) {
    t.useMediaCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = this._p1.x, o = this._p1.y, l = this._p2.x, a = this._p2.y;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.fillStyle = this._options.lineColor, i.beginPath(), i.moveTo(s, o), i.lineTo(l, a), i.stroke(), i.beginPath(), i.arc(s, o, 3, 0, 2 * Math.PI), i.fill(), i.font = `${this._options.fontSize}px ${this._options.fontFamily}`;
      const r = i.measureText(this._text).width, c = this._options.fontSize * 1.2, p = 5, _ = l, d = a - c / 2;
      i.fillStyle = this._options.backgroundColor, i.fillRect(_, d - p, r + p * 2, c + p * 2), i.strokeRect(_, d - p, r + p * 2, c + p * 2), i.fillStyle = this._options.textColor, i.textBaseline = "middle", i.fillText(this._text, _ + p, d + c / 2), this._selected && (i.fillStyle = "#FFFFFF", i.strokeStyle = "#2962FF", i.lineWidth = 2, i.beginPath(), i.arc(s, o, 6, 0, 2 * Math.PI), i.fill(), i.stroke(), i.beginPath(), i.arc(l, a, 6, 0, 2 * Math.PI), i.fill(), i.stroke());
    });
  }
}
class ye {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new me(
      this._p1,
      this._p2,
      this._source._text,
      this._source._options,
      this._source._selected
    );
  }
}
const xe = {
  lineColor: "rgb(33, 150, 243)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  textColor: "rgb(0, 0, 0)",
  width: 1,
  fontSize: 12,
  fontFamily: "Arial"
};
class W {
  _chart;
  _series;
  _p1;
  // Anchor point
  _p2;
  // Text box point
  _text;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s, o, l) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._text = o, this._options = {
      ...xe,
      ...l
    }, this._paneViews = [new ye(this)];
  }
  /**
   * Update both points
   */
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  /**
   * Update a specific point by index
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 && (this._p2 = e), this.updateAllViews();
  }
  /**
   * Update the text content
   */
  updateText(t) {
    this._text = t, this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on anchor points or line
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = 8;
    if (Math.hypot(t - o, e - l) < r)
      return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < r)
      return { hit: !0, type: "point", index: 1 };
    const c = this._options.fontSize, p = this._text.length * c * 0.6 + 20, _ = c * 1.2 + 10;
    return t >= a && t <= a + p && e >= n - _ / 2 && e <= n + _ / 2 ? { hit: !0, type: "point", index: 1 } : R({ x: t, y: e }, { x: o, y: l }, { x: a, y: n }) < 5 ? { hit: !0, type: "line" } : null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class ve {
  _point;
  _options;
  _selected;
  constructor(t, e, i) {
    this._point = t, this._options = e, this._selected = i;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._point.x === null || this._point.y === null) return;
      const i = e.context, s = g(this._point.x, e.horizontalPixelRatio), o = g(this._point.y, e.verticalPixelRatio), l = e.mediaSize.width * e.horizontalPixelRatio, a = e.mediaSize.height * e.verticalPixelRatio;
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, E(i, this._options.lineStyle), i.beginPath(), i.moveTo(0, o), i.lineTo(l, o), i.stroke(), i.beginPath(), i.moveTo(s, 0), i.lineTo(s, a), i.stroke(), i.setLineDash([]), this._selected && y(e, s, o);
    });
  }
}
class Te {
  _source;
  _point = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._point = T(
      this._source._point,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new ve(
      this._point,
      this._source._options,
      this._source._selected
    );
  }
}
const we = {
  lineColor: "#2962FF",
  width: 2,
  lineStyle: 2
};
class ft {
  _chart;
  _series;
  _point;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._point = i, this._options = {
      ...we,
      ...s
    }, this._paneViews = [new Te(this)];
  }
  /**
   * Update the crosshair position
   */
  updatePoint(t) {
    this._point = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  /**
   * Hit test to detect clicks near the crosshair intersection
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating if crosshair was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._point.logical), l = s.priceToCoordinate(this._point.price);
    if (o === null || l === null) return null;
    const a = 5;
    return Math.abs(e - l) < a ? { hit: !0, type: "line" } : Math.abs(t - o) < a ? { hit: !0, type: "line" } : Math.hypot(t - o, e - l) < 8 ? { hit: !0, type: "point" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Ce {
  _p1;
  // Center
  _p2;
  // Edge point
  _options;
  _selected;
  constructor(t, e, i, s) {
    this._p1 = t, this._p2 = e, this._options = i, this._selected = s;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = l - s, r = a - o, c = Math.sqrt(n * n + r * r);
      i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.lineWidth = this._options.width, i.strokeStyle = this._options.lineColor, i.fillStyle = this._options.backgroundColor, E(i, this._options.lineStyle), i.beginPath(), i.arc(s, o, c, 0, 2 * Math.PI), i.fill(), i.stroke(), this._selected && (y(e, s, o), y(e, l, a));
    });
  }
}
class Pe {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new Ce(
      this._p1,
      this._p2,
      this._source._options,
      this._source._selected
    );
  }
}
const be = {
  lineColor: "rgb(41, 98, 255)",
  width: 2,
  backgroundColor: "rgba(41, 98, 255, 0.2)",
  lineStyle: 0,
  locked: !1
};
class Q {
  _chart;
  _series;
  _p1;
  // Center
  _p2;
  // Edge point
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._options = {
      ...be,
      ...o
    }, this._paneViews = [new Pe(this)];
  }
  /**
   * Update both points (center and edge)
   */
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  /**
   * Update a single point by index
   * @param index - 0 for center (p1), 1 for edge (p2)
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 && (this._p2 = e), this.updateAllViews();
  }
  /**
   * Set selection state and update visuals
   */
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  /**
   * Hit test to detect clicks on center anchor, edge anchor, or inside circle
   * @param x - Screen x coordinate
   * @param y - Screen y coordinate
   * @returns Hit test result indicating what was clicked
   */
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = a - o, c = n - l, p = Math.hypot(r, c), _ = 8;
    return Math.hypot(t - o, e - l) < _ ? { hit: !0, type: "point", index: 0 } : Math.hypot(t - a, e - n) < _ ? { hit: !0, type: "point", index: 1 } : Vt({ x: t, y: e }, { x: o, y: l }, p) ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Se {
  _p1;
  _p2;
  _options;
  _selected;
  _source;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._options = i, this._selected = s, this._source = o;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = Math.min(s, l), r = Math.max(s, l), c = Math.min(o, a), p = Math.max(o, a), _ = r - n, d = p - c;
      this._options.backgroundColor && (i.fillStyle = this._options.backgroundColor, i.fillRect(n, c, _, d)), i.strokeStyle = this._options.borderColor, i.lineWidth = this._options.borderWidth * e.verticalPixelRatio, i.strokeRect(n, c, _, d);
      const u = (s + l) / 2, f = 10 * e.verticalPixelRatio;
      i.beginPath(), i.moveTo(u, c), i.lineTo(u, p);
      const m = a - o;
      if (Math.abs(m) > f) {
        let b;
        m > 0 ? (b = p, i.moveTo(u - f, b - f), i.lineTo(u, b), i.lineTo(u + f, b - f)) : (b = c, i.moveTo(u - f, b + f), i.lineTo(u, b), i.lineTo(u + f, b + f));
      }
      i.stroke();
      const x = this._source._p1.price, v = this._source._p2.price, S = Math.abs(v - x), V = x !== 0 ? (v - x) / x * 100 : 0, k = `${v > x ? "+" : ""}${S.toFixed(2)} (${Math.abs(V).toFixed(2)}%)`, j = v > x ? c - 10 * e.verticalPixelRatio : p + 25 * e.verticalPixelRatio;
      if (i.font = `bold ${14 * e.verticalPixelRatio}px sans-serif`, i.fillStyle = this._options.borderColor, i.textAlign = "center", i.textBaseline = v > x ? "bottom" : "top", i.fillText(k, u, j), this._selected) {
        y(e, s, o), y(e, l, a), y(e, s, a), y(e, l, o);
        const b = (o + a) / 2;
        y(e, u, o), y(e, u, a), y(e, s, b), y(e, l, b);
      }
    });
  }
}
class Me {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new Se(
      this._p1,
      this._p2,
      this._source._options,
      this._source._selected,
      this._source
    );
  }
}
const Re = {
  backgroundColor: "rgba(41, 98, 255, 0.2)",
  borderColor: "rgb(41, 98, 255)",
  borderWidth: 2,
  extendLeft: !1,
  extendRight: !1,
  locked: !1
};
class tt {
  _chart;
  _series;
  _p1;
  _p2;
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._options = {
      ...Re,
      ...o
    }, this._paneViews = [new Me(this)];
  }
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  /**
   * Update a single anchor point by index (8 anchor points total)
   * First point (p1) stays fixed, only second point (p2) moves
   * @param index - Anchor index (0-7)
   * @param point - New logical point
   */
  updatePointByIndex(t, e) {
    switch (t) {
      case 0:
        this._p1 = e;
        break;
      case 1:
        this._p2 = e;
        break;
      case 2:
        this._p1 = { ...this._p1, logical: e.logical }, this._p2 = { ...this._p2, price: e.price };
        break;
      case 3:
        this._p2 = { ...this._p2, logical: e.logical }, this._p1 = { ...this._p1, price: e.price };
        break;
    }
    this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = 8, c = Math.min(o, a), p = Math.max(o, a), _ = Math.min(l, n), d = Math.max(l, n), u = (o + a) / 2, f = (l + n) / 2, m = [
      { x: o, y: l, index: 0 },
      // corner 1
      { x: a, y: n, index: 1 },
      // corner 2
      { x: o, y: n, index: 2 },
      // corner 3
      { x: a, y: l, index: 3 },
      // corner 4
      { x: u, y: _, index: 4 },
      // top center
      { x: u, y: d, index: 5 },
      // bottom center
      { x: c, y: f, index: 6 },
      // left center
      { x: p, y: f, index: 7 }
      // right center
    ];
    for (const x of m)
      if (Math.hypot(t - x.x, e - x.y) < r)
        return { hit: !0, type: "point", index: x.index };
    return Ct({ x: t, y: e }, { x1: o, y1: l, x2: a, y2: n }) ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class ke {
  _p1;
  // Entry
  _p2;
  // Stop Loss
  _p3;
  // Take Profit
  _options;
  _selected;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._p3 = i, this._options = s, this._selected = o;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null || this._p3.x === null || this._p3.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = g(this._p3.x, e.horizontalPixelRatio), r = g(this._p3.y, e.verticalPixelRatio), c = Math.min(s, l, n), p = Math.max(s, l, n), _ = Math.max(p - c, 50 * e.horizontalPixelRatio), d = c + _;
      i.fillStyle = this._options.profitColor, i.globalAlpha = this._options.zoneOpacity, i.fillRect(c, Math.min(o, r), _, Math.abs(r - o)), i.fillStyle = this._options.lossColor, i.fillRect(c, Math.min(o, a), _, Math.abs(a - o)), i.globalAlpha = 1, i.lineWidth = this._options.lineWidth, i.lineCap = "butt", i.strokeStyle = this._options.lineColor, i.beginPath(), i.moveTo(c, o), i.lineTo(d, o), i.stroke(), i.strokeStyle = this._options.profitLineColor, i.beginPath(), i.moveTo(c, r), i.lineTo(d, r), i.stroke(), i.strokeStyle = this._options.lossLineColor, i.beginPath(), i.moveTo(c, a), i.lineTo(d, a), i.stroke(), this._selected && (y(e, s, o, "#FFFFFF", "#2962FF"), y(e, l, a, "#FFFFFF", "#FF0000"), y(e, n, r, "#FFFFFF", "#00FF00"));
    });
  }
}
class Ee {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  _p3 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(this._source._p1, this._source._chart, this._source._series), this._p2 = T(this._source._p2, this._source._chart, this._source._series), this._p3 = T(this._source._p3, this._source._chart, this._source._series);
  }
  renderer() {
    return new ke(
      this._p1,
      this._p2,
      this._p3,
      this._source._options,
      this._source._selected
    );
  }
}
const Ve = {
  lineColor: "#787B86",
  profitColor: "rgba(0, 255, 0, 0.2)",
  lossColor: "rgba(255, 0, 0, 0.2)",
  profitLineColor: "#00FF00",
  lossLineColor: "#FF0000",
  lineWidth: 1,
  zoneOpacity: 0.2,
  textColor: "#FFFFFF",
  locked: !1
};
class N {
  _chart;
  _series;
  _p1;
  // Entry
  _p2;
  // Stop Loss
  _p3;
  // Take Profit
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o, l) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._p3 = o, this._options = {
      ...Ve,
      ...l
    }, this._paneViews = [new Ee(this)];
  }
  updatePoints(t, e, i) {
    this._p1 = t, this._p2 = e, this._p3 = i, this.updateAllViews();
  }
  updatePointByIndex(t, e) {
    if (t === 0) {
      const i = e.logical - this._p1.logical, s = e.price - this._p1.price;
      this._p1 = e, this._p2 = { logical: this._p2.logical + i, price: this._p2.price + s }, this._p3 = { logical: this._p3.logical + i, price: this._p3.price + s };
    } else t === 1 ? this._p2 = e : t === 2 && (this._p3 = e);
    this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price), r = i.logicalToCoordinate(this._p3.logical), c = s.priceToCoordinate(this._p3.price);
    if (o === null || l === null || a === null || n === null || r === null || c === null) return null;
    const p = 8;
    if (Math.hypot(t - o, e - l) < p) return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < p) return { hit: !0, type: "point", index: 1 };
    if (Math.hypot(t - r, e - c) < p) return { hit: !0, type: "point", index: 2 };
    const _ = Math.min(o, a, r), d = Math.max(o, a, r), u = window.devicePixelRatio || 1, f = Math.max(d - _, 50 * u), m = _ + f, x = Math.min(l, n, c), v = Math.max(l, n, c);
    return t >= _ && t <= m && e >= x && e <= v ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Le {
  _p1;
  // Entry
  _p2;
  // Stop Loss
  _p3;
  // Take Profit
  _options;
  _selected;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._p3 = i, this._options = s, this._selected = o;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null || this._p3.x === null || this._p3.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = g(this._p3.x, e.horizontalPixelRatio), r = g(this._p3.y, e.verticalPixelRatio), c = Math.min(s, l, n), p = Math.max(s, l, n), _ = Math.max(p - c, 50 * e.horizontalPixelRatio), d = c + _;
      i.fillStyle = this._options.profitColor, i.globalAlpha = this._options.zoneOpacity, i.fillRect(c, Math.min(o, r), _, Math.abs(r - o)), i.fillStyle = this._options.lossColor, i.fillRect(c, Math.min(o, a), _, Math.abs(a - o)), i.globalAlpha = 1, i.lineWidth = this._options.lineWidth, i.lineCap = "butt", i.strokeStyle = this._options.lineColor, i.beginPath(), i.moveTo(c, o), i.lineTo(d, o), i.stroke(), i.strokeStyle = this._options.profitLineColor, i.beginPath(), i.moveTo(c, r), i.lineTo(d, r), i.stroke(), i.strokeStyle = this._options.lossLineColor, i.beginPath(), i.moveTo(c, a), i.lineTo(d, a), i.stroke(), this._selected && (y(e, s, o, "#FFFFFF", "#2962FF"), y(e, l, a, "#FFFFFF", "#FF0000"), y(e, n, r, "#FFFFFF", "#00FF00"));
    });
  }
}
class Ae {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  _p3 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(this._source._p1, this._source._chart, this._source._series), this._p2 = T(this._source._p2, this._source._chart, this._source._series), this._p3 = T(this._source._p3, this._source._chart, this._source._series);
  }
  renderer() {
    return new Le(
      this._p1,
      this._p2,
      this._p3,
      this._source._options,
      this._source._selected
    );
  }
}
const Fe = {
  lineColor: "#787B86",
  profitColor: "rgba(0, 255, 0, 0.2)",
  lossColor: "rgba(255, 0, 0, 0.2)",
  profitLineColor: "#00FF00",
  lossLineColor: "#FF0000",
  lineWidth: 1,
  zoneOpacity: 0.2,
  textColor: "#FFFFFF",
  locked: !1
};
class $ {
  _chart;
  _series;
  _p1;
  // Entry
  _p2;
  // Stop Loss
  _p3;
  // Take Profit
  _paneViews;
  _options;
  _selected = !1;
  _locked = !1;
  constructor(t, e, i, s, o, l) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._p3 = o, this._options = {
      ...Fe,
      ...l
    }, this._paneViews = [new Ae(this)];
  }
  updatePoints(t, e, i) {
    this._p1 = t, this._p2 = e, this._p3 = i, this.updateAllViews();
  }
  updatePointByIndex(t, e) {
    if (t === 0) {
      const i = e.logical - this._p1.logical, s = e.price - this._p1.price;
      this._p1 = e, this._p2 = { logical: this._p2.logical + i, price: this._p2.price + s }, this._p3 = { logical: this._p3.logical + i, price: this._p3.price + s };
    } else t === 1 ? this._p2 = e : t === 2 && (this._p3 = e);
    this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price), r = i.logicalToCoordinate(this._p3.logical), c = s.priceToCoordinate(this._p3.price);
    if (o === null || l === null || a === null || n === null || r === null || c === null) return null;
    const p = 8;
    if (Math.hypot(t - o, e - l) < p) return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < p) return { hit: !0, type: "point", index: 1 };
    if (Math.hypot(t - r, e - c) < p) return { hit: !0, type: "point", index: 2 };
    const _ = Math.min(o, a, r), d = Math.max(o, a, r), u = window.devicePixelRatio || 1, f = Math.max(d - _, 50 * u), m = _ + f, x = Math.min(l, n, c), v = Math.max(l, n, c);
    return t >= _ && t <= m && e >= x && e <= v ? { hit: !0, type: "shape" } : null;
  }
  autoscaleInfo() {
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Oe {
  _points;
  _options;
  _selected;
  constructor(t, e, i) {
    this._points = t, this._options = e, this._selected = i;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._points.length < 2)
        return;
      const i = e.context;
      ct(i, {
        lineColor: this._options.lineColor,
        width: this._options.width,
        lineJoin: "round",
        lineCap: "round",
        globalAlpha: 1
      });
      const s = [];
      for (const l of this._points)
        l.x === null || l.y === null || s.push({
          x: g(l.x, e.horizontalPixelRatio),
          y: g(l.y, e.verticalPixelRatio)
        });
      if (s.length < 2) return;
      i.beginPath(), i.moveTo(s[0].x, s[0].y);
      for (let l = 1; l < s.length; l++)
        i.lineTo(s[l].x, s[l].y);
      i.stroke(), i.font = "12px Arial", i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = this._options.textColor;
      const o = ["(0)", "1", "2", "3", "4", "5"];
      for (let l = 0; l < s.length && !(l >= o.length); l++) {
        const a = s[l], n = o[l], r = i.measureText(n).width, c = 4;
        i.fillStyle = "rgba(255, 255, 255, 0.8)", i.fillRect(a.x - r / 2 - c, a.y - 12, r + c * 2, 24), i.fillStyle = this._options.textColor, i.fillText(n, a.x, a.y);
      }
      if (this._selected)
        for (const l of s)
          y(e, l.x, l.y);
      ht(i);
    });
  }
}
class De {
  _source;
  _points = [];
  constructor(t) {
    this._source = t;
  }
  update() {
    this._points = rt(
      this._source._points,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new Oe(this._points, this._source._options, this._source._selected);
  }
}
const He = {
  lineColor: "#2962FF",
  width: 2,
  textColor: "#2962FF"
};
class et {
  _chart;
  _series;
  _points;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._points = i, this._options = {
      ...He,
      ...s
    }, this._paneViews = [new De(this)];
  }
  updatePoints(t) {
    this._points = t, this.updateAllViews();
  }
  addPoint(t) {
    this._points.push(t), this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  updatePointByIndex(t, e) {
    t >= 0 && t < this._points.length && (this._points[t] = e, this.updateAllViews());
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = this._points.map((n) => {
      const r = i.logicalToCoordinate(n.logical), c = s.priceToCoordinate(n.price);
      return { x: r, y: c };
    }), l = 8;
    for (let n = 0; n < o.length; n++) {
      const r = o[n];
      if (!(r.x === null || r.y === null) && Math.hypot(t - r.x, e - r.y) < l)
        return { hit: !0, type: "point", index: n };
    }
    const a = 5;
    for (let n = 0; n < o.length - 1; n++) {
      const r = o[n], c = o[n + 1];
      if (r.x === null || r.y === null || c.x === null || c.y === null) continue;
      if (R({ x: t, y: e }, r, c) < a)
        return { hit: !0, type: "line" };
    }
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class ze {
  _points;
  _options;
  _selected;
  constructor(t, e, i) {
    this._points = t, this._options = e, this._selected = i;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._points.length < 2)
        return;
      const i = e.context;
      ct(i, {
        lineColor: this._options.lineColor,
        width: this._options.width,
        lineJoin: "round",
        lineCap: "round",
        globalAlpha: 1
      });
      const s = [];
      for (const l of this._points)
        l.x === null || l.y === null || s.push({
          x: g(l.x, e.horizontalPixelRatio),
          y: g(l.y, e.verticalPixelRatio)
        });
      if (s.length < 2) return;
      i.beginPath(), i.moveTo(s[0].x, s[0].y);
      for (let l = 1; l < s.length; l++)
        i.lineTo(s[l].x, s[l].y);
      i.stroke(), i.font = "12px Arial", i.textAlign = "center", i.textBaseline = "middle", i.fillStyle = this._options.textColor;
      const o = ["(0)", "A", "B", "C"];
      for (let l = 0; l < s.length && !(l >= o.length); l++) {
        const a = s[l], n = o[l], r = i.measureText(n).width, c = 4;
        i.fillStyle = "rgba(255, 255, 255, 0.8)", i.fillRect(a.x - r / 2 - c, a.y - 12, r + c * 2, 24), i.fillStyle = this._options.textColor, i.fillText(n, a.x, a.y);
      }
      if (this._selected)
        for (const l of s)
          y(e, l.x, l.y);
      ht(i);
    });
  }
}
class Be {
  _source;
  _points = [];
  constructor(t) {
    this._source = t;
  }
  update() {
    this._points = rt(
      this._source._points,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new ze(this._points, this._source._options, this._source._selected);
  }
}
const Ie = {
  lineColor: "#2962FF",
  width: 2,
  textColor: "#2962FF"
};
class it {
  _chart;
  _series;
  _points;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s) {
    this._chart = t, this._series = e, this._points = i, this._options = {
      ...Ie,
      ...s
    }, this._paneViews = [new Be(this)];
  }
  updatePoints(t) {
    this._points = t, this.updateAllViews();
  }
  addPoint(t) {
    this._points.push(t), this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  updatePointByIndex(t, e) {
    t >= 0 && t < this._points.length && (this._points[t] = e, this.updateAllViews());
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = this._points.map((n) => {
      const r = i.logicalToCoordinate(n.logical), c = s.priceToCoordinate(n.price);
      return { x: r, y: c };
    }), l = 8;
    for (let n = 0; n < o.length; n++) {
      const r = o[n];
      if (!(r.x === null || r.y === null) && Math.hypot(t - r.x, e - r.y) < l)
        return { hit: !0, type: "point", index: n };
    }
    const a = 5;
    for (let n = 0; n < o.length - 1; n++) {
      const r = o[n], c = o[n + 1];
      if (r.x === null || r.y === null || c.x === null || c.y === null) continue;
      if (R({ x: t, y: e }, r, c) < a)
        return { hit: !0, type: "line" };
    }
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class We {
  _p1;
  _p2;
  _options;
  _selected;
  _source;
  constructor(t, e, i, s, o) {
    this._p1 = t, this._p2 = e, this._options = i, this._selected = s, this._source = o;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p1.y, e.verticalPixelRatio), l = g(this._p2.x, e.horizontalPixelRatio), a = g(this._p2.y, e.verticalPixelRatio), n = Math.min(s, l), r = Math.max(s, l), c = r - n, p = Math.min(o, a), d = Math.max(o, a) - p;
      this._options.backgroundColor && (i.fillStyle = this._options.backgroundColor, i.fillRect(n, p, c, d)), i.strokeStyle = this._options.borderColor, i.lineWidth = this._options.borderWidth * e.verticalPixelRatio, i.strokeRect(n, p, c, d);
      const u = (o + a) / 2, f = 10 * e.verticalPixelRatio;
      i.beginPath(), i.moveTo(n, u), i.lineTo(r, u);
      const m = l - s;
      if (Math.abs(m) > f) {
        let P;
        m > 0 ? (P = r, i.moveTo(P - f, u - f), i.lineTo(P, u), i.lineTo(P - f, u + f)) : (P = n, i.moveTo(P + f, u - f), i.lineTo(P, u), i.lineTo(P + f, u + f));
      }
      i.stroke();
      const x = this._source._p1.logical, v = this._source._p2.logical, V = `${Math.abs(v - x)} bars`;
      i.font = `bold ${14 * e.verticalPixelRatio}px sans-serif`, i.fillStyle = this._options.borderColor, i.textAlign = "center", i.textBaseline = "bottom", i.fillText(V, (n + r) / 2, p - 5 * e.verticalPixelRatio), this._selected && (y(e, s, o), y(e, l, a), y(e, s, a), y(e, l, o));
    });
  }
}
class Ne {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new We(
      this._p1,
      this._p2,
      this._source._options,
      this._source._selected,
      this._source
    );
  }
}
const $e = {
  backgroundColor: "rgba(41, 98, 255, 0.2)",
  borderColor: "rgb(41, 98, 255)",
  borderWidth: 2
};
class st {
  _chart;
  _series;
  _p1;
  _p2;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s, o) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._options = {
      ...$e,
      ...o
    }, this._paneViews = [new Ne(this)];
  }
  updatePoints(t, e) {
    this._p1 = t, this._p2 = e, this.updateAllViews();
  }
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : this._p2 = e, this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  applyOptions(t) {
    Object.assign(this._options, t), this.updateAllViews(), this._chart.timeScale().applyOptions({});
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price);
    if (o === null || l === null || a === null || n === null) return null;
    const r = 8;
    if (Math.hypot(t - o, e - l) < r) return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < r) return { hit: !0, type: "point", index: 1 };
    if (Math.hypot(t - a, e - l) < r) return { hit: !0, type: "point", index: 1 };
    if (Math.hypot(t - o, e - n) < r) return { hit: !0, type: "point", index: 0 };
    const c = Math.min(o, a), p = Math.max(o, a), _ = Math.min(l, n), d = Math.max(l, n);
    return t >= c && t <= p && e >= _ && e <= d ? { hit: !0, type: "shape" } : null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
class Xe {
  _p1;
  _p2;
  _p3;
  _p1Price;
  _p2Price;
  _p3Price;
  _priceToCoordinate;
  _options;
  _selected;
  constructor(t, e, i, s, o, l, a, n, r) {
    this._p1 = t, this._p2 = e, this._p3 = i, this._p1Price = s, this._p2Price = o, this._p3Price = l, this._priceToCoordinate = a, this._options = n, this._selected = r;
  }
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null || this._p3.x === null || this._p3.y === null)
        return;
      const i = e.context, s = g(this._p1.x, e.horizontalPixelRatio), o = g(this._p2.x, e.horizontalPixelRatio), l = g(this._p3.x, e.horizontalPixelRatio), a = g(this._p1.y, e.verticalPixelRatio), n = g(this._p2.y, e.verticalPixelRatio), r = g(this._p3.y, e.verticalPixelRatio);
      i.lineWidth = 1, i.strokeStyle = "rgba(120, 120, 120, 0.5)", i.setLineDash([5, 5]), i.beginPath(), i.moveTo(s, a), i.lineTo(o, n), i.stroke(), i.beginPath(), i.moveTo(o, n), i.lineTo(l, r), i.stroke(), i.setLineDash([]);
      const c = this._p2Price - this._p1Price, p = Math.min(s, o, l), _ = Math.max(s, o, l);
      this._options.levels.forEach((d) => {
        const u = this._p3Price + c * d.coeff, f = this._priceToCoordinate(u);
        if (f !== null) {
          const m = g(f, e.verticalPixelRatio);
          i.lineWidth = this._options.width, i.strokeStyle = d.color, i.beginPath(), i.moveTo(p, m), i.lineTo(_, m), i.stroke(), i.font = "10px Arial", i.fillStyle = d.color;
          const x = (d.coeff * 100).toFixed(1);
          i.fillText(`${x}% (${u.toFixed(2)})`, p + 2, m - 2);
        }
      }), this._selected && (y(e, s, a), y(e, o, n), y(e, l, r));
    });
  }
}
class Ue {
  _source;
  _p1 = { x: null, y: null };
  _p2 = { x: null, y: null };
  _p3 = { x: null, y: null };
  constructor(t) {
    this._source = t;
  }
  update() {
    this._p1 = T(
      this._source._p1,
      this._source._chart,
      this._source._series
    ), this._p2 = T(
      this._source._p2,
      this._source._chart,
      this._source._series
    ), this._p3 = T(
      this._source._p3,
      this._source._chart,
      this._source._series
    );
  }
  renderer() {
    return new Xe(
      this._p1,
      this._p2,
      this._p3,
      this._source._p1.price,
      this._source._p2.price,
      this._source._p3.price,
      (t) => this._source._series.priceToCoordinate(t),
      this._source._options,
      this._source._selected
    );
  }
}
const je = {
  width: 1,
  levels: [
    { coeff: 0, color: "#787b86" },
    { coeff: 0.618, color: "#f44336" },
    { coeff: 1, color: "#4caf50" },
    { coeff: 1.618, color: "#2962ff" },
    { coeff: 2.618, color: "#9c27b0" },
    { coeff: 4.236, color: "#ff9800" }
  ]
};
class X {
  _chart;
  _series;
  _p1;
  _p2;
  _p3;
  _paneViews;
  _options;
  _selected = !1;
  constructor(t, e, i, s, o, l) {
    this._chart = t, this._series = e, this._p1 = i, this._p2 = s, this._p3 = o, this._options = {
      ...je,
      ...l
    }, this._paneViews = [new Ue(this)];
  }
  updatePoints(t, e, i) {
    this._p1 = t, this._p2 = e, this._p3 = i, this.updateAllViews();
  }
  updatePointByIndex(t, e) {
    t === 0 ? this._p1 = e : t === 1 ? this._p2 = e : t === 2 && (this._p3 = e), this.updateAllViews();
  }
  setSelected(t) {
    this._selected = t, this.updateAllViews();
  }
  toolHitTest(t, e) {
    const i = this._chart.timeScale(), s = this._series, o = i.logicalToCoordinate(this._p1.logical), l = s.priceToCoordinate(this._p1.price), a = i.logicalToCoordinate(this._p2.logical), n = s.priceToCoordinate(this._p2.price), r = i.logicalToCoordinate(this._p3.logical), c = s.priceToCoordinate(this._p3.price);
    if (o === null || l === null || a === null || n === null || r === null || c === null)
      return null;
    const p = 8;
    if (Math.hypot(t - o, e - l) < p)
      return { hit: !0, type: "point", index: 0 };
    if (Math.hypot(t - a, e - n) < p)
      return { hit: !0, type: "point", index: 1 };
    if (Math.hypot(t - r, e - c) < p)
      return { hit: !0, type: "point", index: 2 };
    const _ = R({ x: t, y: e }, { x: o, y: l }, { x: a, y: n }), d = R({ x: t, y: e }, { x: a, y: n }, { x: r, y: c });
    if (_ < 5 || d < 5)
      return { hit: !0, type: "line" };
    const u = this._p2.price - this._p1.price, f = Math.min(o, a, r), m = Math.max(o, a, r);
    for (const x of this._options.levels) {
      const v = this._p3.price + u * x.coeff, S = s.priceToCoordinate(v);
      if (S !== null && Math.abs(e - S) < 5 && t >= f && t <= m)
        return { hit: !0, type: "line" };
    }
    return null;
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
}
const ot = "lineTool_templates", gt = 20;
class H {
  /**
   * Generate a unique ID for templates
   */
  static generateId() {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Load all templates from localStorage
   */
  static loadTemplates() {
    try {
      const t = localStorage.getItem(ot);
      if (!t) return [];
      const e = JSON.parse(t);
      return Array.isArray(e) ? e : [];
    } catch (t) {
      return console.error("Failed to load templates:", t), [];
    }
  }
  /**
   * Save a new template
   */
  static saveTemplate(t, e) {
    try {
      const i = this.loadTemplates();
      if (i.length >= gt)
        return console.warn(`Maximum ${gt} templates reached`), null;
      const s = {
        id: this.generateId(),
        name: t.trim() || `Template ${i.length + 1}`,
        created: Date.now(),
        styles: { ...e }
      };
      return i.push(s), localStorage.setItem(ot, JSON.stringify(i)), s;
    } catch (i) {
      return console.error("Failed to save template:", i), null;
    }
  }
  /**
   * Delete a template by ID
   */
  static deleteTemplate(t) {
    try {
      const e = this.loadTemplates(), i = e.filter((s) => s.id !== t);
      return i.length === e.length ? !1 : (localStorage.setItem(ot, JSON.stringify(i)), !0);
    } catch (e) {
      return console.error("Failed to delete template:", e), !1;
    }
  }
  /**
   * Get a template by ID
   */
  static getTemplate(t) {
    return this.loadTemplates().find((i) => i.id === t) || null;
  }
  /**
   * Apply a template to a tool
   */
  static applyTemplate(t, e) {
    const i = this.getTemplate(t);
    if (!i || !e || !e.applyOptions)
      return !1;
    try {
      return e.applyOptions(i.styles), !0;
    } catch (s) {
      return console.error("Failed to apply template:", s), !1;
    }
  }
  /**
   * Extract styles from a tool's current options
   */
  static extractStyles(t) {
    if (!t || !t._options)
      return {};
    const e = t._options;
    return {
      lineColor: e.lineColor,
      color: e.color,
      width: e.width,
      lineWidth: e.lineWidth
      // Add other relevant style properties
    };
  }
}
class C {
  _container;
  _manager;
  _activeTool = null;
  _savedPosition = null;
  // Icons matching the "thin stroke" style of the provided images
  static ICONS = {
    // 6-dot grid handle (Standard TV style)
    drag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 12" width="8" height="12" fill="currentColor"><rect width="2" height="2" rx="1"></rect><rect width="2" height="2" rx="1" y="5"></rect><rect width="2" height="2" rx="1" y="10"></rect><rect width="2" height="2" rx="1" x="6"></rect><rect width="2" height="2" rx="1" x="6" y="5"></rect><rect width="2" height="2" rx="1" x="6" y="10"></rect></svg>',
    // Templates (Grid Layout)
    template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor"><path stroke-linecap="round" d="M15.5 18.5h6m-3 3v-6"></path><rect width="6" height="6" rx="1.5" x="6.5" y="6.5"></rect><rect width="6" height="6" rx="1.5" x="15.5" y="6.5"></rect><rect width="6" height="6" rx="1.5" x="6.5" y="15.5"></rect></svg>',
    // Pencil (Line Color)
    brush: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M10.62.72a2.47 2.47 0 0 1 3.5 0l1.16 1.16c.96.97.96 2.54 0 3.5l-.58.58-8.9 8.9-1 1-.14.14H0v-4.65l.14-.15 1-1 8.9-8.9.58-.58Zm2.8.7a1.48 1.48 0 0 0-2.1 0l-.23.23 3.26 3.26.23-.23c.58-.58.58-1.52 0-2.1l-1.16-1.16Zm.23 4.2-3.26-3.27-8.2 8.2 3.25 3.27 8.2-8.2Zm-8.9 8.9-3.27-3.26-.5.5V15h3.27l.5-.5Z"></path></svg>',
    // Text 'T'
    text: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 15" width="13" height="15" fill="none"><path stroke="currentColor" d="M4 14.5h2.5m2.5 0H6.5m0 0V.5m0 0h-5a1 1 0 0 0-1 1V4m6-3.5h5a1 1 0 0 1 1 1V4"></path></svg>',
    // Paint Bucket (Fill)
    fill: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="none"><path stroke="currentColor" d="M13.5 6.5l-3-3-7 7 7.59 7.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82L13.5 6.5zm0 0v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"></path><path fill="currentColor" d="M0 16.5C0 15 2.5 12 2.5 12S5 15 5 16.5 4 19 2.5 19 0 18 0 16.5z"></path><circle fill="currentColor" cx="9.5" cy="9.5" r="1.5"></circle></svg>',
    // Settings (Gear) - Sleek
    settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M18 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path fill-rule="evenodd" d="M8.5 5h11l5 9-5 9h-11l-5-9 5-9Zm-3.86 9L9.1 6h9.82l4.45 8-4.45 8H9.1l-4.45-8Z"></path></svg>',
    // Alert (Stopwatch +)
    alert: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m19.54 4.5 3.96 4.32-.74.68-3.96-4.32.74-.68ZM7.46 4.5 3.5 8.82l.74.68L8.2 5.18l-.74-.68ZM19.74 10.33A7.5 7.5 0 0 1 21 14.5v.5h1v-.5a8.5 8.5 0 1 0-8.5 8.5h.5v-1h-.5a7.5 7.5 0 1 1 6.24-11.67Z"></path><path fill="currentColor" d="M13 9v5h-3v1h4V9h-1ZM19 20v-4h1v4h4v1h-4v4h-1v-4h-4v-1h4Z"></path></svg>',
    // Lock
    lock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 6 21.5v-7A2.5 2.5 0 0 1 8.5 12H10V9a4 4 0 0 1 8 0h-1a3 3 0 0 0-3-3zm-1 11a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"></path></svg>',
    // Trash
    delete: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18 7h5v1h-2.01l-1.33 14.64a1.5 1.5 0 0 1-1.5 1.36H9.84a1.5 1.5 0 0 1-1.49-1.36L7.01 8H5V7h5V6c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v1Zm-6-2a1 1 0 0 0-1 1v1h6V6a1 1 0 0 0-1-1h-4ZM8.02 8l1.32 14.54a.5.5 0 0 0 .5.46h8.33a.5.5 0 0 0 .5-.46L19.99 8H8.02Z"></path></svg>',
    // More
    more: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path fill="currentColor" fillrule="evenodd" cliprule="evenodd" d="M7.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19 14.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"></path></svg>',
    // Style (Line Style)
    style: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4 13.5h20"></path></svg>'
  };
  constructor(t) {
    this._manager = t, this._container = document.createElement("div"), this._container.className = "tv-floating-toolbar hidden", document.body.appendChild(this._container);
  }
  showCollapsed(t) {
    this._renderCollapsed(t), this._positionToolbar();
  }
  showExpanded(t) {
    this._activeTool = t, this._renderExpanded(t), this._positionToolbar();
  }
  hide() {
    this._container.classList.add("hidden"), this._closeAllDropdowns();
  }
  _positionToolbar() {
    if (this._savedPosition)
      this._show(this._savedPosition.x, this._savedPosition.y);
    else {
      const t = this._manager.getChartRect(), e = this._container.getBoundingClientRect();
      if (t) {
        const i = t.right - e.width - 100, s = t.top + 15;
        this._show(i, s);
      } else {
        const i = window.innerWidth - e.width - 100;
        this._show(i, 100);
      }
    }
  }
  updatePosition(t, e) {
    if (this._container.classList.contains("hidden")) return;
    const i = this._container.getBoundingClientRect(), s = this._manager.getChartRect();
    let o = 10, l = 10, a = window.innerWidth - i.width - 10, n = window.innerHeight - i.height - 10;
    s && (o = s.left, l = s.top, a = s.right - i.width, n = s.bottom - i.height);
    const r = Math.min(Math.max(o, t), a), c = Math.min(Math.max(l, e), n);
    this._container.style.left = `${r}px`, this._container.style.top = `${c}px`;
  }
  _show(t, e) {
    this._container.classList.remove("hidden"), this.updatePosition(t, e);
  }
  _renderCollapsed(t) {
    this._container.innerHTML = "", this._container.dataset.tool = t, this._container.appendChild(this._createDragHandle());
    let e = C.ICONS.brush;
    t === "Text" && (e = C.ICONS.text), t === "UserPriceAlerts" && (e = C.ICONS.alert);
    const i = this._createButton(e, t);
    i.classList.add("active"), this._container.appendChild(i);
  }
  _renderExpanded(t) {
    this._container.innerHTML = "", this._container.appendChild(this._createDragHandle());
    const e = this._createToolWrapper(), i = this._createButton(C.ICONS.template, "Templates");
    i.addEventListener("click", (_) => this._toggleDropdown(_, e, (d) => this._createTemplateList(d, t))), e.appendChild(i), this._container.appendChild(e);
    const s = t._options || {}, o = this._createToolWrapper(), l = s.lineColor || s.borderColor || s.color || "#2962ff", a = this._createFillButton(C.ICONS.brush, "Line Color", l);
    if (a.addEventListener("click", (_) => this._toggleDropdown(_, o, (d) => this._createColorGrid(d, t, "line", a))), o.appendChild(a), this._container.appendChild(o), s.backgroundColor !== void 0) {
      const _ = this._createToolWrapper(), d = this._createFillButton(C.ICONS.fill, "Fill Color", s.backgroundColor);
      d.addEventListener("click", (u) => this._toggleDropdown(u, _, (f) => this._createColorGrid(f, t, "fill", d))), _.appendChild(d), this._container.appendChild(_);
    }
    if (t.toolType === "Text" || s.textColor !== void 0 && s.backgroundColor !== void 0) {
      const _ = this._createToolWrapper(), d = s.textColor || "#131722", u = this._createFillButton(C.ICONS.text, "Text Color", d);
      u.addEventListener("click", (f) => this._toggleDropdown(f, _, (m) => this._createColorGrid(m, t, "text", u))), _.appendChild(u), this._container.appendChild(_);
    }
    if (this._addSeparator(), s.lineWidth !== void 0 || s.width !== void 0) {
      const _ = this._createToolWrapper(), d = document.createElement("div");
      d.className = "stroke-width-trigger", d.title = "Line Width";
      const u = s.lineWidth || s.width || 1, f = document.createElement("div");
      f.className = "stroke-width-preview", f.style.height = `${Math.max(1, u)}px`;
      const m = document.createElement("span");
      m.textContent = `${u}px`, d.appendChild(f), d.appendChild(m), d.addEventListener("click", (x) => this._toggleDropdown(x, _, (v) => this._createWidthList(v, t, f, m))), _.appendChild(d), this._container.appendChild(_);
    }
    this._addSeparator(), this._container.appendChild(this._createButton(C.ICONS.settings, "Settings"));
    const n = this._createButton(C.ICONS.alert, "Add Alert");
    n.addEventListener("click", (_) => {
      _.stopPropagation(), _.preventDefault(), this._activeTool && this._manager.createAlertForTool(this._activeTool);
    }), this._container.appendChild(n);
    const r = this._createButton(C.ICONS.lock, "Lock");
    (t._locked || !1) && r.classList.add("active"), r.addEventListener("click", (_) => {
      _.stopPropagation(), _.preventDefault(), this._activeTool && (this._manager.toggleToolLock(this._activeTool), this._activeTool._locked ? r.classList.add("active") : r.classList.remove("active"));
    }), this._container.appendChild(r);
    const p = this._createButton(C.ICONS.delete, "Remove");
    p.addEventListener("click", (_) => {
      _.stopPropagation(), _.preventDefault(), this._activeTool && this._manager.deleteTool(this._activeTool);
    }), this._container.appendChild(p), this._container.appendChild(this._createButton(C.ICONS.more, "More"));
  }
  _createDragHandle() {
    const t = document.createElement("div");
    return t.className = "drag-handle", t.innerHTML = C.ICONS.drag, t.addEventListener("mousedown", (e) => this._startDrag(e)), t;
  }
  _createToolWrapper() {
    const t = document.createElement("div");
    return t.className = "tool-wrapper", t;
  }
  _createButton(t, e) {
    const i = document.createElement("button");
    return i.className = "tool-btn", i.innerHTML = t, i.title = e, i;
  }
  _createFillButton(t, e, i) {
    const s = document.createElement("button");
    s.className = "tool-btn fill-btn", s.title = e;
    const o = document.createElement("div");
    o.className = "fill-btn-wrap";
    const l = document.createElement("span");
    l.className = "fill-btn-icon", l.innerHTML = t;
    const a = document.createElement("div");
    a.className = "fill-btn-color-bg";
    const n = document.createElement("div");
    return n.className = "fill-btn-color", n.style.backgroundColor = i, a.appendChild(n), o.appendChild(l), o.appendChild(a), s.appendChild(o), s;
  }
  _addSeparator() {
    const t = document.createElement("div");
    t.className = "divider", this._container.appendChild(t);
  }
  _toggleDropdown(t, e, i) {
    t.stopPropagation();
    const s = e.querySelector(".tv-floating-toolbar__dropdown");
    if (s && s.classList.contains("visible")) {
      s.classList.remove("visible");
      return;
    }
    this._closeAllDropdowns();
    let o = e.querySelector(".tv-floating-toolbar__dropdown");
    o || (o = document.createElement("div"), o.className = "tv-floating-toolbar__dropdown", e.appendChild(o)), o.innerHTML = "", i(o), requestAnimationFrame(() => o.classList.add("visible"));
    const l = () => {
      o.classList.remove("visible"), document.removeEventListener("click", l);
    };
    setTimeout(() => document.addEventListener("click", l), 0), o.addEventListener("click", (a) => a.stopPropagation());
  }
  _closeAllDropdowns() {
    this._container.querySelectorAll(".tv-floating-toolbar__dropdown.visible").forEach((e) => e.classList.remove("visible"));
  }
  // --- Content Generators ---
  _createWidthList(t, e, i, s) {
    const o = [1, 2, 3, 4], l = e._options?.lineWidth || e._options?.width || 1;
    o.forEach((a) => {
      const n = document.createElement("div");
      n.className = "tv-width-picker__item", a === l && n.classList.add("active"), n.innerHTML = `
                <div class="tv-width-picker__line" style="height: ${a}px"></div>
                <div class="tv-width-picker__text">${a}px</div>
            `, n.addEventListener("click", () => {
        this._applyWidth(e, a), i.style.height = `${a}px`, s.textContent = `${a}px`, t.classList.remove("visible");
      }), t.appendChild(n);
    });
  }
  _createTemplateList(t, e) {
    const i = document.createElement("div");
    i.className = "tv-template-item", i.innerHTML = "<span>Save Drawing Template As...</span>", i.addEventListener("click", () => {
      this._saveTemplate(e), t.classList.remove("visible");
    }), t.appendChild(i);
    const s = document.createElement("div");
    s.className = "tv-template-item", s.innerHTML = "<span>Apply Default Drawing Template</span>", t.appendChild(s);
    const o = H.loadTemplates();
    if (o.length > 0) {
      const l = document.createElement("div");
      l.className = "tv-dropdown-separator", t.appendChild(l), o.forEach((a) => {
        const n = document.createElement("div");
        n.className = "tv-template-item", n.innerHTML = `
                    <span class="tv-template-item__name">${this._escapeHtml(a.name)}</span>
                    <button class="tv-template-item__delete" title="Delete template">×</button>
                `, n.querySelector(".tv-template-item__name")?.addEventListener("click", () => {
          H.applyTemplate(a.id, e) && this._renderExpanded(e);
        }), n.querySelector(".tv-template-item__delete")?.addEventListener("click", (r) => {
          r.stopPropagation(), H.deleteTemplate(a.id) && (t.innerHTML = "", this._createTemplateList(t, e));
        }), t.appendChild(n);
      });
    }
  }
  _createColorGrid(t, e, i, s) {
    const o = [
      "#ffffff",
      "#e1e1e1",
      "#b2b5be",
      "#787b86",
      "#5d606b",
      "#434651",
      "#2a2e39",
      "#131722",
      "#f23645",
      "#ff9800",
      "#ffe600",
      "#4caf50",
      "#00bcd4",
      "#2962ff",
      "#673ab7",
      "#9c27b0",
      "#ef9a9a",
      "#ffe0b2",
      "#fff9c4",
      "#c8e6c9",
      "#b2ebf2",
      "#bbdefb",
      "#d1c4e9",
      "#e1bee7",
      "#e57373",
      "#ffcc80",
      "#fff59d",
      "#a5d6a7",
      "#80deea",
      "#90caf9",
      "#b39ddb",
      "#ce93d8",
      "#ef5350",
      "#ffb74d",
      "#fff176",
      "#81c784",
      "#4dd0e1",
      "#64b5f6",
      "#9575cd",
      "#ba68c8",
      "#e53935",
      "#ffa726",
      "#ffee58",
      "#66bb6a",
      "#26c6da",
      "#42a5f5",
      "#7e57c2",
      "#ab47bc",
      "#d32f2f",
      "#fb8c00",
      "#fdd835",
      "#43a047",
      "#00acc1",
      "#1e88e5",
      "#5e35b1",
      "#8e24aa",
      "#c62828",
      "#f57c00",
      "#fbc02d",
      "#388e3c",
      "#0097a7",
      "#1976d2",
      "#512da8",
      "#7b1fa2"
    ], l = document.createElement("div");
    l.className = "tv-color-picker__grid";
    const a = e._options || {};
    let n = i === "line" ? a.lineColor || a.borderColor || a.color || "#2962ff" : i === "text" ? a.textColor || "#131722" : a.backgroundColor || "#2962ff";
    o.forEach((_) => {
      const d = document.createElement("div");
      d.className = "tv-color-picker__swatch", d.style.backgroundColor = _, n.toLowerCase().startsWith(_.toLowerCase()) && d.classList.add("active"), d.addEventListener("click", () => {
        this._applyColor(e, _, i);
        const u = s.querySelector(".fill-btn-color");
        u && (u.style.backgroundColor = _), this._updateOpacitySlider(t, _);
      }), l.appendChild(d);
    }), t.appendChild(l);
    const r = document.createElement("div");
    r.className = "tv-dropdown-separator", t.appendChild(r);
    const c = document.createElement("div");
    c.className = "tv-color-picker__custom-btn", c.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>';
    const p = document.createElement("input");
    p.type = "color", p.className = "tv-color-picker__input", p.addEventListener("input", (_) => {
      this._applyColor(e, _.target.value, i);
      const d = s.querySelector(".fill-btn-color");
      d && (d.style.backgroundColor = _.target.value), this._updateOpacitySlider(t, _.target.value);
    }), c.appendChild(p), t.appendChild(c), this._renderOpacitySlider(t, e, i);
  }
  _renderOpacitySlider(t, e, i) {
    const s = document.createElement("div");
    s.className = "tv-opacity-slider";
    const o = document.createElement("div");
    o.className = "tv-opacity-slider__label", o.textContent = "Opacity", s.appendChild(o);
    const l = document.createElement("div");
    l.className = "tv-opacity-slider__controls";
    const a = document.createElement("div");
    a.className = "tv-opacity-slider__track";
    const n = document.createElement("div");
    n.className = "tv-opacity-slider__thumb", a.appendChild(n), l.appendChild(a);
    const r = document.createElement("div");
    r.className = "tv-opacity-slider__value", l.appendChild(r), s.appendChild(l), t.appendChild(s);
    const c = e._options || {};
    let p = i === "line" ? c.lineColor || c.borderColor || c.color || "#2962ff" : c.backgroundColor || "#2962ff", _ = 1;
    if (p.startsWith("rgba")) {
      const f = p.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
      f && (_ = parseFloat(f[1]));
    }
    const d = Math.round(_ * 100);
    n.style.left = `${d}%`, r.innerText = `${d}%`;
    const u = (f) => {
      const m = a.getBoundingClientRect();
      let x = f - m.left;
      x = Math.max(0, Math.min(x, m.width));
      const v = Math.round(x / m.width * 100);
      n.style.left = `${v}%`, r.innerText = `${v}%`, this._applyOpacity(e, v / 100, i);
    };
    a.addEventListener("mousedown", (f) => {
      u(f.clientX);
      const m = (v) => u(v.clientX), x = () => {
        document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", x);
      };
      document.addEventListener("mousemove", m), document.addEventListener("mouseup", x), f.preventDefault();
    });
  }
  _updateOpacitySlider(t, e) {
    const i = t.querySelector(".tv-opacity-slider__track");
    i && (i.style.background = `linear-gradient(to right, #E0E3EB 0%, ${e} 100%)`);
  }
  _applyOpacity(t, e, i) {
    const s = t._options || {};
    let o = i === "line" ? s.lineColor || s.borderColor || s.color || "#2962ff" : i === "text" ? s.textColor || "#131722" : s.backgroundColor || "#2962ff";
    if (o.startsWith("#")) {
      const l = parseInt(o.slice(1, 3), 16), a = parseInt(o.slice(3, 5), 16), n = parseInt(o.slice(5, 7), 16);
      o = `rgba(${l}, ${a}, ${n}, ${e})`;
    } else o.startsWith("rgb") && (o = o.replace(/[\d\.]+\)$/g, `${e})`));
    this._applyColor(t, o, i);
  }
  _applyColor(t, e, i) {
    const s = t._options || {};
    let o = i === "line" ? s.lineColor || s.borderColor || s.color || "#2962ff" : s.backgroundColor || "#2962ff";
    if (!e.startsWith("rgba")) {
      let n = 1;
      if (o.startsWith("rgba")) {
        const r = o.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
        r && (n = parseFloat(r[1]));
      }
      if (n < 1 && e.startsWith("#")) {
        const r = parseInt(e.slice(1, 3), 16), c = parseInt(e.slice(3, 5), 16), p = parseInt(e.slice(5, 7), 16);
        e = `rgba(${r}, ${c}, ${p}, ${n})`;
      }
    }
    const l = {};
    i === "line" ? (s.lineColor !== void 0 && (l.lineColor = e), s.borderColor !== void 0 && (l.borderColor = e), s.color !== void 0 && (l.color = e), s.textColor !== void 0 && s.backgroundColor === void 0 && (l.textColor = e)) : i === "text" ? s.textColor !== void 0 && (l.textColor = e) : s.backgroundColor !== void 0 && (l.backgroundColor = e), t.applyOptions(l);
    const a = t.toolType || t.constructor.name;
    this._manager.updateToolOptions(a, l);
  }
  _applyWidth(t, e) {
    const i = {};
    t._options?.lineWidth !== void 0 && (i.lineWidth = e), t._options?.width !== void 0 && (i.width = e), t.applyOptions(i);
    const s = t.toolType || t.constructor.name;
    this._manager.updateToolOptions(s, i);
  }
  _saveTemplate(t) {
    const e = prompt("Enter template name:");
    if (!e) return;
    const i = H.extractStyles(t);
    H.saveTemplate(e, i);
  }
  _escapeHtml(t) {
    const e = document.createElement("div");
    return e.textContent = t, e.innerHTML;
  }
  _startDrag(t) {
    t.preventDefault();
    const e = t.clientX, i = t.clientY, s = this._container.getBoundingClientRect(), o = s.left, l = s.top, a = (r) => {
      const c = r.clientX - e, p = r.clientY - i;
      let _ = o + c, d = l + p;
      const u = this._manager.getChartRect();
      let f = 0, m = 0, x = window.innerWidth - s.width, v = window.innerHeight - s.height;
      u && (f = u.left, m = u.top, x = u.right - s.width, v = u.bottom - s.height), _ = Math.max(f, Math.min(_, x)), d = Math.max(m, Math.min(d, v)), this._container.style.left = `${_}px`, this._container.style.top = `${d}px`;
    }, n = () => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", n);
      const r = this._container.getBoundingClientRect();
      this._savedPosition = { x: r.left, y: r.top };
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", n);
  }
}
class Ye {
  _viewData;
  constructor(t) {
    this._viewData = t;
  }
  draw(t) {
    const e = this._viewData.data;
    t.useBitmapCoordinateSpace((i) => {
      const s = i.context, o = 0, l = i.bitmapSize.height, a = i.horizontalPixelRatio * this._viewData.barWidth / 2, n = -1 * (a + 1), r = i.bitmapSize.width;
      e.forEach((c) => {
        const p = c.x * i.horizontalPixelRatio;
        if (p < n) return;
        s.fillStyle = c.color || "rgba(0, 0, 0, 0)";
        const _ = Math.max(0, Math.round(p - a)), d = Math.min(r, Math.round(p + a));
        s.fillRect(_, o, d - _, l);
      });
    });
  }
}
class qe {
  _source;
  _data;
  constructor(t) {
    this._source = t, this._data = {
      data: [],
      barWidth: 6,
      options: this._source._options
    };
  }
  update() {
    const t = this._source.chart.timeScale();
    this._data.data = this._source._backgroundColors.map((e) => ({
      x: t.timeToCoordinate(e.time) ?? -100,
      color: e.color
    })), this._data.data.length > 1 ? this._data.barWidth = this._data.data[1].x - this._data.data[0].x : this._data.barWidth = 6;
  }
  renderer() {
    return new Ye(this._data);
  }
  zOrder() {
    return "bottom";
  }
}
const Ze = {};
class mt extends wt {
  _paneViews;
  _seriesData = [];
  _backgroundColors = [];
  _options;
  _highlighter;
  constructor(t, e = {}) {
    super(), this._highlighter = t, this._options = { ...Ze, ...e }, this._paneViews = [new qe(this)];
  }
  updateAllViews() {
    this._paneViews.forEach((t) => t.update());
  }
  paneViews() {
    return this._paneViews;
  }
  attached(t) {
    super.attached(t), this.dataUpdated("full");
  }
  dataUpdated(t) {
    this._backgroundColors = this.series.data().map((e) => ({
      time: e.time,
      color: this._highlighter(e.time)
    })), this.requestUpdate();
  }
}
const U = 21, bt = 21, Je = 17, nt = 4, Ge = 2, yt = 13, xt = 13, vt = 50, St = 5.81, A = 26, Mt = 20, at = 9, Ke = [
  new Path2D(
    "M5.34004 1.12254C4.7902 0.438104 3.94626 0 3 0C1.34315 0 0 1.34315 0 3C0 3.94626 0.438104 4.7902 1.12254 5.34004C1.04226 5.714 1 6.10206 1 6.5C1 9.36902 3.19675 11.725 6 11.9776V10.9725C3.75002 10.7238 2 8.81628 2 6.5C2 4.01472 4.01472 2 6.5 2C8.81628 2 10.7238 3.75002 10.9725 6H11.9776C11.9574 5.77589 11.9237 5.55565 11.8775 5.34011C12.562 4.79026 13.0001 3.9463 13.0001 3C13.0001 1.34315 11.6569 0 10.0001 0C9.05382 0 8.20988 0.438111 7.66004 1.12256C7.28606 1.04227 6.89797 1 6.5 1C6.10206 1 5.714 1.04226 5.34004 1.12254ZM4.28255 1.46531C3.93534 1.17484 3.48809 1 3 1C1.89543 1 1 1.89543 1 3C1 3.48809 1.17484 3.93534 1.46531 4.28255C2.0188 3.02768 3.02768 2.0188 4.28255 1.46531ZM8.71751 1.46534C9.97237 2.01885 10.9812 3.02774 11.5347 4.28262C11.8252 3.93541 12.0001 3.48812 12.0001 3C12.0001 1.89543 11.1047 1 10.0001 1C9.51199 1 9.06472 1.17485 8.71751 1.46534Z"
  ),
  new Path2D("M7 7V4H8V8H5V7H7Z"),
  new Path2D("M10 8V10H8V11H10V13H11V11H13V10H11V8H10Z")
], Qe = [
  new Path2D(
    "M5.11068 1.65894C3.38969 2.08227 1.98731 3.31569 1.33103 4.93171C0.938579 4.49019 0.700195 3.90868 0.700195 3.27148C0.700195 1.89077 1.81948 0.771484 3.2002 0.771484C3.9664 0.771484 4.65209 1.11617 5.11068 1.65894Z"
  ),
  new Path2D(
    "M12.5 3.37148C12.5 4.12192 12.1694 4.79514 11.6458 5.25338C11.0902 3.59304 9.76409 2.2857 8.09208 1.7559C8.55066 1.21488 9.23523 0.871484 10 0.871484C11.3807 0.871484 12.5 1.99077 12.5 3.37148Z"
  ),
  new Path2D(
    "M6.42896 11.4999C8.91424 11.4999 10.929 9.48522 10.929 6.99994C10.929 4.51466 8.91424 2.49994 6.42896 2.49994C3.94367 2.49994 1.92896 4.51466 1.92896 6.99994C1.92896 9.48522 3.94367 11.4999 6.42896 11.4999ZM6.00024 3.99994V6.99994H4.00024V7.99994H7.00024V3.99994H6.00024Z"
  ),
  new Path2D(
    "M4.08902 0.934101C4.4888 1.08621 4.83946 1.33793 5.11068 1.65894C5.06565 1.67001 5.02084 1.68164 4.97625 1.69382C4.65623 1.78123 4.34783 1.89682 4.0539 2.03776C3.16224 2.4653 2.40369 3.12609 1.8573 3.94108C1.64985 4.2505 1.47298 4.58216 1.33103 4.93171C1.05414 4.6202 0.853937 4.23899 0.760047 3.81771C0.720863 3.6419 0.700195 3.45911 0.700195 3.27148C0.700195 1.89077 1.81948 0.771484 3.2002 0.771484C3.51324 0.771484 3.81285 0.829023 4.08902 0.934101ZM12.3317 4.27515C12.4404 3.99488 12.5 3.69015 12.5 3.37148C12.5 1.99077 11.3807 0.871484 10 0.871484C9.66727 0.871484 9.34974 0.936485 9.05938 1.05448C8.68236 1.20769 8.35115 1.45027 8.09208 1.7559C8.43923 1.8659 8.77146 2.00942 9.08499 2.18265C9.96762 2.67034 10.702 3.39356 11.2032 4.26753C11.3815 4.57835 11.5303 4.90824 11.6458 5.25338C11.947 4.98973 12.1844 4.65488 12.3317 4.27515ZM9.18112 3.43939C8.42029 2.85044 7.46556 2.49994 6.42896 2.49994C3.94367 2.49994 1.92896 4.51466 1.92896 6.99994C1.92896 9.48522 3.94367 11.4999 6.42896 11.4999C8.91424 11.4999 10.929 9.48522 10.929 6.99994C10.929 5.55126 10.2444 4.26246 9.18112 3.43939ZM6.00024 3.99994H7.00024V7.99994H4.00024V6.99994H6.00024V3.99994Z"
  )
], ti = 10, ei = new Path2D(
  "M9.35359 1.35359C9.11789 1.11789 8.88219 0.882187 8.64648 0.646484L5.00004 4.29293L1.35359 0.646484C1.11791 0.882212 0.882212 1.11791 0.646484 1.35359L4.29293 5.00004L0.646484 8.64648C0.882336 8.88204 1.11804 9.11774 1.35359 9.35359L5.00004 5.70714L8.64648 9.35359C8.88217 9.11788 9.11788 8.88217 9.35359 8.64649L5.70714 5.00004L9.35359 1.35359Z"
);
class M {
  _listeners = [];
  subscribe(t, e, i) {
    const s = {
      callback: t,
      linkedObject: e,
      singleshot: i === !0
    };
    this._listeners.push(s);
  }
  unsubscribe(t) {
    const e = this._listeners.findIndex(
      (i) => t === i.callback
    );
    e > -1 && this._listeners.splice(e, 1);
  }
  unsubscribeAll(t) {
    this._listeners = this._listeners.filter(
      (e) => e.linkedObject !== t
    );
  }
  fire(t) {
    const e = [...this._listeners];
    this._listeners = this._listeners.filter(
      (i) => !i.singleshot
    ), e.forEach(
      (i) => i.callback(t)
    );
  }
  hasListeners() {
    return this._listeners.length > 0;
  }
  destroy() {
    this._listeners = [];
  }
}
class ii {
  _chart = void 0;
  _series = void 0;
  _unSubscribers = [];
  _clicked = new M();
  _mouseMoved = new M();
  _mouseDown = new M();
  _mouseUp = new M();
  attached(t, e) {
    this._chart = t, this._series = e;
    const i = this._chart.chartElement();
    this._addMouseEventListener(
      i,
      "mouseleave",
      this._mouseLeave
    ), this._addMouseEventListener(
      i,
      "mousemove",
      this._mouseMove
    ), this._addMouseEventListener(
      i,
      "click",
      this._mouseClick
    ), this._addMouseEventListener(
      i,
      "mousedown",
      this._handleMouseDown
    ), this._addMouseEventListener(
      i,
      "mouseup",
      this._handleMouseUp
    );
  }
  detached() {
    this._series = void 0, this._clicked.destroy(), this._mouseMoved.destroy(), this._mouseDown.destroy(), this._mouseUp.destroy(), this._unSubscribers.forEach((t) => {
      t();
    }), this._unSubscribers = [];
  }
  clicked() {
    return this._clicked;
  }
  mouseMoved() {
    return this._mouseMoved;
  }
  mouseDown() {
    return this._mouseDown;
  }
  mouseUp() {
    return this._mouseUp;
  }
  _addMouseEventListener(t, e, i) {
    const s = i.bind(this);
    t.addEventListener(e, s);
    const o = () => {
      t.removeEventListener(e, s);
    };
    this._unSubscribers.push(o);
  }
  _mouseLeave() {
    this._mouseMoved.fire(null);
  }
  _mouseMove(t) {
    this._mouseMoved.fire(this._determineMousePosition(t));
  }
  _mouseClick(t) {
    this._clicked.fire(this._determineMousePosition(t));
  }
  _handleMouseDown(t) {
    this._mouseDown.fire(this._determineMousePosition(t));
  }
  _handleMouseUp(t) {
    this._mouseUp.fire(this._determineMousePosition(t));
  }
  _determineMousePosition(t) {
    if (!this._chart || !this._series) return null;
    const e = this._chart.chartElement(), i = e.getBoundingClientRect(), s = this._series.priceScale().width(), o = this._chart.timeScale().height(), l = t.clientX - i.x, a = t.clientY - i.y, n = a > e.clientHeight - o, r = e.clientWidth - s - l, c = r < 0;
    return {
      x: l,
      y: a,
      xPositionRelativeToPriceScale: r,
      overPriceScale: c,
      overTimeScale: n
    };
  }
}
class Rt {
  _data = null;
  update(t) {
    this._data = t;
  }
}
function si(h) {
  return Math.floor(h * 0.5);
}
function F(h, t, e = 1, i) {
  const s = Math.round(t * h), o = Math.round(e * t), l = si(o);
  return { position: s - l, length: o };
}
class oi extends Rt {
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      if (!this._data) return;
      this._drawAlertLines(e), this._drawAlertIcons(e), this._data.alerts.some(
        (s) => s.showHover && s.hoverRemove
      ) || (this._drawCrosshairLine(e), this._drawCrosshairLabelButton(e)), this._drawAlertLabel(e);
    });
  }
  _drawHorizontalLine(t, e) {
    const i = t.context;
    try {
      const s = F(
        e.y,
        t.verticalPixelRatio,
        e.lineWidth
      ), o = s.position + s.length / 2;
      i.save(), i.beginPath(), i.lineWidth = e.lineWidth, i.strokeStyle = e.color;
      const l = 4 * t.horizontalPixelRatio;
      i.setLineDash([l, l]), i.moveTo(0, o), i.lineTo(
        (e.width - U) * t.horizontalPixelRatio,
        o
      ), i.stroke();
    } finally {
      i.restore();
    }
  }
  _drawAlertLines(t) {
    if (!this._data?.alerts) return;
    const e = this._data.color;
    this._data.alerts.forEach((i) => {
      this._drawHorizontalLine(t, {
        width: t.mediaSize.width,
        lineWidth: 1,
        color: e,
        y: i.y
      });
    });
  }
  _drawAlertIcons(t) {
    if (!this._data?.alerts) return;
    const e = this._data.color, i = this._data.alertIcon;
    this._data.alerts.forEach((s) => {
      this._drawLabel(t, {
        width: t.mediaSize.width,
        labelHeight: Je,
        y: s.y,
        roundedCorners: 2,
        icon: i,
        iconScaling: xt / yt,
        padding: {
          left: nt,
          top: Ge
        },
        color: e
      });
    });
  }
  _calculateLabelWidth(t) {
    return at * 2 + A + t * St;
  }
  _drawAlertLabel(t) {
    if (!this._data?.alerts) return;
    const e = t.context, i = this._data.alerts.find((a) => a.showHover);
    if (!i || !i.showHover) return;
    const s = this._calculateLabelWidth(i.text.length), o = F(
      t.mediaSize.width / 2,
      t.horizontalPixelRatio,
      s
    ), l = F(
      i.y,
      t.verticalPixelRatio,
      Mt
    );
    e.save();
    try {
      const a = 4 * t.horizontalPixelRatio;
      e.beginPath(), e.roundRect(
        o.position,
        l.position,
        o.length,
        l.length,
        a
      ), e.fillStyle = "#FFFFFF", e.fill();
      const n = o.position + o.length - A * t.horizontalPixelRatio;
      i.hoverRemove && (e.beginPath(), e.roundRect(
        n,
        l.position,
        A * t.horizontalPixelRatio,
        l.length,
        [0, a, a, 0]
      ), e.fillStyle = "#F0F3FA", e.fill()), e.beginPath();
      const r = F(
        n / t.horizontalPixelRatio,
        t.horizontalPixelRatio,
        1
      );
      e.fillStyle = "#F1F3FB", e.fillRect(
        r.position,
        l.position,
        r.length,
        l.length
      ), e.beginPath(), e.roundRect(
        o.position,
        l.position,
        o.length,
        l.length,
        a
      ), e.strokeStyle = "#131722", e.lineWidth = 1 * t.horizontalPixelRatio, e.stroke(), e.beginPath(), e.fillStyle = "#131722", e.textBaseline = "middle", e.font = `${Math.round(12 * t.verticalPixelRatio)}px sans-serif`, e.fillText(
        i.text,
        o.position + at * t.horizontalPixelRatio,
        i.y * t.verticalPixelRatio
      ), e.beginPath();
      const c = 9;
      e.translate(
        n + t.horizontalPixelRatio * (A - c) / 2,
        (i.y - 5) * t.verticalPixelRatio
      );
      const p = c / ti * t.horizontalPixelRatio;
      e.scale(p, p), e.fillStyle = "#131722", e.fill(ei, "evenodd");
    } finally {
      e.restore();
    }
  }
  _drawCrosshairLine(t) {
    this._data?.crosshair && this._drawHorizontalLine(t, {
      width: t.mediaSize.width,
      lineWidth: 1,
      color: this._data.color,
      y: this._data.crosshair.y
    });
  }
  _drawCrosshairLabelButton(t) {
    !this._data?.button || !this._data?.crosshair || this._drawLabel(t, {
      width: t.mediaSize.width,
      labelHeight: bt,
      y: this._data.crosshair.y,
      roundedCorners: [2, 0, 0, 2],
      icon: this._data.button.crosshairLabelIcon,
      iconScaling: xt / yt,
      padding: {
        left: nt,
        top: nt
      },
      color: this._data.button.hovering ? this._data.button.hoverColor : this._data.color
    });
  }
  _drawLabel(t, e) {
    const i = t.context;
    try {
      i.save(), i.beginPath();
      const s = F(
        e.y,
        t.verticalPixelRatio,
        e.labelHeight
      ), o = (e.width - (U + 1)) * t.horizontalPixelRatio;
      i.roundRect(
        o,
        s.position,
        U * t.horizontalPixelRatio,
        s.length,
        ni(e.roundedCorners, t.horizontalPixelRatio)
      ), i.fillStyle = e.color, i.fill(), i.beginPath(), i.translate(
        o + e.padding.left * t.horizontalPixelRatio,
        s.position + e.padding.top * t.verticalPixelRatio
      ), i.scale(
        e.iconScaling * t.horizontalPixelRatio,
        e.iconScaling * t.verticalPixelRatio
      ), i.fillStyle = "#FFFFFF", e.icon.forEach((l) => {
        i.beginPath(), i.fill(l, "evenodd");
      });
    } finally {
      i.restore();
    }
  }
}
function ni(h, t) {
  return typeof h == "number" ? h * t : h.map((e) => e * t);
}
class li extends Rt {
  draw(t) {
    t.useBitmapCoordinateSpace((e) => {
      this._data && this._drawCrosshairLabel(e);
    });
  }
  _drawCrosshairLabel(t) {
    if (!this._data?.crosshair) return;
    const e = t.context;
    try {
      const s = t.bitmapSize.width - 8 * t.horizontalPixelRatio;
      e.save(), e.beginPath(), e.fillStyle = this._data.color;
      const o = F(this._data.crosshair.y, t.verticalPixelRatio, bt), l = 2 * t.horizontalPixelRatio;
      e.roundRect(
        0,
        o.position,
        s,
        o.length,
        [0, l, l, 0]
      ), e.fill(), e.beginPath(), e.fillStyle = "#FFFFFF", e.textBaseline = "middle", e.textAlign = "right", e.font = `${Math.round(12 * t.verticalPixelRatio)}px sans-serif`;
      const a = e.measureText(this._data.crosshair.text);
      e.fillText(
        this._data.crosshair.text,
        a.width + 10 * t.horizontalPixelRatio,
        this._data.crosshair.y * t.verticalPixelRatio
      );
    } finally {
      e.restore();
    }
  }
}
class Tt {
  _renderer;
  constructor(t) {
    this._renderer = t ? new li() : new oi();
  }
  zOrder() {
    return "top";
  }
  renderer() {
    return this._renderer;
  }
  update(t) {
    this._renderer.update(t);
  }
}
class ai {
  _alertAdded = new M();
  _alertRemoved = new M();
  _alertChanged = new M();
  _alertsChanged = new M();
  _alerts;
  constructor() {
    this._alerts = /* @__PURE__ */ new Map(), this._alertsChanged.subscribe(() => {
      this._updateAlertsArray();
    }, this);
  }
  destroy() {
    this._alertsChanged.unsubscribeAll(this);
  }
  alertAdded() {
    return this._alertAdded;
  }
  alertRemoved() {
    return this._alertRemoved;
  }
  alertChanged() {
    return this._alertChanged;
  }
  alertsChanged() {
    return this._alertsChanged;
  }
  addAlert(t) {
    return this.addAlertWithCondition(t, "crossing");
  }
  addAlertWithCondition(t, e) {
    const i = this._getNewId(), s = {
      price: t,
      id: i,
      condition: e
    };
    return this._alerts.set(i, s), this._alertAdded.fire(s), this._alertsChanged.fire(), i;
  }
  removeAlert(t) {
    this._alerts.has(t) && (this._alerts.delete(t), this._alertRemoved.fire(t), this._alertsChanged.fire());
  }
  updateAlertPrice(t, e) {
    const i = this._alerts.get(t);
    i && (i.price = e, this._alertChanged.fire(i), this._alertsChanged.fire());
  }
  updateAlert(t, e, i) {
    const s = this._alerts.get(t);
    s && (s.price = e, s.condition = i, this._alertChanged.fire(s), this._alertsChanged.fire());
  }
  alerts() {
    return this._alertsArray;
  }
  _alertsArray = [];
  _updateAlertsArray() {
    this._alertsArray = Array.from(this._alerts.values()).sort((t, e) => e.price - t.price);
  }
  _getNewId() {
    let t = Math.round(Math.random() * 1e6).toString(16);
    for (; this._alerts.has(t); )
      t = Math.round(Math.random() * 1e6).toString(16);
    return t;
  }
}
class ri {
  _overlay = null;
  _onSave = null;
  _currentData = null;
  constructor() {
    this._injectStyles();
  }
  _injectStyles() {
    const t = "alert-edit-dialog-styles";
    if (document.getElementById(t)) return;
    const e = `
            .alert-edit-dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.4);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif;
            }

            .alert-edit-dialog {
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                width: 400px;
                max-width: 90%;
                overflow: hidden;
                animation: dialogFadeIn 0.2s ease-out;
            }

            .alert-edit-dialog-header {
                padding: 16px 20px;
                border-bottom: 1px solid #E0E3EB;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .alert-edit-dialog-title {
                font-size: 18px;
                font-weight: 600;
                color: #131722;
                margin: 0;
            }

            .alert-edit-dialog-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #787B86;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }

            .alert-edit-dialog-close:hover {
                background: #F0F3FA;
                color: #131722;
            }

            .alert-edit-dialog-content {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .alert-edit-form-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .alert-edit-label {
                font-size: 14px;
                color: #787B86;
            }

            .alert-edit-input, .alert-edit-select {
                padding: 8px 12px;
                border: 1px solid #E0E3EB;
                border-radius: 4px;
                font-size: 14px;
                color: #131722;
                outline: none;
                transition: border-color 0.2s;
            }

            .alert-edit-input:focus, .alert-edit-select:focus {
                border-color: #2962FF;
            }

            .alert-edit-dialog-footer {
                padding: 16px 20px;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                border-top: 1px solid #E0E3EB;
                background: #F8F9FD;
            }

            .alert-edit-btn {
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                border: none;
                transition: background 0.2s;
            }

            .alert-edit-btn-cancel {
                background: transparent;
                color: #131722;
                border: 1px solid #E0E3EB;
            }

            .alert-edit-btn-cancel:hover {
                background: #F0F3FA;
            }

            .alert-edit-btn-save {
                background: #2962FF;
                color: white;
            }

            .alert-edit-btn-save:hover {
                background: #1E53E5;
            }

            @keyframes dialogFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        `, i = document.createElement("style");
    i.id = t, i.textContent = e, document.head.appendChild(i);
  }
  show(t, e) {
    this._currentData = { ...t }, this._onSave = e, this._createOverlay(), document.body.appendChild(this._overlay);
  }
  hide() {
    this._overlay && this._overlay.parentNode && this._overlay.parentNode.removeChild(this._overlay), this._overlay = null, this._onSave = null, this._currentData = null;
  }
  _createOverlay() {
    this._overlay = document.createElement("div"), this._overlay.className = "alert-edit-dialog-overlay", this._overlay.addEventListener("click", (u) => {
      u.target === this._overlay && this.hide();
    });
    const t = document.createElement("div");
    t.className = "alert-edit-dialog", this._overlay.appendChild(t);
    const e = document.createElement("div");
    e.className = "alert-edit-dialog-header";
    const i = document.createElement("h2");
    i.className = "alert-edit-dialog-title", i.textContent = `Edit alert on ${this._currentData?.symbol || ""}`, e.appendChild(i);
    const s = document.createElement("button");
    s.className = "alert-edit-dialog-close", s.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path fill="currentColor" d="M9 7.586L14.293 2.293l1.414 1.414L10.414 9l5.293 5.293-1.414 1.414L9 10.414l-5.293 5.293-1.414-1.414L7.586 9 2.293 3.707l1.414-1.414L9 7.586z"/></svg>', s.addEventListener("click", () => this.hide()), e.appendChild(s), t.appendChild(e);
    const o = document.createElement("div");
    o.className = "alert-edit-dialog-content";
    const l = document.createElement("div");
    l.className = "alert-edit-form-group";
    const a = document.createElement("label");
    a.className = "alert-edit-label", a.textContent = "Condition", l.appendChild(a);
    const n = document.createElement("select");
    n.className = "alert-edit-select", [
      { value: "crossing", label: "Crossing" },
      { value: "crossing_up", label: "Crossing Up" },
      { value: "crossing_down", label: "Crossing Down" }
    ].forEach((u) => {
      const f = document.createElement("option");
      f.value = u.value, f.textContent = u.label, u.value === this._currentData?.condition && (f.selected = !0), n.appendChild(f);
    }), l.appendChild(n), o.appendChild(l);
    let c = null;
    if (!this._currentData?.isTrendline) {
      const u = document.createElement("div");
      u.className = "alert-edit-form-group";
      const f = document.createElement("label");
      f.className = "alert-edit-label", f.textContent = "Value", u.appendChild(f), c = document.createElement("input"), c.className = "alert-edit-input", c.type = "number", c.step = "0.01", c.value = this._currentData?.price.toFixed(2) || "", u.appendChild(c), o.appendChild(u);
    }
    t.appendChild(o);
    const p = document.createElement("div");
    p.className = "alert-edit-dialog-footer";
    const _ = document.createElement("button");
    _.className = "alert-edit-btn alert-edit-btn-cancel", _.textContent = "Cancel", _.addEventListener("click", () => this.hide()), p.appendChild(_);
    const d = document.createElement("button");
    d.className = "alert-edit-btn alert-edit-btn-save", d.textContent = "Save", d.addEventListener("click", () => {
      this._onSave && this._currentData && this._onSave({
        ...this._currentData,
        condition: n.value,
        price: c ? parseFloat(c.value) : this._currentData.price
      }), this.hide();
    }), p.appendChild(d), t.appendChild(p);
  }
}
class lt {
  /**
   * Calculate the price on the trendline at a specific logical index
   * @param trendline The trendline tool
   * @param logical The logical index to calculate price for
   * @returns The calculated price, or null if invalid
   */
  static getPriceAtLogical(t, e) {
    const i = t._p1, s = t._p2;
    if (i.logical === null || i.price === null || s.logical === null || s.price === null || i.logical === s.logical)
      return null;
    const o = (s.price - i.price) / (s.logical - i.logical), l = i.price + o * (e - i.logical);
    return !t._options.extendLeft && e < Math.min(i.logical, s.logical) || !t._options.extendRight && e > Math.max(i.logical, s.logical) ? null : l;
  }
  /**
   * Check if a bar crosses the trendline
   * @param trendline The trendline tool
   * @param bar The bar data (must have logical index or timestamp to convert)
   * @param logical The logical index of the bar
   * @param condition The alert condition
   * @returns True if crossing detected
   */
  static checkCrossing(t, e, i, s = "crossing") {
    const o = this.getPriceAtLogical(t, i);
    if (o === null) return !1;
    const l = o >= e.low && o <= e.high;
    return s === "crossing" ? l : s === "crossing_up" ? l && e.close >= o : s === "crossing_down" ? l && e.close <= o : !1;
  }
}
class ci extends ai {
  _chart = void 0;
  _series = void 0;
  _mouseHandlers;
  _paneViews = [];
  _pricePaneViews = [];
  _lastMouseUpdate = null;
  _currentCursor = null;
  _symbolName = "";
  _dragState = null;
  _hasDragged = !1;
  _onAlertTriggered = new M();
  _editDialog;
  _requestUpdate;
  constructor() {
    super(), this._mouseHandlers = new ii(), this._editDialog = new ri();
  }
  attached({ chart: t, series: e, requestUpdate: i }) {
    this._chart = t, this._series = e, this._requestUpdate = i, this._paneViews = [new Tt(!1)], this._pricePaneViews = [new Tt(!0)], this._mouseHandlers.attached(t, e), this._mouseHandlers.mouseMoved().subscribe((s) => {
      this._lastMouseUpdate = s, i();
    }, this), this._series.subscribeDataChanged(this._onDataChanged.bind(this)), this._mouseHandlers.clicked().subscribe((s) => {
      if (this._hasDragged) {
        this._hasDragged = !1;
        return;
      }
      if (s && this._series) {
        if (this._isHovering(s)) {
          const l = this._series.coordinateToPrice(s.y);
          l && (this.openEditDialog("new", { price: l, condition: "crossing" }), i());
        }
        if (this._hoveringID) {
          this.removeAlert(this._hoveringID), i();
          return;
        }
        const o = this._getHoveringAlertId(s, !1);
        o && this.openEditDialog(o);
      }
    }, this), this._mouseHandlers.mouseDown().subscribe((s) => {
      if (this._hasDragged = !1, s && this._series) {
        const o = this._getHoveringAlertId(s, !1);
        o && (this._dragState = { alertId: o, startY: s.y });
      }
    }, this), this._mouseHandlers.mouseUp().subscribe(() => {
      this._dragState = null;
    }, this), this._mouseHandlers.mouseMoved().subscribe((s) => {
      if (this._dragState && s && this._series) {
        Math.abs(s.y - this._dragState.startY) > 5 && (this._hasDragged = !0);
        const o = this._series.coordinateToPrice(s.y);
        o !== null && (this.updateAlertPrice(this._dragState.alertId, o), i());
      }
    }, this);
  }
  detached() {
    this._series && this._series.unsubscribeDataChanged(this._onDataChanged.bind(this)), this._mouseHandlers.mouseMoved().unsubscribeAll(this), this._mouseHandlers.clicked().unsubscribeAll(this), this._mouseHandlers.mouseDown().unsubscribeAll(this), this._mouseHandlers.mouseUp().unsubscribeAll(this), this._mouseHandlers.detached(), this._series = void 0, this._requestUpdate = void 0;
  }
  paneViews() {
    return this._paneViews;
  }
  priceAxisPaneViews() {
    return this._pricePaneViews;
  }
  _onDataChanged() {
    if (this._series) {
      const t = this._series.data?.();
      if (t && t.length > 0) {
        const e = t[t.length - 1];
        this.checkPriceCrossings(e), this.updateAllViews(), this._requestUpdate?.();
      }
    }
  }
  updateAllViews() {
    if (this._chart && this._series) {
      const i = this._series.data?.();
      if (i && i.length > 0) {
        const s = i[i.length - 1], o = this._chart.timeScale(), l = o.timeToCoordinate(s.time);
        if (l !== null) {
          const a = o.coordinateToLogical(l);
          a !== null && this.alerts().forEach((n) => {
            if (n.type === "trendline" && n.trendlineRef) {
              const r = lt.getPriceAtLogical(n.trendlineRef, a);
              r !== null && (n.price = r);
            }
          });
        }
      }
    }
    const t = this.alerts(), e = this._calculateRendererData(
      t,
      this._lastMouseUpdate
    );
    this._currentCursor = null, (e?.button?.hovering || e?.alerts.some((i) => i.showHover && i.hoverRemove)) && (this._currentCursor = "pointer"), this._paneViews.forEach((i) => i.update(e)), this._pricePaneViews.forEach((i) => i.update(e));
  }
  hitTest() {
    return this._currentCursor ? {
      cursorStyle: this._currentCursor,
      externalId: "user-alerts-primitive",
      zOrder: "top"
    } : null;
  }
  setSymbolName(t) {
    this._symbolName = t;
  }
  openEditDialog(t, e) {
    const i = this.alerts().find((o) => o.id === t), s = i ? {
      alertId: i.id,
      price: i.price,
      condition: i.condition || "crossing",
      symbol: this._symbolName,
      isTrendline: i.type === "trendline"
    } : e ? {
      alertId: t,
      price: e.price,
      condition: e.condition,
      symbol: this._symbolName,
      isTrendline: !1
    } : null;
    s && this._editDialog.show(s, (o) => {
      i ? this.updateAlert(o.alertId, o.price, o.condition) : this.addAlertWithCondition(o.price, o.condition);
    });
  }
  openTrendlineAlertDialog(t) {
    const e = {
      alertId: "new_trendline",
      price: t._p2.price,
      // Placeholder
      condition: "crossing",
      symbol: this._symbolName,
      isTrendline: !0
    };
    this._editDialog.show(e, (i) => {
      const s = this.addTrendlineAlert(t, i.condition);
      t.setAlertId(s);
    });
  }
  alertTriggered() {
    return this._onAlertTriggered;
  }
  /**
   * Check current candle against all alerts for crossings
   */
  checkPriceCrossings(t) {
    if (!t) return;
    const e = t.high !== void 0 ? t.high : t.value !== void 0 ? t.value : t.close, i = t.low !== void 0 ? t.low : t.value !== void 0 ? t.value : t.close, s = t.close !== void 0 ? t.close : t.value !== void 0 ? t.value : e, o = this.alerts(), l = [];
    for (const a of o) {
      let n = !1;
      const r = a.condition || "crossing";
      if (a.type === "trendline" && a.trendlineRef) {
        const c = this._chart?.timeScale();
        if (c && t.time) {
          const p = c.coordinateToLogical(c.timeToCoordinate(t.time) || 0);
          p !== null && (n = lt.checkCrossing(a.trendlineRef, t, p, r));
        }
      } else {
        const c = a.price >= i && a.price <= e;
        r === "crossing" ? n = c : r === "crossing_up" ? n = c && s >= a.price : r === "crossing_down" && (n = c && s <= a.price);
      }
      if (n) {
        const c = {
          alertId: a.id,
          alertPrice: a.price,
          crossingPrice: s,
          direction: s > a.price ? "up" : "down",
          condition: a.condition || "crossing",
          timestamp: Date.now()
        };
        this._onAlertTriggered.fire(c), l.push(a.id);
      }
    }
    l.forEach((a) => this.removeAlert(a));
  }
  _isHovering(t) {
    return !!(t && t.xPositionRelativeToPriceScale >= 1 && t.xPositionRelativeToPriceScale < U);
  }
  _isHoveringRemoveButton(t, e, i, s) {
    if (!t || !e || Math.abs(t.y - i) > Mt / 2) return !1;
    const l = at * 2 + A + s * St, a = (e + l - A) * 0.5;
    return Math.abs(t.x - a) <= A / 2;
  }
  _hoveringID = "";
  /**
   * We are calculating this here instead of within a view
   * because the data is identical for both Renderers so lets
   * rather calculate it once here.
   */
  _calculateRendererData(t, e) {
    if (!this._series) return null;
    const i = this._series.priceFormatter(), s = e && !e.overTimeScale, o = s, l = e && this._series.coordinateToPrice(e.y), a = i.format(l ?? -100);
    let n = 1 / 0, r = -1;
    const c = t.map((p, _) => {
      const d = this._series.priceToCoordinate(p.price) ?? -100;
      if (e?.y && d >= 0) {
        const u = Math.abs(e.y - d);
        u < n && (r = _, n = u);
      }
      return {
        y: d,
        showHover: !1,
        price: p.price,
        id: p.id
      };
    });
    if (this._hoveringID = "", r >= 0 && n < vt) {
      const p = this._chart?.timeScale().width() ?? 0, _ = c[r], d = `${this._symbolName} crossing ${this._series.priceFormatter().format(_.price)}`, u = this._isHoveringRemoveButton(
        e,
        p,
        _.y,
        d.length
      );
      c[r] = {
        ...c[r],
        showHover: !0,
        text: d,
        hoverRemove: u
      }, u && (this._hoveringID = _.id);
    }
    return {
      alertIcon: Qe,
      alerts: c,
      button: o ? {
        hovering: this._isHovering(e),
        hoverColor: "#50535E",
        crosshairLabelIcon: Ke
      } : null,
      color: "#131722",
      crosshair: s ? {
        y: e.y,
        text: a
      } : null
    };
  }
  /**
   * Get the ID of the alert being hovered, optionally checking for remove button
   */
  _getHoveringAlertId(t, e) {
    if (!t || !this._series || !this._chart) return null;
    const i = this.alerts();
    let s = 1 / 0, o = -1;
    for (let l = 0; l < i.length; l++) {
      const a = this._series.priceToCoordinate(i[l].price) ?? -100;
      if (a >= 0) {
        const n = Math.abs(t.y - a);
        n < s && (o = l, s = n);
      }
    }
    if (o >= 0 && s < vt) {
      if (e) {
        const l = this._chart.timeScale().width(), a = i[o], n = this._series.priceToCoordinate(a.price) ?? -100, r = `${this._symbolName} crossing ${this._series.priceFormatter().format(a.price)}`;
        if (!this._isHoveringRemoveButton(t, l, n, r.length)) return null;
      }
      return i[o].id;
    }
    return null;
  }
  addTrendlineAlert(t, e) {
    const i = this._getNewId();
    let s = t._p2.price;
    if (this._series && this._chart) {
      const l = this._series.data?.();
      if (l && l.length > 0) {
        const a = l[l.length - 1], n = this._chart.timeScale(), r = n.timeToCoordinate(a.time);
        if (r !== null) {
          const c = n.coordinateToLogical(r);
          if (c !== null) {
            const p = lt.getPriceAtLogical(t, c);
            p !== null && (s = p);
          }
        }
      }
    }
    const o = {
      price: s,
      id: i,
      condition: e,
      type: "trendline",
      trendlineRef: t
    };
    return this._alerts.set(i, o), this._alertAdded.fire(o), this._alertsChanged.fire(), i;
  }
}
class hi {
  _container;
  _notifications = /* @__PURE__ */ new Map();
  _manager;
  constructor(t) {
    this._manager = t, this._injectStyles(), this._container = this._createContainer(), document.body.appendChild(this._container);
  }
  _injectStyles() {
    const t = "alert-notification-styles";
    if (document.getElementById(t)) return;
    const e = document.createElement("style");
    e.id = t, e.textContent = `
            .alert-notifications-container {
                position: fixed;
                /* Position set by JS */
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif;
            }

            .alert-notification {
                background: #F5F8FA;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 16px;
                min-width: 320px;
                max-width: 400px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                animation: slideIn 0.3s ease-out;
                pointer-events: auto;
            }

            .alert-notification.dismissing {
                animation: slideOut 0.3s ease-out;
            }

            .alert-notification-icon {
                font-size: 24px;
                line-height: 1;
                flex-shrink: 0;
            }

            .alert-notification-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .alert-notification-header {
                font-size: 14px;
                font-weight: 600;
                color: #131722;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .alert-notification-message {
                font-size: 13px;
                color: #131722;
                font-weight: 500;
            }

            .alert-notification-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 6px;
            }

            .alert-notification-edit {
                font-size: 12px;
                color: #2962FF;
                text-decoration: none;
                cursor: pointer;
            }

            .alert-notification-edit:hover {
                text-decoration: underline;
            }

            .alert-notification-timestamp {
                font-size: 11px;
                color: #787B86;
            }

            .alert-notification-close {
                background: none;
                border: none;
                font-size: 24px;
                line-height: 1;
                color: #787B86;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                border-radius: 4px;
                transition: all 0.2s ease;
                z-index: 1;
            }

            .alert-notification-close:hover {
                background: rgba(0, 0, 0, 0.05);
                color: #131722;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }

            @keyframes slideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `, document.head.appendChild(e);
  }
  show(t) {
    this._updatePosition(), this._notifications.has(t.alertId) && this.dismiss(t.alertId);
    const e = this._createNotification(t);
    this._container.appendChild(e), this._notifications.set(t.alertId, e), setTimeout(() => {
      this.dismiss(t.alertId);
    }, 6e4), this._playAlarm();
  }
  _playAlarm() {
    try {
      const t = window.AudioContext || window.webkitAudioContext;
      if (!t) return;
      const e = new t(), i = e.createOscillator(), s = e.createGain();
      i.connect(s), s.connect(e.destination), i.type = "square", i.frequency.value = 2048;
      const o = e.currentTime;
      for (let l = 0; l < 10; l++) {
        const a = o + l * 0.3;
        s.gain.setValueAtTime(1, a), s.gain.setValueAtTime(0, a + 0.15);
      }
      i.start(o), i.stop(o + 1), i.onended = () => e.close();
    } catch (t) {
      console.error("Alarm sound failed:", t);
    }
  }
  _updatePosition() {
    const t = this._manager.getChartRect();
    if (t) {
      const e = t.left + 15, i = window.innerHeight - t.bottom + 30;
      this._container.style.left = `${e}px`, this._container.style.bottom = `${i}px`, this._container.style.top = "auto", this._container.style.right = "auto";
    } else
      this._container.style.left = "20px", this._container.style.bottom = "20px", this._container.style.top = "auto", this._container.style.right = "auto";
  }
  dismiss(t) {
    const e = this._notifications.get(t);
    e && (e.classList.add("dismissing"), setTimeout(() => {
      e.parentNode && e.parentNode.removeChild(e), this._notifications.delete(t);
    }, 300));
  }
  destroy() {
    this._notifications.forEach((t, e) => {
      this.dismiss(e);
    }), this._container.parentNode && this._container.parentNode.removeChild(this._container);
  }
  _createContainer() {
    const t = document.createElement("div");
    return t.className = "alert-notifications-container", t;
  }
  _createNotification(t) {
    const e = document.createElement("div");
    e.className = "alert-notification";
    const i = document.createElement("div");
    i.className = "alert-notification-icon", i.textContent = "🪙", e.appendChild(i);
    const s = document.createElement("div");
    s.className = "alert-notification-content";
    const o = document.createElement("div");
    o.className = "alert-notification-header", o.textContent = `Alert on ${t.symbol}`, s.appendChild(o);
    const l = document.createElement("div");
    l.className = "alert-notification-message", l.textContent = `${t.symbol} Crossing ${t.price}`, s.appendChild(l);
    const a = document.createElement("div");
    a.className = "alert-notification-footer";
    const n = document.createElement("a");
    n.className = "alert-notification-edit", n.href = "#", n.textContent = "Edit alert", n.addEventListener("click", (p) => {
      p.preventDefault(), t.onEdit && t.onEdit(t);
    }), a.appendChild(n);
    const r = document.createElement("span");
    r.className = "alert-notification-timestamp", r.textContent = this._formatTime(t.timestamp), a.appendChild(r), s.appendChild(a), e.appendChild(s);
    const c = document.createElement("button");
    return c.className = "alert-notification-close", c.innerHTML = "×", c.addEventListener("click", (p) => {
      p.stopPropagation(), this.dismiss(t.alertId);
    }), e.appendChild(c), e;
  }
  _formatTime(t) {
    const e = new Date(t), i = e.getHours().toString().padStart(2, "0"), s = e.getMinutes().toString().padStart(2, "0"), o = e.getSeconds().toString().padStart(2, "0");
    return `${i}:${s}:${o}`;
  }
}
class pi {
  _chart;
  _toolbar = null;
  constructor(t) {
    this._chart = t;
  }
  createControls() {
    const t = this._chart.chartElement?.();
    if (!t) return;
    getComputedStyle(t).position === "static" && (t.style.position = "relative"), this._toolbar = document.createElement("div"), this._toolbar.id = "chart-navigation-plugin", this._applyStyles(this._toolbar), this._toolbar.innerHTML = `
            <button id="nav-zoom-out-plugin" title="Zoom Out">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="nav-zoom-in-plugin" title="Zoom In">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V18M6 12H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="nav-scroll-left-plugin" title="Scroll Left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 16L10 12L14 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="nav-scroll-right-plugin" title="Scroll Right">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 16L14 12L10 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="nav-reset-plugin" title="Reset View">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.53616 4 7.33235 5.11333 5.86533 6.86533M5.86533 6.86533V4M5.86533 6.86533H8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `, t.appendChild(this._toolbar);
    let e = !1, i = null;
    const s = () => {
      e = !0, i !== null && (window.clearTimeout(i), i = null), this._toolbar && (this._toolbar.style.opacity = "1");
    }, o = () => {
      e = !1, i = window.setTimeout(() => {
        !e && this._toolbar && (this._toolbar.style.opacity = "0");
      }, 100);
    }, l = (a) => {
      const n = t.getBoundingClientRect(), r = a.clientY - n.top, c = n.height, p = a.clientX - n.left, _ = n.width, d = r > c - 150, u = p < _ - 70;
      d && u ? s() : o();
    };
    t.addEventListener("mousemove", l), t.addEventListener("mouseleave", o), this._toolbar.addEventListener("mouseenter", s), this._toolbar.addEventListener("mouseleave", o), this._attachListeners();
  }
  removeControls() {
    this._toolbar && this._toolbar.parentNode && this._toolbar.parentNode.removeChild(this._toolbar), this._toolbar = null;
  }
  _applyStyles(t) {
    Object.assign(t.style, {
      position: "absolute",
      bottom: "50px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "8px",
      zIndex: "10",
      opacity: "0",
      transition: "opacity 0.3s ease"
    });
    const e = "chart-navigation-styles";
    if (!document.getElementById(e)) {
      const i = document.createElement("style");
      i.id = e, i.textContent = `
                #chart-navigation-plugin {
                    pointer-events: none;
                }
                #chart-navigation-plugin button {
                    background: #ffffff;
                    border: none;
                    color: #131722;
                    padding: 0;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s;
                    position: relative;
                    z-index: 1;
                    pointer-events: auto;
                }
                #chart-navigation-plugin button:hover {
                    background: #f0f3fa;
                    color: #131722;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                #chart-navigation-plugin button svg {
                    width: 18px;
                    height: 18px;
                }
            `, document.head.appendChild(i);
    }
  }
  _attachListeners() {
    if (!this._toolbar) return;
    const t = this._chart.timeScale();
    this._toolbar.querySelector("#nav-zoom-in-plugin")?.addEventListener("click", () => {
      const a = t.getVisibleLogicalRange();
      if (a) {
        const n = a.to - a.from, r = (a.from + a.to) / 2, c = n * 0.8;
        t.setVisibleLogicalRange({
          from: r - c / 2,
          to: r + c / 2
        });
      }
    }), this._toolbar.querySelector("#nav-zoom-out-plugin")?.addEventListener("click", () => {
      const a = t.getVisibleLogicalRange();
      if (a) {
        const n = a.to - a.from, r = (a.from + a.to) / 2, c = n * 1.25;
        t.setVisibleLogicalRange({
          from: r - c / 2,
          to: r + c / 2
        });
      }
    });
    const e = this._toolbar.querySelector("#nav-scroll-left-plugin"), i = this._toolbar.querySelector("#nav-scroll-right-plugin");
    let s = null;
    const o = () => {
      s !== null && (window.clearInterval(s), s = null);
    }, l = (a) => {
      o();
      const n = () => {
        const r = t.scrollPosition();
        t.scrollToPosition(r + a, !1);
      };
      n(), s = window.setTimeout(() => {
        s = window.setInterval(n, 100);
      }, 400);
    };
    e && (e.addEventListener("mousedown", (a) => {
      a.preventDefault(), l(1);
    }), e.addEventListener("mouseup", o), e.addEventListener("mouseleave", o)), i && (i.addEventListener("mousedown", (a) => {
      a.preventDefault(), l(-1);
    }), i.addEventListener("mouseup", o), i.addEventListener("mouseleave", o)), this._toolbar.querySelector("#nav-reset-plugin")?.addEventListener("click", () => {
      t.fitContent(), t.applyOptions({ rightOffset: 10 });
    });
  }
}
class _i extends wt {
  _activeToolType = "None";
  _activeTool = null;
  _points = [];
  _tools = [];
  // Store all created tools
  _toolOptions = /* @__PURE__ */ new Map();
  // Store default options for each tool type
  _isDrawing = !1;
  // Track if currently drawing
  _lastPixelPoint = null;
  _isRightClick = !1;
  // Track right-click to prevent adding points
  _lastMouseEvent = null;
  // Editing state
  _selectedTool = null;
  // Currently selected tool
  _dragState = null;
  // Active drag operation
  _isDragging = !1;
  // Is user dragging?
  // Path tool double-click detection
  _lastClickTime = 0;
  _lastClickPoint = null;
  _userPriceAlerts = null;
  _alertNotifications = null;
  _toolbar = null;
  _chartControls = null;
  _setNoneButtonActive() {
    document.querySelectorAll("button").forEach((e) => e.classList.remove("active"));
    const t = document.getElementById("btn-none");
    t && t.classList.add("active");
  }
  _cancelActiveDrawing() {
    if (this._activeTool) {
      this.series.detachPrimitive(this._activeTool);
      const t = this._tools.indexOf(this._activeTool);
      t !== -1 && this._tools.splice(t, 1), this._activeTool = null;
    }
    this._points = [], this._isDrawing = !1, this._lastPixelPoint = null, this._activeToolType !== "None" && (this._activeToolType = "None", this._setChartInteraction(!0)), this._deselectCurrentTool(), this._toolbar?.hide(), this._setNoneButtonActive();
  }
  _setChartInteraction(t) {
    this.chart.applyOptions({
      handleScroll: t,
      handleScale: t
    });
  }
  constructor() {
    super();
    const t = "#2962FF", e = { lineColor: t, color: t, lineWidth: 2 };
    [
      "TrendLine",
      "HorizontalLine",
      "VerticalLine",
      "Rectangle",
      "Text",
      "ParallelChannel",
      "FibRetracement",
      "Triangle",
      "Brush",
      "Callout",
      "CrossLine",
      "Circle",
      "Highlighter",
      "Path",
      "Arrow",
      "Ray",
      "ExtendedLine",
      "HorizontalRay",
      "PriceRange",
      "LongPosition",
      "ShortPosition",
      "ElliottImpulseWave",
      "ElliottCorrectionWave",
      "DateRange",
      "FibExtension",
      "UserPriceAlerts"
    ].forEach((s) => {
      this._toolOptions.set(s, { ...e });
    });
  }
  attached(t) {
    super.attached(t), this.chart.subscribeClick(this._clickHandler), this.chart.subscribeCrosshairMove(this._moveHandler);
    const e = this.chart.chartElement?.();
    e && (e.addEventListener("mousedown", this._mouseDownHandler), e.addEventListener("mouseup", this._mouseUpHandler), e.addEventListener("contextmenu", (i) => i.preventDefault())), window.addEventListener("mousemove", this._rawMouseMoveHandler), this._userPriceAlerts = new ci(), this.series.attachPrimitive(this._userPriceAlerts), this._alertNotifications = new hi(this), this._userPriceAlerts.alertTriggered().subscribe((i) => {
      this._alertNotifications?.show({
        alertId: i.alertId,
        symbol: "BTCUSD",
        // TODO: Get actual symbol
        price: this.series.priceFormatter().format(i.alertPrice),
        timestamp: i.timestamp,
        direction: i.direction,
        condition: i.condition,
        onEdit: (s) => {
          this._userPriceAlerts?.openEditDialog(s.alertId, {
            price: parseFloat(s.price),
            condition: s.condition
          });
        }
      });
    }, this), this._toolbar = new C(this), this._chartControls = new pi(this.chart), this._chartControls.createControls();
  }
  detached() {
    this.chart.unsubscribeClick(this._clickHandler), this.chart.unsubscribeCrosshairMove(this._moveHandler), window.removeEventListener("mousemove", this._rawMouseMoveHandler), window.removeEventListener("keydown", this._keyDownHandler);
    const t = this.chart.chartElement?.();
    t && (t.removeEventListener("mousedown", this._mouseDownHandler), t.removeEventListener("mouseup", this._mouseUpHandler)), this._userPriceAlerts && this.series.detachPrimitive(this._userPriceAlerts), this._chartControls && (this._chartControls.removeControls(), this._chartControls = null), super.detached();
  }
  startTool(t) {
    this._deselectCurrentTool(), this._activeToolType = t, this._points = [], this._activeTool = null, this._lastPixelPoint = null, t !== "None" ? this._toolbar?.showCollapsed(t) : this._toolbar?.hide(), t === "Brush" || t === "Highlighter" || t === "Triangle" || t === "TrendLine" || t === "HorizontalLine" || t === "VerticalLine" || t === "Rectangle" || t === "Circle" || t === "CrossLine" || t === "Path" || t === "Arrow" || t === "Ray" || t === "ExtendedLine" || t === "HorizontalRay" || t === "PriceRange" || t === "LongPosition" || t === "ShortPosition" || t === "ElliottImpulseWave" || t === "ElliottCorrectionWave" || t === "DateRange" || t === "FibExtension" || t === "UserPriceAlerts" ? this._setChartInteraction(!1) : this._setChartInteraction(!0);
  }
  clearTools() {
    this._tools.forEach((t) => {
      this.series.detachPrimitive(t);
    }), this._tools = [], this._toolbar?.hide();
  }
  updateToolOptions(t, e) {
    const i = this._toolOptions.get(t) || {};
    this._toolOptions.set(t, { ...i, ...e });
  }
  getToolOptions(t) {
    return this._toolOptions.get(t) || {};
  }
  /**
   * Toggle lock state for a tool to prevent or allow dragging
   */
  toggleToolLock(t) {
    t._locked = !t._locked, this.requestUpdate();
  }
  createAlertForTool(t) {
    t instanceof D ? this._userPriceAlerts?.openTrendlineAlertDialog(t) : console.warn("Alerts not supported for this tool type yet");
  }
  enableSessionHighlighting(t) {
    const e = this._tools.findIndex((i) => i instanceof mt);
    if (e !== -1) {
      const i = this._tools[e];
      this.series.detachPrimitive(i), this._tools.splice(e, 1);
    } else {
      const i = new mt(t);
      this.series.attachPrimitive(i), this._tools.push(i);
    }
  }
  getChartRect() {
    return this.chart.chartElement?.()?.getBoundingClientRect() || null;
  }
  /**
   * Select a tool and show its anchor points
   */
  _selectTool(t) {
    this._selectedTool && this._selectedTool !== t && this._selectedTool.setSelected(!1), this._selectedTool = t, t.setSelected(!0), this.requestUpdate(), this._lastMouseEvent ? this._toolbar?.showExpanded(t) : this._toolbar?.showExpanded(t);
  }
  /**
   * Deselect the currently selected tool
   */
  _deselectCurrentTool() {
    this._selectedTool && (this._selectedTool.setSelected(!1), this._selectedTool = null, this.requestUpdate(), this._toolbar?.hide());
  }
  /**
   * Delete a tool from the chart
   */
  deleteTool(t) {
    const e = this._tools.indexOf(t);
    e !== -1 && (t instanceof D && t._alertId && this._userPriceAlerts?.removeAlert(t._alertId), this.series.detachPrimitive(t), this._tools.splice(e, 1), this._selectedTool = null, this.requestUpdate(), this._toolbar?.hide());
  }
  /**
   * Handle tool selection when clicking in edit mode
   */
  _handleToolSelection(t) {
    if (!t.point) return;
    const e = t.point.x, i = t.point.y;
    for (let s = this._tools.length - 1; s >= 0; s--) {
      const o = this._tools[s];
      if (!o.toolHitTest) continue;
      if (o.toolHitTest(e, i)?.hit) {
        this._selectTool(o);
        return;
      }
    }
    this._deselectCurrentTool();
  }
  /**
   * Start a drag operation (anchor or shape)
   */
  _startDrag(t, e) {
    if (this._selectedTool && this._selectedTool._locked)
      return;
    const i = this.chart.timeScale(), s = this.series, o = i.coordinateToLogical(e.x), l = s.coordinateToPrice(e.y);
    o === null || l === null || (t.type === "point" ? this._dragState = {
      tool: this._selectedTool,
      type: "anchor",
      anchorIndex: t.index,
      startPoint: { logical: o, price: l }
    } : this._dragState = {
      tool: this._selectedTool,
      type: "shape",
      startPoint: { logical: o, price: l }
    }, this._isDragging = !0, this.chart.applyOptions({ handleScroll: !1, handleScale: !1 }));
  }
  /**
   * Handle active drag operation
   */
  _handleDrag(t) {
    const i = this.chart.chartElement?.()?.getBoundingClientRect();
    if (!i || !this._dragState) return;
    const s = t.clientX - i.left, o = t.clientY - i.top, l = this.chart.timeScale(), a = this.series, n = l.coordinateToLogical(s), r = a.coordinateToPrice(o);
    if (!(n === null || r === null)) {
      if (this._dragState.type === "anchor")
        this._dragState.tool.updatePointByIndex(
          this._dragState.anchorIndex,
          { logical: n, price: r }
        );
      else {
        const c = n - this._dragState.startPoint.logical, p = r - this._dragState.startPoint.price;
        this._moveToolByDelta(this._dragState.tool, c, p), this._dragState.startPoint = { logical: n, price: r };
      }
      this.chart.timeScale().applyOptions({});
    }
  }
  /**
   * Move a tool by delta values
   */
  _moveToolByDelta(t, e, i) {
    t._p1 && t._p2 && !t._p3 ? (t._p1 = {
      logical: t._p1.logical + e,
      price: t._p1.price + i
    }, t._p2 = {
      logical: t._p2.logical + e,
      price: t._p2.price + i
    }, t.updateAllViews()) : t._p1 && t._p2 && t._p3 ? (t._p1.logical += e, t._p1.price += i, t._p2.logical += e, t._p2.price += i, t._p3.logical += e, t._p3.price += i, t.updateAllViews()) : t._points ? (t._points.forEach((s) => {
      s.logical += e, s.price += i;
    }), t.updateAllViews()) : t._p1 && t._p2 && t._p3 && (t instanceof N || t instanceof $) ? (t._p1.logical += e, t._p1.price += i, t._p2.logical += e, t._p2.price += i, t._p3.logical += e, t._p3.price += i, t.updateAllViews()) : t._point ? (t._point = {
      logical: t._point.logical + e,
      price: t._point.price + i
    }, t.updateAllViews()) : t._price !== void 0 ? (t._price += i, t.updateAllViews()) : t._logical !== void 0 && (t._logical += e, t.updateAllViews());
  }
  /**
   * Handle keyboard events for editing
   */
  _keyDownHandler = (t) => {
    t.key === "Escape" ? this._activeTool ? this._cancelActiveDrawing() : this._deselectCurrentTool() : (t.key === "Delete" || t.key === "Backspace") && this._selectedTool && (t.preventDefault(), this.deleteTool(this._selectedTool));
  };
  _mouseDownHandler = (t) => {
    if (this._lastMouseEvent = t, this._isRightClick = t.button === 2, !this._isRightClick) {
      if (this._selectedTool && this._activeToolType === "None" && t.button === 0) {
        const i = this.chart.chartElement?.()?.getBoundingClientRect();
        if (i) {
          const s = t.clientX - i.left, o = t.clientY - i.top, l = this._selectedTool.toolHitTest(s, o);
          if (l?.hit) {
            t.preventDefault(), this._startDrag(l, { x: s, y: o });
            return;
          }
        }
      }
      t.button === 0 && (this._activeToolType === "Brush" || this._activeToolType === "Highlighter") && (t.preventDefault(), t.stopPropagation(), this._isDrawing = !0, this._points = [], this._lastPixelPoint = null, this._activeTool = null);
    }
  };
  _mouseUpHandler = (t) => {
    if (this._isDragging) {
      this._isDragging = !1, this._dragState = null, this._setChartInteraction(!0);
      return;
    }
    if (t.button === 0 && this._isDrawing && (t.preventDefault(), t.stopPropagation(), this._isDrawing = !1, this._activeTool && this._selectTool(this._activeTool), this._activeTool = null, this._points = []), t.button === 2) {
      if (t.preventDefault(), this._activeToolType === "Path" && this._points.length >= 2) {
        this._activeTool instanceof L && this._activeTool.updatePoints([...this._points]);
        const e = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(e), this._isRightClick = !1;
        return;
      }
      this._cancelActiveDrawing(), this._isRightClick = !1;
      return;
    }
    this._isRightClick = !1;
  };
  _rawMouseMoveHandler = (t) => {
    if (this._activeToolType !== "None" && !this._activeTool && this._selectedTool, this._isDragging && this._dragState) {
      t.preventDefault(), this._handleDrag(t);
      return;
    }
    if (!this._isDrawing || this._activeToolType !== "Brush" && this._activeToolType !== "Highlighter")
      return;
    const e = document.getElementById("container");
    if (!e) return;
    const i = e.getBoundingClientRect(), s = t.clientX - i.left, o = t.clientY - i.top, a = this.chart.timeScale().coordinateToLogical(s), n = this.series.coordinateToPrice(o);
    if (a === null || n === null) return;
    const r = { logical: a, price: n }, _ = 10 * (this.chart._impl?.model?.().rendererOptionsProvider?.().options()?.horizontalPixelRatio || window.devicePixelRatio || 1);
    if (this._lastPixelPoint) {
      const d = s - this._lastPixelPoint.x, u = o - this._lastPixelPoint.y;
      if (Math.sqrt(d * d + u * u) < _)
        return;
    }
    if (this._points.length === 0) {
      this._points.push(r), this._lastPixelPoint = { x: s, y: o };
      const d = this._activeToolType === "Brush" ? K.brush : K.highlighter, u = this.getToolOptions(this._activeToolType), f = { ...d, ...u };
      f.lineColor && (f.color = f.lineColor), this._activeTool = new L(this.chart, this.series, [r], f), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
    } else
      this._activeTool instanceof L && (this._activeTool.addPoint(r), this._lastPixelPoint = { x: s, y: o }, this.chart.timeScale().applyOptions({}));
  };
  _clickHandler = (t) => {
    if (this._isRightClick)
      return;
    if (this._activeToolType === "None") {
      this._handleToolSelection(t);
      return;
    }
    if (!t.point || this._activeToolType === "Brush" || this._activeToolType === "Highlighter")
      return;
    const e = this.series.coordinateToPrice(t.point.y);
    if (e === null) return;
    const s = this.chart.timeScale().coordinateToLogical(t.point.x);
    if (s === null) return;
    let o = { logical: s, price: e };
    (this._activeToolType === "Triangle" || this._activeToolType === "TrendLine" || this._activeToolType === "VerticalLine" || this._activeToolType === "Rectangle" || this._activeToolType === "Circle" || this._activeToolType === "ParallelChannel" || this._activeToolType === "FibRetracement" || this._activeToolType === "Arrow" || this._activeToolType === "Ray" || this._activeToolType === "ExtendedLine" || this._activeToolType === "HorizontalRay" || this._activeToolType === "PriceRange" || this._activeToolType === "LongPosition" || this._activeToolType === "ShortPosition" || this._activeToolType === "ElliottImpulseWave" || this._activeToolType === "ElliottCorrectionWave" || this._activeToolType === "DateRange" || this._activeToolType === "FibExtension" || this._activeToolType === "UserPriceAlerts") && (o = { logical: s, price: e }), this._points.push(o);
    const l = o, a = o;
    if (this._activeToolType === "TrendLine" || this._activeToolType === "Arrow" || this._activeToolType === "Ray" || this._activeToolType === "ExtendedLine") {
      if (this._points.length === 1) {
        const n = this._points[0], r = {
          rightEnd: this._activeToolType === "Arrow" ? 1 : 0,
          extendRight: this._activeToolType === "Ray" || this._activeToolType === "ExtendedLine",
          extendLeft: this._activeToolType === "ExtendedLine",
          ...this.getToolOptions(this._activeToolType)
        };
        this._activeTool = new D(this.chart, this.series, n, n, r), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof D) {
        const n = this._points[0];
        let r = this._points[1];
        this._activeTool.updatePoints(n, r);
        const c = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(c);
      }
    } else if (this._activeToolType === "HorizontalRay") {
      if (this._activeTool instanceof q) {
        const n = this._activeTool._point;
        this._activeTool.updatePoint(n), this._addTool(this._activeTool, this._activeToolType);
        const r = this._activeTool;
        this._activeTool = null, this.chart.timeScale().applyOptions({}), this._selectTool(r);
      } else {
        const n = l, r = new q(this.chart, this.series, n, this.getToolOptions(this._activeToolType));
        this.series.attachPrimitive(r), this._addTool(r, this._activeToolType), this.chart.timeScale().applyOptions({}), this._selectTool(r);
      }
      this._points = [];
    } else if (this._activeToolType === "HorizontalLine") {
      if (this._activeTool instanceof Y) {
        this._activeTool.updatePrice(e), this._addTool(this._activeTool, this._activeToolType);
        const n = this._activeTool;
        this._activeTool = null, this.chart.timeScale().applyOptions({}), this._selectTool(n);
      } else {
        const n = new Y(this.chart, this.series, e, this.getToolOptions(this._activeToolType));
        this.series.attachPrimitive(n), this._addTool(n, this._activeToolType), this.chart.timeScale().applyOptions({}), this._selectTool(n);
      }
      this._points = [];
    } else if (this._activeToolType === "VerticalLine") {
      if (this._activeTool instanceof Z && a) {
        this._activeTool.updatePosition(a.logical), this._addTool(this._activeTool, this._activeToolType);
        const n = this._activeTool;
        this._activeTool = null, this.chart.timeScale().applyOptions({}), this._selectTool(n);
      } else if (a) {
        const n = new Z(this.chart, this.series, a.logical, this.getToolOptions(this._activeToolType));
        this.series.attachPrimitive(n), this._addTool(n, this._activeToolType), this.chart.timeScale().applyOptions({}), this._selectTool(n);
      }
      this._points = [];
    } else if (this._activeToolType === "Text") {
      if (!this._lastMouseEvent) return;
      const n = this._lastMouseEvent.clientX, r = this._lastMouseEvent.clientY, c = document.createElement("input");
      c.type = "text", c.style.position = "fixed", c.style.left = `${n}px`, c.style.top = `${r}px`, c.style.zIndex = "1000", c.style.border = "2px solid #2962ff", c.style.backgroundColor = "white", c.style.padding = "4px 8px", c.style.fontFamily = "Arial", c.style.fontSize = "14px", c.style.outline = "none", c.style.color = "#000", document.body.appendChild(c), c.focus();
      let p = !1;
      const _ = () => {
        if (p) return;
        p = !0;
        const d = c.value;
        if (d) {
          const u = new oe(this.chart, this.series, l, d, this.getToolOptions(this._activeToolType));
          this.series.attachPrimitive(u), this._addTool(u, "Text"), this._selectTool(u);
        }
        c.parentNode && c.parentNode.removeChild(c), this._points = [];
      };
      c.addEventListener("blur", _), c.addEventListener("keydown", (d) => {
        if (d.key === "Enter")
          _();
        else if (d.key === "Escape") {
          if (p) return;
          p = !0, c.parentNode && c.parentNode.removeChild(c), this._cancelActiveDrawing();
        }
      }), this._points = [];
    } else if (this._activeToolType === "ParallelChannel") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new B(this.chart, this.series, n, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2) {
        if (this._activeTool instanceof B) {
          const n = this._points[1];
          this._activeTool.updatePoints(this._activeTool._p1, n, this._activeTool._p3);
        }
      } else if (this._points.length === 3 && this._activeTool instanceof B) {
        const n = this._points[2];
        this._activeTool.updatePoints(this._activeTool._p1, this._activeTool._p2, n);
        const r = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(r);
      }
    } else if (this._activeToolType === "FibRetracement") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new G(this.chart, this.series, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof G) {
        const n = this._points[0], r = this._points[1];
        this._activeTool.updatePoints(n, r);
        const c = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(c);
      }
    } else if (this._activeToolType === "Triangle") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new I(this.chart, this.series, n, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2) {
        if (this._activeTool instanceof I) {
          const n = this._points[0], r = this._points[1];
          this._activeTool.updatePoints(n, r, r);
        }
      } else if (this._points.length === 3 && this._activeTool instanceof I) {
        const n = this._points[0], r = this._points[1], c = this._points[2];
        this._activeTool.updatePoints(n, r, c);
        const p = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(p);
      }
    } else if (this._activeToolType === "Callout") {
      if (this._points.length === 1)
        this._activeTool = new W(this.chart, this.series, l, l, "Callout Text", this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      else if (this._points.length === 2 && this._activeTool instanceof W) {
        if (this._activeTool.updatePoints(this._points[0], this._points[1]), !this._lastMouseEvent) return;
        const n = this._lastMouseEvent.clientX, r = this._lastMouseEvent.clientY, c = document.createElement("input");
        c.type = "text", c.style.position = "fixed", c.style.left = `${n}px`, c.style.top = `${r}px`, c.style.zIndex = "1000", c.style.border = "2px solid #2962ff", c.style.backgroundColor = "white", c.style.padding = "4px 8px", c.style.fontFamily = "Arial", c.style.fontSize = "12px", c.style.outline = "none", c.style.color = "#000", c.value = "Callout Text", document.body.appendChild(c), c.focus(), c.select();
        let p = !1;
        const _ = () => {
          if (p) return;
          p = !0;
          const d = c.value;
          d && this._activeTool instanceof W && (this._activeTool.updateText(d), this.chart.timeScale().applyOptions({})), c.parentNode && c.parentNode.removeChild(c), this._activeTool = null, this._points = [];
        };
        c.addEventListener("blur", _), c.addEventListener("keydown", (d) => {
          if (d.key === "Enter")
            _();
          else if (d.key === "Escape") {
            if (p) return;
            p = !0, c.parentNode && c.parentNode.removeChild(c), this._cancelActiveDrawing();
          }
        });
      }
    } else if (this._activeToolType === "LongPosition") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new N(this.chart, this.series, n, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof N) {
        const n = this._points[0], r = this._points[1], c = r.price - n.price, p = n.price - c, _ = {
          logical: r.logical,
          price: p
        };
        this._activeTool.updatePoints(n, _, r);
        const d = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(d);
      }
    } else if (this._activeToolType === "ShortPosition") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new $(this.chart, this.series, n, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof $) {
        const n = this._points[0], r = this._points[1], c = n.price - r.price, p = n.price + c, _ = {
          logical: r.logical,
          price: p
        };
        this._activeTool.updatePoints(n, _, r);
        const d = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(d);
      }
    } else if (this._activeToolType === "CrossLine") {
      const n = new ft(this.chart, this.series, l, this.getToolOptions(this._activeToolType));
      this.series.attachPrimitive(n), this._addTool(n, this._activeToolType), this._points = [], this.chart.timeScale().applyOptions({}), this._selectTool(n);
    } else if (this._activeToolType === "Rectangle") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new J(this.chart, this.series, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof J) {
        const n = this._points[0], r = this._points[1];
        this._activeTool.updatePoints(n, r);
        const c = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(c);
      }
    } else if (this._activeToolType === "PriceRange") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new tt(this.chart, this.series, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof tt) {
        const n = this._points[0], r = this._points[1];
        this._activeTool.updatePoints(n, r);
        const c = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(c);
      }
    } else if (this._activeToolType === "Circle") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new Q(this.chart, this.series, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof Q) {
        const n = this._points[0], r = this._points[1];
        this._activeTool.updatePoints(n, r);
        const c = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(c);
      }
    } else if (this._activeToolType === "ElliottImpulseWave") {
      if (this._points.length === 1)
        this._activeTool = new et(this.chart, this.series, [l], this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      else if (this._activeTool instanceof et && (this._activeTool.addPoint(l), this._points.length === 6)) {
        const n = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(n);
      }
    } else if (this._activeToolType === "ElliottCorrectionWave") {
      if (this._points.length === 1)
        this._activeTool = new it(this.chart, this.series, [l], this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      else if (this._activeTool instanceof it && (this._activeTool.addPoint(l), this._points.length === 4)) {
        const n = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(n);
      }
    } else if (this._activeToolType === "DateRange") {
      if (a && (this._points[this._points.length - 1] = a), this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new st(this.chart, this.series, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2 && this._activeTool instanceof st) {
        const n = this._points[0], r = this._points[1];
        this._activeTool.updatePoints(n, r);
        const c = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(c);
      }
    } else if (this._activeToolType === "FibExtension") {
      if (this._points.length === 1) {
        const n = this._points[0];
        this._activeTool = new X(this.chart, this.series, n, n, n, this.getToolOptions(this._activeToolType)), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else if (this._points.length === 2) {
        if (this._activeTool instanceof X) {
          const n = this._points[0], r = this._points[1];
          this._activeTool.updatePoints(n, r, r);
        }
      } else if (this._points.length === 3 && this._activeTool instanceof X) {
        const n = this._points[0], r = this._points[1], c = this._points[2];
        this._activeTool.updatePoints(n, r, c);
        const p = this._activeTool;
        this._activeTool = null, this._points = [], this._selectTool(p);
      }
    } else if (this._activeToolType === "Path") {
      const n = Date.now();
      if (n - this._lastClickTime < 300 && this._lastClickPoint && t.point) {
        const c = Math.abs(t.point.x - this._lastClickPoint.x), p = Math.abs(t.point.y - this._lastClickPoint.y);
        if (c < 10 && p < 10 && this._points.length >= 2) {
          this._points.pop(), this._activeTool instanceof L && this._activeTool.updatePoints([...this._points]);
          const _ = this._activeTool;
          this._activeTool = null, this._points = [], this._lastClickTime = 0, this._lastClickPoint = null, this._selectTool(_);
          return;
        }
      }
      if (this._lastClickTime = n, this._lastClickPoint = t.point ? { x: t.point.x, y: t.point.y } : null, this._points.length === 1) {
        const c = { ...K.path, ...this.getToolOptions(this._activeToolType) };
        this._activeTool = new L(this.chart, this.series, [...this._points], c), this.series.attachPrimitive(this._activeTool), this._addTool(this._activeTool, this._activeToolType);
      } else this._activeTool instanceof L && this._activeTool.updatePoints([...this._points]);
    }
  };
  _addTool(t, e) {
    t.toolType = e, this._tools.push(t);
  }
  _moveHandler = (t) => {
    if (this._activeToolType === "None" || !t.point) return;
    const e = this.series.coordinateToPrice(t.point.y);
    if (e === null) return;
    const s = this.chart.timeScale().coordinateToLogical(t.point.x);
    if (s === null) return;
    const o = { logical: s, price: e };
    if (!(this._activeToolType === "Brush" || this._activeToolType === "Highlighter")) {
      if (this._activeToolType === "HorizontalLine" && this._activeTool instanceof Y)
        this._activeTool.updatePrice(e), this.chart.timeScale().applyOptions({});
      else if (this._activeToolType === "VerticalLine" && this._activeTool instanceof Z)
        this._activeTool.updatePosition(s), this.chart.timeScale().applyOptions({});
      else if (this._activeToolType === "CrossLine" && this._activeTool instanceof ft)
        this._activeTool.updatePoint(o), this.chart.timeScale().applyOptions({});
      else if (this._activeToolType === "HorizontalRay" && this._activeTool instanceof q)
        this._activeTool.updatePoint(o), this.chart.timeScale().applyOptions({});
      else if ((this._activeToolType === "TrendLine" || this._activeToolType === "Arrow" || this._activeToolType === "Ray" || this._activeToolType === "ExtendedLine") && this._activeTool instanceof D) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          let r = { logical: n, price: e };
          const c = this._points[0];
          this._activeTool.updatePoints(c, r), this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "FibRetracement" && this._activeTool instanceof G) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e }, c = this._points[0];
          this._activeTool.updatePoints(c, r), this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "ParallelChannel" && this._activeTool instanceof B) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e };
          if (this._points.length === 1) {
            const c = this._points[0];
            this._activeTool.updatePoints(c, r, r);
          } else if (this._points.length === 2) {
            const c = this._points[0], p = this._points[1];
            this._activeTool.updatePoints(c, p, r);
          }
          this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "Triangle" && this._activeTool instanceof I) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e };
          if (this._points.length === 1) {
            const c = this._points[0];
            this._activeTool.updatePoints(c, r, r);
          } else if (this._points.length === 2) {
            const c = this._points[0], p = this._points[1];
            this._activeTool.updatePoints(c, p, r);
          }
          this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "Callout" && this._activeTool instanceof W)
        this._activeTool.updatePoints(this._points[0], o), this.chart.timeScale().applyOptions({});
      else if (this._activeToolType === "Rectangle" && this._activeTool instanceof J) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e }, c = this._points[0];
          this._activeTool.updatePoints(c, r), this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "PriceRange" && this._activeTool instanceof tt) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e }, c = this._points[0];
          this._activeTool.updatePoints(c, r), this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "Circle" && this._activeTool instanceof Q) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e }, c = this._points[0];
          this._activeTool.updatePoints(c, r), this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "LongPosition" && this._activeTool instanceof N) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e };
          if (this._points.length === 1) {
            const c = this._points[0], p = r, _ = p.price - c.price, d = c.price - _, u = {
              logical: p.logical,
              price: d
            };
            this._activeTool.updatePoints(c, u, p), this.chart.timeScale().applyOptions({});
          }
        }
      } else if (this._activeToolType === "ShortPosition" && this._activeTool instanceof $) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e };
          if (this._points.length === 1) {
            const c = this._points[0], p = r, _ = c.price - p.price, d = c.price + _, u = {
              logical: p.logical,
              price: d
            };
            this._activeTool.updatePoints(c, u, p), this.chart.timeScale().applyOptions({});
          }
        }
      } else if (this._activeToolType === "Path" && this._activeTool instanceof L && this._points.length >= 1) {
        const l = [...this._points, o];
        this._activeTool.updatePoints(l), this.chart.timeScale().applyOptions({});
      } else if (this._activeToolType === "ElliottImpulseWave" && this._activeTool instanceof et && this._points.length >= 1) {
        const l = [...this._points, o];
        this._activeTool.updatePoints(l), this.chart.timeScale().applyOptions({});
      } else if (this._activeToolType === "ElliottCorrectionWave" && this._activeTool instanceof it && this._points.length >= 1) {
        const l = [...this._points, o];
        this._activeTool.updatePoints(l), this.chart.timeScale().applyOptions({});
      } else if (this._activeToolType === "DateRange" && this._activeTool instanceof st) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e }, c = this._points[0];
          this._activeTool.updatePoints(c, r), this.chart.timeScale().applyOptions({});
        }
      } else if (this._activeToolType === "FibExtension" && this._activeTool instanceof X) {
        const l = this.chart.timeScale(), a = t.point.x, n = l.coordinateToLogical(a);
        if (n !== null) {
          const r = { logical: n, price: e }, c = this._points[0];
          if (this._points.length === 1)
            this._activeTool.updatePoints(c, r, r);
          else if (this._points.length === 2) {
            const p = this._points[1];
            this._activeTool.updatePoints(c, p, r);
          }
          this.chart.timeScale().applyOptions({});
        }
      }
    }
  };
}
export {
  _i as LineToolManager
};
