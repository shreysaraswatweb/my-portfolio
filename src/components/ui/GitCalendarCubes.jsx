'use client';

import { useEffect, useRef, useState } from 'react';

import shreyGithubData from '../../data/shreyGithubData.json';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHREY'S REAL GITHUB CONTRIBUTIONS (shreysaraswatweb)
 * Formats authentic GitHub contribution data into a 7-row calendar matrix
 * where Row 0 is Sunday ... Row 6 is Saturday.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function buildGitCalendarData(contributions = shreyGithubData.contributions, totalWeeks = 24) {
  const dataList = Array.isArray(contributions) && contributions.length > 0
    ? contributions
    : shreyGithubData.contributions;

  const weeks = [];
  let currentWeek = [];

  for (const day of dataList) {
    const dow = new Date(day.date + 'T12:00:00Z').getUTCDay();
    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const selectedWeeks = weeks.slice(-totalWeeks);
  const rows = 7;
  const cols = selectedWeeks.length;
  const cells = [];

  for (let r = 0; r < rows; r++) {
    const rowList = [];
    for (let c = 0; c < cols; c++) {
      const week = selectedWeeks[c];
      const day = week?.find((d) => new Date(d.date + 'T12:00:00Z').getUTCDay() === r);
      if (day) {
        const dObj = new Date(day.date + 'T12:00:00Z');
        const dateStr = dObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        });
        rowList.push({
          col: c,
          row: r,
          level: day.level,
          count: day.count,
          date: dateStr,
          isFuture: false,
        });
      } else {
        rowList.push({
          col: c,
          row: r,
          level: 0,
          count: 0,
          date: '',
          isFuture: false,
        });
      }
    }
    cells.push(rowList);
  }

  const totalCommits = dataList.reduce((sum, d) => sum + (d.count || 0), 0);

  return { cells, totalCommits, cols, rows };
}

// ─── WebGL2 Shader Sources ───────────────────────────────────────────────────

const VERTEX = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUv;
in vec2 aCenter;
in vec4 aRotation;
in vec2 aState;
in vec3 aFaceColor;
in vec3 aEdgeColor;

uniform mat4 uProjection;
uniform float uSize;

out vec3 vNormal;
out vec2 vUv;
out float vFlash;
out vec3 vFaceColor;
out vec3 vEdgeColor;

