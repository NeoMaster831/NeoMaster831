// <poly-bg> — refined rotating polyhedron wireframe.
// Successor to the site's original static/js/sage3d.js (THREE.IcosahedronGeometry +
// EdgesGeometry + LineSegments2, rotation .002/.003). Same subject, drawn in canvas 2D so
// edges get depth-graded alpha/width, vertex nodes, and true hairlines at any DPR.
(function () {
  const PHI = (1 + Math.sqrt(5)) / 2;

  function cyc(a, b, c) { return [[a, b, c], [b, c, a], [c, a, b]]; }
  function signs(v) {
    const out = [];
    for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) {
      out.push([v[0] * sx, v[1] * sy, v[2] * sz]);
    }
    return out;
  }
  function dedupe(list) {
    const seen = new Map();
    for (const p of list) {
      const k = p.map((n) => n.toFixed(5)).join(',');
      if (!seen.has(k)) seen.set(k, p);
    }
    return [...seen.values()];
  }
  function icosahedron() {
    let v = [];
    for (const perm of cyc(0, 1, PHI)) v = v.concat(signs(perm));
    return normalize(dedupe(v));
  }
  function dodecahedron() {
    let v = signs([1, 1, 1]);
    for (const perm of cyc(0, 1 / PHI, PHI)) v = v.concat(signs(perm));
    return normalize(dedupe(v));
  }
  function normalize(v) {
    const r = Math.hypot(...v[0]);
    return v.map((p) => p.map((n) => n / r));
  }
  function edgesOf(v) {
    let min = Infinity;
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
      const d = dist(v[i], v[j]);
      if (d < min) min = d;
    }
    const e = [];
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) {
      if (dist(v[i], v[j]) < min * 1.05) e.push([i, j]);
    }
    return e;
  }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

  const SHAPES = { icosahedron, dodecahedron };

  class PolyBg extends HTMLElement {
    connectedCallback() {
      if (this._canvas) return;
      this.style.display = 'block';
      if (!this.style.height) this.style.height = '100%';
      this.style.position = 'relative';
      const c = document.createElement('canvas');
      c.style.cssText = 'display:block;position:absolute;inset:0;width:100%;height:100%';
      this.appendChild(c);
      this._canvas = c;
      this._ctx = c.getContext('2d');

      const shape = SHAPES[this.getAttribute('shape')] || icosahedron;
      this._v = shape();
      this._e = edgesOf(this._v);
      const inner = this.getAttribute('inner');
      if (inner && SHAPES[inner]) {
        this._iv = SHAPES[inner]().map((p) => p.map((n) => n * (parseFloat(this.getAttribute('inner-scale')) || 0.52)));
        this._ie = edgesOf(this._iv);
      }
      this._color = this.getAttribute('color') || '#b68235';
      this._nodeColor = this.getAttribute('node-color') || this._color;
      this._alpha = parseFloat(this.getAttribute('opacity') || '0.75');
      this._nodes = this.getAttribute('nodes') !== 'false';
      this._speed = parseFloat(this.getAttribute('speed') || '1');
      this._rx = 0.4; this._ry = 0.2;
      this._ro = new ResizeObserver(() => { requestAnimationFrame(() => this._resize()); });
      this._ro.observe(this);
      this._resize();
      this._last = performance.now();
      this._tick();
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
    }
    _resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.clientWidth || 400, h = this.clientHeight || 400;
      this._w = w; this._h = h;
      this._canvas.width = Math.round(w * dpr);
      this._canvas.height = Math.round(h * dpr);
      this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    _project(p) {
      const cx = Math.cos(this._rx), sx = Math.sin(this._rx);
      const cy = Math.cos(this._ry), sy = Math.sin(this._ry);
      let [x, y, z] = p;
      let y2 = y * cx - z * sx, z2 = y * sx + z * cx;
      let x2 = x * cy + z2 * sy, z3 = -x * sy + z2 * cy;
      const R = Math.min(this._w, this._h) * 0.5 * 0.78;
      const d = 4.2, k = d / (d - z3);
      return [this._w / 2 + x2 * R * k, this._h / 2 + y2 * R * k, z3];
    }
    _draw(verts, edges, weight) {
      const ctx = this._ctx;
      const pts = verts.map((p) => this._project(p));
      const graded = edges.map(([i, j]) => ({ i, j, z: (pts[i][2] + pts[j][2]) / 2 })).sort((a, b) => a.z - b.z);
      for (const { i, j, z } of graded) {
        const t = (z + 1) / 2;
        ctx.strokeStyle = this._color;
        ctx.globalAlpha = this._alpha * (0.16 + 0.84 * t) * weight;
        ctx.lineWidth = 0.7 + 1.1 * t;
        ctx.beginPath();
        ctx.moveTo(pts[i][0], pts[i][1]);
        ctx.lineTo(pts[j][0], pts[j][1]);
        ctx.stroke();
      }
      if (this._nodes) {
        for (const p of pts) {
          const t = (p[2] + 1) / 2;
          ctx.globalAlpha = this._alpha * (0.2 + 0.8 * t) * weight;
          ctx.fillStyle = this._nodeColor;
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1 + 1.6 * t, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    _tick() {
      this._raf = requestAnimationFrame(() => this._tick());
      const now = performance.now();
      const dt = Math.min(now - this._last, 60);
      this._last = now;
      this._rx += 0.00012 * dt * this._speed;
      this._ry += 0.00019 * dt * this._speed;
      this._ctx.clearRect(0, 0, this._w, this._h);
      if (this._iv) this._draw(this._iv, this._ie, 0.45);
      this._draw(this._v, this._e, 1);
    }
  }
  if (!customElements.get('poly-bg')) customElements.define('poly-bg', PolyBg);
})();