vec3 turn(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
  vec3 local = turn(aRotation, aPosition * uSize * aState.y);
  vNormal = turn(aRotation, aNormal);
  vUv = aUv;
  vFlash = aState.x;
  vFaceColor = aFaceColor;
  vEdgeColor = aEdgeColor;
  gl_Position = uProjection * vec4(vec3(aCenter, 0.0) + local, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec2 vUv;
in float vFlash;
in vec3 vFaceColor;
in vec3 vEdgeColor;

uniform vec3 uRipple;
uniform vec3 uLight;
uniform float uShading;
uniform float uEdgeWidth;
uniform float uStyle;
uniform float uMarks;
uniform float uOpacity;

out vec4 outColor;

void main() {
  vec2 span = max(fwidth(vUv), vec2(0.00001));
  vec2 border = min(vUv, 1.0 - vUv) / span;
  bool vertical = border.x < border.y;
  float distance = min(border.x, border.y);
  float halfWidth = uEdgeWidth * 0.5;
  float cover = 1.0 - smoothstep(halfWidth - 0.5, halfWidth + 0.5, distance);
  float along = vertical ? vUv.y : vUv.x;
  float phase = along * uMarks;
  float step = max(vertical ? span.y : span.x, 0.00001) * uMarks;
  float offset = abs(fract(phase + 0.5) - 0.5);

  if (uStyle > 0.5 && uStyle < 1.5) {
    cover *= 1.0 - smoothstep(0.25 - step, 0.25 + step, offset);
  } else if (uStyle > 1.5 && uStyle < 2.5) {
    float radius = max(uEdgeWidth * 0.9, 1.0);
    float dot = length(vec2(offset / step, distance));
    cover = 1.0 - smoothstep(radius - 0.75, radius + 0.75, dot);
  } else if (uStyle > 2.5) {
    cover = 0.0;
  }

  vec3 normal = normalize(vNormal);
  cover *= smoothstep(0.06, 0.28, abs(normal.z));
  float side = clamp(1.0 - normal.z, 0.0, 1.0);
  float toward = clamp(0.6 + 0.6 * dot(normalize(normal.xy + vec2(0.00001)), normalize(uLight.xy)), 0.0, 1.0);

  vec3 face = mix(vFaceColor, vEdgeColor, side * mix(0.12, 0.42, toward) * uShading);
  face = mix(face, uRipple, vFlash * 0.35);
  vec3 edge = mix(vEdgeColor, uRipple, vFlash);
  vec3 color = mix(face, edge, cover);
  float alpha = mix(uOpacity, 1.0, cover);

  outColor = vec4(color * alpha, alpha);
}`;

const FACES = [
  [0, 0, 1, 1, 0, 0, 0, 1, 0],
  [0, 0, -1, -1, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, -1, 0, 1, 0],
  [-1, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, -1],
  [0, -1, 0, 1, 0, 0, 0, 0, 1],
];

const buildCube = () => {
  const vertices = [];
  const indices = [];
  FACES.forEach(([nx, ny, nz, ux, uy, uz, vx, vy, vz], face) => {
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ].forEach(([u, v]) => {
      vertices.push(
        nx * 0.5 + (u - 0.5) * ux + (v - 0.5) * vx,
        ny * 0.5 + (u - 0.5) * uy + (v - 0.5) * vy,
        nz * 0.5 + (u - 0.5) * uz + (v - 0.5) * vz,
        nx,
        ny,
        nz,
        u,
        v
      );
    });
    const base = face * 4;
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  });
  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
};

const STYLES = { solid: 0, dashed: 1, dotted: 2, none: 3 };
const INTRO_SECONDS = 1.1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);

  [
    'aPosition',
    'aNormal',
    'aUv',
    'aCenter',
    'aRotation',
    'aState',
    'aFaceColor',
    'aEdgeColor',
  ].forEach((name, index) => gl.bindAttribLocation(program, index, name));

  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
};

const toRotation = (rx, ry, out, offset) => {
  const angle = Math.hypot(rx, ry);
  if (angle < 0.000001) {
    out[offset] = 0;
    out[offset + 1] = 0;
    out[offset + 2] = 0;
    out[offset + 3] = 1;
    return;
  }
  const s = Math.sin(angle / 2) / angle;
  out[offset] = rx * s;
  out[offset + 1] = ry * s;
  out[offset + 2] = 0;
  out[offset + 3] = Math.cos(angle / 2);
};

const multiply = (a, b, out, offset) => {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  out[offset] = aw * bx + ax * bw + ay * bz - az * by;
  out[offset + 1] = aw * by - ax * bz + ay * bw + az * bx;
  out[offset + 2] = aw * bz + ax * by - ay * bx + az * bw;
  out[offset + 3] = aw * bw - ax * bx - ay * by - az * bz;
};

const projection = (width, height, scale, perspective) => {
  const halfWidth = width / 2 / scale;
  const halfHeight = height / 2 / scale;
  const depth = Math.max(halfWidth, halfHeight) * 4 + 4;
  if (perspective <= 0.001) {
    return new Float32Array([
      1 / halfWidth, 0, 0, 0,
      0, 1 / halfHeight, 0, 0,
      0, 0, -1 / depth, 0,
      0, 0, 0, 1,
    ]);
  }
  const fov = ((8 + perspective * 45) * Math.PI) / 180;
  const distance = halfHeight / Math.tan(fov / 2);
  const near = Math.max(0.1, distance - depth);
  const far = distance + depth;
  const f = 1 / Math.tan(fov / 2);
  const aspect = halfWidth / halfHeight;
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far) - ((far + near) / (near - far)) * distance, distance,
  ]);
};

// Color palettes for GitHub Contribution Levels (dark mode & light mode)
const PALETTES = {
  dark: {
    0: { face: [0.082, 0.106, 0.137], edge: [0.14, 0.17, 0.22] }, // Inactive #151b23
    1: { face: [0.035, 0.24, 0.15], edge: [0.05, 0.35, 0.22] },  // Level 1 #093c26
    2: { face: [0.024, 0.42, 0.26], edge: [0.05, 0.58, 0.35] },  // Level 2 #066b42
    3: { face: [0.08, 0.73, 0.48], edge: [0.18, 0.88, 0.60] },   // Level 3 #14ba7a
    4: { face: [0.22, 0.92, 0.62], edge: [0.65, 1.0, 0.82] },    // Level 4 #38ebb0
  },
  light: {
    0: { face: [0.92, 0.93, 0.94], edge: [0.82, 0.84, 0.86] },
    1: { face: [0.61, 0.91, 0.66], edge: [0.48, 0.82, 0.54] },
    2: { face: [0.25, 0.77, 0.39], edge: [0.18, 0.68, 0.32] },
    3: { face: [0.19, 0.63, 0.31], edge: [0.12, 0.52, 0.24] },
    4: { face: [0.13, 0.43, 0.22], edge: [0.08, 0.35, 0.16] },
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GitCalendarCubes: 3D Interactive WebGL2 Git Contribution Heatmap
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function GitCalendarCubes({
  username = 'shreysaraswatweb',
  cols = 24,
  rows = 7,
  onTotalLoaded,
  gap = 0.22,
  edgeWidth = 1.2,
  edgeStyle = 'solid',
  faceOpacity = 1,
  shading = 0.65,
  maxAngle = 42,
  radius = 3.6,
  speed = 1.0,
  bounce = 0.38,
  brush = 1.0,
  perspective = 0.12,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor = '#34d399',
  rippleSpeed = 1.15,
  intro = true,
  paused = false,
  dpr,
  onHover,
  onLeave,
  className = '',
  ...rest
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);

  // Initial state populated with Shrey's real contributions
  const [calendarData, setCalendarData] = useState(() =>
    buildGitCalendarData(shreyGithubData.contributions, cols)
  );

  // Fetch live contributions from GitHub API for real-time updates
  useEffect(() => {
    if (!username) return;
    let isMounted = true;
    const controller = new AbortController();

    fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last&client=react-github-calendar`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.contributions) {
          const processed = buildGitCalendarData(data.contributions, cols);
          setCalendarData(processed);
          if (onTotalLoaded) {
            onTotalLoaded(processed.totalCommits);
          }
        }
      })
      .catch(() => {
        // Silently retain preloaded real data
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [username, cols, onTotalLoaded]);

  const calendarCells = calendarData.cells;

  const [webglSupported, setWebglSupported] = useState(true);

  const settings = {
    cols: Math.max(1, cols),
    rows: Math.max(1, rows),
    gap: clamp(gap, 0, 0.9),
    edgeWidth: Math.max(0, edgeWidth),
    edgeStyle,
    faceOpacity: clamp(faceOpacity, 0, 1),
    shading: Math.max(0, shading),
    maxAngle,
    radius: Math.max(0.5, radius),
    speed: Math.max(0.05, speed),
    bounce: clamp(bounce, 0, 1),
    brush: Math.max(0, brush),
    perspective: clamp(perspective, 0, 1),
    autoAnimate,
    rippleOnClick,
    rippleColor: String(rippleColor),
    rippleSpeed: Math.max(0.05, rippleSpeed),
    intro,
    paused,
    dpr,
  };

  const settingsRef = useRef(settings);
  const calendarDataRef = useRef(calendarCells);
  const onHoverRef = useRef(onHover);
  const onLeaveRef = useRef(onLeave);

  useEffect(() => {
    settingsRef.current = settings;
    calendarDataRef.current = calendarCells;
    onHoverRef.current = onHover;
    onLeaveRef.current = onLeave;
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    let gl = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        depth: true,
        stencil: false,
      });
    } catch {
      gl = null;
    }
    if (!gl) {
      setWebglSupported(false);
      return undefined;
    }

    const shader = link(gl);
    if (!shader) {
      setWebglSupported(false);
      return undefined;
    }

    const cube = buildCube();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

    // Mesh attributes: location 0=position, 1=normal, 2=uv
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube.indices, gl.STATIC_DRAW);

    // Instance buffer:
    // Stride = 14 floats * 4 bytes = 56 bytes
    // location 3 (aCenter): 2 floats @ offset 0
    // location 4 (aRotation): 4 floats @ offset 8
    // location 5 (aState): 2 floats @ offset 24
    // location 6 (aFaceColor): 3 floats @ offset 32
    // location 7 (aEdgeColor): 3 floats @ offset 44
    const STRIDE = 14;
    const instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);

    [
      [3, 2, 0],
      [4, 4, 8],
      [5, 2, 24],
      [6, 3, 32],
      [7, 3, 44],
    ].forEach(([location, size, offset]) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 56, offset);
      gl.vertexAttribDivisor(location, 1);
    });

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const colorCache = new Map();
    const toRgb = (value) => {
      if (colorCache.has(value)) return colorCache.get(value);
      let rgb = [0.2, 0.88, 0.6];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#ffffff';
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(value, rgb);
      return rgb;
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const view = { width: 1, height: 1, ratio: 1, scale: 1 };
    const pointer = { x: 0, y: 0, inside: false, moved: 0 };
    const cursor = { x: 0, y: 0, vx: 0, vy: 0, weight: 0, primed: false };

    const grid = { cols: 0, rows: 0, count: 0 };
    let rx = new Float32Array(0);
    let ry = new Float32Array(0);
    let wx = new Float32Array(0);
    let wy = new Float32Array(0);
    let glow = new Float32Array(0);
    const rings = [];
    let delays = new Float32Array(0);
    let instances = new Float32Array(0);
    let clock = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 99;
    let raf = 0;
    let last = 0;
    let visible = true;

    const allocate = (colsCount, rowsCount) => {
      if (grid.cols === colsCount && grid.rows === rowsCount) return;
      grid.cols = colsCount;
      grid.rows = rowsCount;
      grid.count = colsCount * rowsCount;

      rx = new Float32Array(grid.count);
      ry = new Float32Array(grid.count);
      wx = new Float32Array(grid.count);
      wy = new Float32Array(grid.count);
      glow = new Float32Array(grid.count);
      delays = new Float32Array(grid.count);
      instances = new Float32Array(grid.count * STRIDE);

      const centerCol = (colsCount - 1) / 2;
      const centerRow = (rowsCount - 1) / 2;
      const maxDist = Math.hypot(centerCol, centerRow) || 1;

      for (let i = 0; i < grid.count; i++) {
        const col = i % colsCount;
        const row = Math.floor(i / colsCount);
        delays[i] = Math.hypot(col - centerCol, row - centerRow) / maxDist;
      }
    };

    const cellOf = (i) => {
      const col = i % grid.cols;
      const row = Math.floor(i / grid.cols);
      const centerCol = (grid.cols - 1) / 2;
      const centerRow = (grid.rows - 1) / 2;
      return [col - centerCol, centerRow - row];
    };

    const toWorld = (x, y) => [
      (x - view.width / 2) / view.scale,
      (view.height / 2 - y) / view.scale,
    ];

    const ripple = (x, y) => {
      const s = settingsRef.current;
      if (!s.rippleOnClick || reduce) return;
      const [ox, oy] = toWorld(x, y);
      rings.push({ x: ox, y: oy, born: clock });
      if (rings.length > 6) rings.shift();
      wake();
    };

    const render = () => {
      const s = settingsRef.current;
      const width = canvas.width;
      const height = canvas.height;
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!grid.count) return;

      gl.useProgram(shader.program);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, instances, gl.DYNAMIC_DRAW);

      const u = shader.uniforms;
      gl.uniformMatrix4fv(
        u.uProjection,
        false,
        projection(view.width, view.height, view.scale, s.perspective)
      );
      gl.uniform1f(u.uSize, 1 - s.gap);
      gl.uniform3fv(u.uRipple, toRgb(s.rippleColor));

      const light = [-0.42, 0.55, 0.72];
      const length = Math.hypot(...light);
      gl.uniform3f(u.uLight, light[0] / length, light[1] / length, light[2] / length);
      gl.uniform1f(u.uShading, s.shading);
      gl.uniform1f(u.uEdgeWidth, s.edgeWidth * view.ratio);
      gl.uniform1f(u.uStyle, STYLES[s.edgeStyle] ?? 0);

      const cubePixels = (1 - s.gap) * view.scale;
      const spacing =
        s.edgeStyle === 'dotted'
          ? Math.max(4, s.edgeWidth * 4)
          : Math.max(6, s.edgeWidth * 6);
      gl.uniform1f(u.uMarks, Math.max(1, Math.round(cubePixels / spacing)));
      gl.uniform1f(u.uOpacity, s.faceOpacity);

      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      if (s.faceOpacity >= 0.999) {
        gl.depthMask(true);
        gl.cullFace(gl.BACK);
        gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, grid.count);
      } else {
        gl.depthMask(false);
        gl.cullFace(gl.FRONT);
        gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, grid.count);
        gl.cullFace(gl.BACK);
        gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, grid.count);
        gl.depthMask(true);
      }
    };

    const isLightMode = () =>
      document.documentElement.getAttribute('data-theme') === 'light';

    const step = (dt) => {
      const s = settingsRef.current;
      allocate(s.cols, s.rows);
      clock += dt;
      if (introClock < 99) introClock += dt;

      const live =
        s.autoAnimate && !reduce && (!pointer.inside || clock - pointer.moved > 2.5);
      let goalX = cursor.x;
      let goalY = cursor.y;
      let engaged = false;

      if (pointer.inside && clock - pointer.moved <= 2.5) {
        [goalX, goalY] = toWorld(pointer.x, pointer.y);
        engaged = true;
      } else if (live) {
        const reachX = grid.cols * 0.42;
        const reachY = grid.rows * 0.42;
        goalX = Math.sin(clock * 0.42) * reachX * Math.cos(clock * 0.15);
        goalY = Math.sin(clock * 0.6 + 1.2) * reachY;
        engaged = true;
      }

      if (!cursor.primed && engaged) {
        cursor.x = goalX;
        cursor.y = goalY;
        cursor.primed = true;
      }

      const follow = 1 - Math.exp(-dt * 18);
      const prevX = cursor.x;
      const prevY = cursor.y;
      cursor.x += (goalX - cursor.x) * follow;
      cursor.y += (goalY - cursor.y) * follow;

      const blend = 1 - Math.exp(-dt * 10);
      cursor.vx += ((cursor.x - prevX) / Math.max(dt, 0.001) - cursor.vx) * blend;
      cursor.vy += ((cursor.y - prevY) / Math.max(dt, 0.001) - cursor.vy) * blend;
      cursor.weight +=
        ((engaged ? 1 : 0) - cursor.weight) * (1 - Math.exp(-dt * (engaged ? 6 : 2.5)));

      const stiffness = 160 * s.speed * s.speed;
      const damping = 2 * (1 - 0.82 * s.bounce) * Math.sqrt(stiffness);
      const maxAngle = (s.maxAngle * Math.PI) / 180;
      const lift = 0.8;
      const travel = 8 * s.rippleSpeed;
      const fade = Math.exp(-dt * 3.2);
      const reachLimit = Math.max(grid.cols, grid.rows) * 1.5 + 2;

      for (let k = rings.length - 1; k >= 0; k--) {
        if ((clock - rings[k].born) * travel > reachLimit) rings.splice(k, 1);
      }

      const speedNow = Math.hypot(cursor.vx, cursor.vy);
      const sweepX = speedNow > 0.0001 ? -cursor.vy / speedNow : 0;
      const sweepY = speedNow > 0.0001 ? cursor.vx / speedNow : 0;
      const sweep = reduce ? 0 : Math.min(speedNow, 40) * s.brush * 1.6;
      let moving = false;

      const currentPalette = isLightMode() ? PALETTES.light : PALETTES.dark;
      const calData = calendarDataRef.current;

      for (let i = 0; i < grid.count; i++) {
        const col = i % grid.cols;
        const row = Math.floor(i / grid.cols);
        const [cx, cy] = cellOf(i);
        const dx = cx - cursor.x;
        const dy = cy - cursor.y;
        const distance = Math.hypot(dx, dy);
        const t = distance / s.radius;
        const falloff = t < 1 ? (1 - t * t) * (1 - t * t) * cursor.weight : 0;

        let targetX = 0;
        let targetY = 0;
        if (falloff > 0 && distance > 0.0001) {
          const tilt = maxAngle * falloff * (distance / Math.hypot(distance, lift));
          targetX = (dy / distance) * tilt;
          targetY = (-dx / distance) * tilt;
        }

        if (falloff > 0 && sweep > 0) {
          wx[i] += sweepX * sweep * falloff * dt * 4;
          wy[i] += sweepY * sweep * falloff * dt * 4;
        }

        glow[i] *= fade;

        for (let k = 0; k < rings.length; k++) {
          const ring = rings[k];
          const ox = cx - ring.x;
          const oy = cy - ring.y;
          const reach = Math.hypot(ox, oy);
          const now = (clock - ring.born) * travel;
          if (reach > now || reach <= now - travel * dt || reach < 0.0001) continue;
          const strength = Math.exp(-reach / (Math.max(grid.cols, grid.rows) * 0.7));
          wx[i] -= (oy / reach) * 13 * strength;
          wy[i] += (ox / reach) * 13 * strength;
          glow[i] = Math.max(glow[i], strength);
        }

        if (glow[i] > 0.01) moving = true;

        if (reduce) {
          rx[i] = targetX;
          ry[i] = targetY;
          wx[i] = 0;
          wy[i] = 0;
        } else {
          wx[i] += (stiffness * (targetX - rx[i]) - damping * wx[i]) * dt;
          wy[i] += (stiffness * (targetY - ry[i]) - damping * wy[i]) * dt;
          rx[i] += wx[i] * dt;
          ry[i] += wy[i] * dt;
        }

        if (
          Math.abs(targetX - rx[i]) + Math.abs(targetY - ry[i]) > 0.0005 ||
          Math.abs(wx[i]) + Math.abs(wy[i]) > 0.0005
        ) {
          moving = true;
        }

        let grow = 1;
        let tumble = 0;
        if (introClock < 99) {
          const local = clamp((introClock - delays[i] * 0.5) / INTRO_SECONDS, 0, 1);
          const eased = 1 - Math.pow(1 - local, 3);
          grow = eased;
          tumble = (1 - eased) * (Math.PI / 2);
          if (local < 1) moving = true;
        }

        const tilt = [0, 0, 0, 1];
        toRotation(rx[i], ry[i], tilt, 0);
        const turn = [Math.sin(tumble / 2), 0, 0, Math.cos(tumble / 2)];

        // Cell Level & Palette lookup
        const cellLevel = calData?.[row]?.[col]?.level ?? 0;
        const colorPair = currentPalette[cellLevel] || currentPalette[0];

        const base = i * STRIDE;
        instances[base] = cx;
        instances[base + 1] = cy;
        multiply(tilt, turn, instances, base + 2);
        instances[base + 6] = glow[i];
        instances[base + 7] = grow;
        instances[base + 8] = colorPair.face[0];
        instances[base + 9] = colorPair.face[1];
        instances[base + 10] = colorPair.face[2];
        instances[base + 11] = colorPair.edge[0];
        instances[base + 12] = colorPair.edge[1];
        instances[base + 13] = colorPair.edge[2];
      }

      if (introClock >= INTRO_SECONDS + 0.6 && introClock < 99) introClock = 99;

      return (
        moving ||
        live ||
        rings.length > 0 ||
        (engaged && speedNow > 0.01) ||
        Math.abs((engaged ? 1 : 0) - cursor.weight) > 0.002
      );
    };

    const frame = (now) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const active = s.paused ? false : step(dt);
      render();
      if (active) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const s = settingsRef.current;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 2);
      view.width = width;
      view.height = height;

      // Fit 24x7 rectangular aspect ratio perfectly inside the container
      view.scale = Math.min(
        width / (s.cols + 0.75),
        height / (s.rows + 0.75)
      );

      canvas.width = Math.max(1, Math.round(width * view.ratio));
      canvas.height = Math.max(1, Math.round(height * view.ratio));

      allocate(s.cols, s.rows);

      if (!raf) {
        step(0);
        render();
      }
      wake();
    };

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const inside = px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

      pointer.x = px;
      pointer.y = py;
      pointer.inside = inside;

      if (inside) {
        pointer.moved = clock;

        // Determine which cell is under pointer for tooltip
        const [wx, wy] = toWorld(px, py);
        const col = Math.round(wx + (grid.cols - 1) / 2);
        const row = Math.round((grid.rows - 1) / 2 - wy);

        if (col >= 0 && col < grid.cols && row >= 0 && row < grid.rows) {
          const cell = calendarDataRef.current?.[row]?.[col];
          if (cell && !cell.isFuture && onHoverRef.current) {
            const countStr =
              cell.count === 0
                ? `No contributions`
                : `${cell.count} contribution${cell.count === 1 ? '' : 's'}`;
            onHoverRef.current(`${countStr} on ${cell.date}`);
          }
        } else if (onHoverRef.current) {
          onHoverRef.current(null);
        }
      }
      wake();
    };

    const onPointerLeave = () => {
      pointer.inside = false;
      if (onHoverRef.current) onHoverRef.current(null);
      if (onLeaveRef.current) onLeaveRef.current();
      wake();
    };

    const onPointerDown = (event) => {
      const rect = container.getBoundingClientRect();
      ripple(event.clientX - rect.left, event.clientY - rect.top);
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('visibilitychange', onVisibility);

    resize();

    let lastCols = settingsRef.current.cols;
    let lastRows = settingsRef.current.rows;
    let lastDpr = settingsRef.current.dpr;

    wakeRef.current = () => {
      const s = settingsRef.current;
      if (s.cols !== lastCols || s.rows !== lastRows || s.dpr !== lastDpr) {
        lastCols = s.cols;
        lastRows = s.rows;
        lastDpr = s.dpr;
        resize();
        return;
      }
      if (!raf) {
        step(0);
        render();
      }
      wake();
    };

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(instanceBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(shader.program);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  const levelColors = [
    "bg-white/[0.05] dark:bg-white/[0.06] border border-white/[0.04]",
    "bg-emerald-950/70 border border-emerald-800/40 dark:bg-emerald-900/60",
    "bg-emerald-700/80 border border-emerald-600/40 dark:bg-emerald-700/80",
    "bg-emerald-500 border border-emerald-400/50 dark:bg-emerald-500",
    "bg-emerald-400 border border-emerald-300/60 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]",
  ];

  if (!webglSupported) {
    return (
      <div className={`flex gap-[3px] items-center justify-center h-full w-full overflow-hidden ${className}`}>
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex flex-col gap-[3px]">
            {Array.from({ length: rows }).map((_, r) => {
              const cell = calendarCells[r]?.[c];
              const lvl = cell?.level ?? 0;
              return (
                <div
                  key={r}
                  onMouseEnter={() =>
                    cell &&
                    onHover &&
                    onHover(
                      `${cell.count === 0 ? 'No contributions' : `${cell.count} contribution${cell.count === 1 ? '' : 's'}`} on ${cell.date}`
                    )
                  }
                  onMouseLeave={() => onLeave && onLeave()}
                  className={`h-[9px] w-[9px] sm:h-[10px] sm:w-[10px] rounded-[2px] ${levelColors[lvl]}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={[
        'relative h-full w-full touch-pan-y overflow-hidden cursor-pointer select-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
