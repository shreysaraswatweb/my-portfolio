import "./LocationMapBackground.css";

// 95 deterministic, seeded blocks modeling the residential street grid of Sector 28, Noida
const noidaSector28Blocks = [
  // Sector 28 Ward 3A Park area (top-left)
  { x: -56, y: -66, w: 67, h: 30, color: "#133022" },
  { x: -56, y: -33, w: 67, h: 30, color: "#153627" },
  { x: -56, y: 4, w: 32, h: 30, color: "#122a1f" },
  { x: -21, y: 4, w: 33, h: 30, color: "#163a2a" },
  { x: -56, y: 37, w: 32, h: 30, color: "#1d2531" },
  { x: -21, y: 37, w: 33, h: 30, color: "#161c24" },
  { x: -56, y: 74, w: 67, h: 29, color: "#171e27" },
  { x: -56, y: 106, w: 67, h: 29, color: "#1a222d" },
  { x: -56, y: 142, w: 32, h: 29, color: "#19212c" },
  { x: -21, y: 142, w: 33, h: 29, color: "#182029" },
  { x: -56, y: 174, w: 32, h: 29, color: "#182029" },
  { x: -21, y: 174, w: 33, h: 29, color: "#171e27" },
  { x: -56, y: 210, w: 32, h: 30, color: "#19212c" },
  { x: -21, y: 210, w: 33, h: 30, color: "#182029" },
  { x: -56, y: 243, w: 32, h: 30, color: "#161c24" },
  { x: -21, y: 243, w: 33, h: 30, color: "#182029" },
  { x: -56, y: 280, w: 67, h: 30, color: "#1c2430" },
  { x: -56, y: 313, w: 67, h: 30, color: "#19212c" },
  { x: 19, y: -66, w: 59, h: 30, color: "#1a222d" },
  { x: 19, y: -33, w: 59, h: 30, color: "#171e27" },
  { x: 19, y: 4, w: 59, h: 62, color: "#182029" },
  { x: 19, y: 74, w: 59, h: 29, color: "#1c2430" },
  { x: 19, y: 106, w: 59, h: 29, color: "#19212c" },
  { x: 19, y: 142, w: 28, h: 29, color: "#1c2430" },
  { x: 50, y: 142, w: 29, h: 29, color: "#1a222d" },
  { x: 19, y: 174, w: 28, h: 29, color: "#161c24" },
  { x: 50, y: 174, w: 29, h: 29, color: "#182029" },
  { x: 19, y: 210, w: 28, h: 30, color: "#1a222d" },
  { x: 50, y: 210, w: 29, h: 30, color: "#161c24" },
  { x: 19, y: 243, w: 28, h: 30, color: "#1a222d" },
  { x: 50, y: 243, w: 29, h: 30, color: "#171e27" },
  { x: 19, y: 280, w: 59, h: 30, color: "#1c2430" },
  { x: 19, y: 313, w: 59, h: 30, color: "#171e27" },
  { x: 86, y: -66, w: 29, h: 30, color: "#161c24" },
  { x: 118, y: -66, w: 29, h: 30, color: "#19212c" },
  { x: 86, y: -33, w: 29, h: 30, color: "#1d2531" },
  { x: 118, y: -33, w: 29, h: 30, color: "#1a222d" },
  { x: 86, y: 4, w: 60, h: 62, color: "#161c24" },
  { x: 86, y: 74, w: 60, h: 29, color: "#19212c" },
  { x: 86, y: 106, w: 60, h: 29, color: "#1c2430" },
  { x: 86, y: 142, w: 29, h: 29, color: "#1d2531" },
  { x: 118, y: 142, w: 29, h: 29, color: "#161c24" },
  { x: 86, y: 174, w: 29, h: 29, color: "#1a222d" },
  { x: 118, y: 174, w: 29, h: 29, color: "#19212c" },
  { x: 86, y: 210, w: 29, h: 30, color: "#1a222d" },
  { x: 118, y: 210, w: 29, h: 30, color: "#161c24" },
  { x: 86, y: 243, w: 29, h: 30, color: "#161c24" },
  { x: 118, y: 243, w: 29, h: 30, color: "#1a222d" },
  { x: 86, y: 280, w: 29, h: 30, color: "#182029" },
  { x: 118, y: 280, w: 29, h: 30, color: "#171e27" },
  { x: 86, y: 313, w: 29, h: 30, color: "#1d2531" },
  { x: 118, y: 313, w: 29, h: 30, color: "#1a222d" },
  { x: 154, y: -66, w: 29, h: 30, color: "#182029" },
  { x: 186, y: -66, w: 29, h: 30, color: "#19212c" },
  { x: 154, y: -33, w: 29, h: 30, color: "#19212c" },
  { x: 186, y: -33, w: 29, h: 30, color: "#182029" },
  { x: 154, y: 4, w: 29, h: 30, color: "#1c2430" },
  { x: 186, y: 4, w: 29, h: 30, color: "#182029" },
  { x: 154, y: 37, w: 29, h: 30, color: "#171e27" },
  { x: 186, y: 37, w: 29, h: 30, color: "#182029" },
  { x: 154, y: 74, w: 60, h: 60, color: "#171e27" },
  { x: 154, y: 142, w: 60, h: 29, color: "#161c24" },
  { x: 154, y: 174, w: 60, h: 29, color: "#1c2430" },
  { x: 154, y: 210, w: 60, h: 30, color: "#1c2430" },
  { x: 154, y: 243, w: 60, h: 30, color: "#171e27" },
  { x: 154, y: 280, w: 60, h: 30, color: "#1c2430" },
  { x: 154, y: 313, w: 60, h: 30, color: "#182029" },
  { x: 222, y: -66, w: 59, h: 62, color: "#182029" },
  { x: 222, y: 4, w: 59, h: 30, color: "#1a222d" },
  { x: 222, y: 37, w: 59, h: 30, color: "#1a222d" },
  { x: 222, y: 74, w: 28, h: 29, color: "#1d2531" },
  { x: 253, y: 74, w: 29, h: 29, color: "#1a222d" },
  { x: 222, y: 106, w: 28, h: 29, color: "#19212c" },
  { x: 253, y: 106, w: 29, h: 29, color: "#1c2430" },
  { x: 222, y: 142, w: 59, h: 29, color: "#1c2430" },
  { x: 222, y: 174, w: 59, h: 29, color: "#1a222d" },
  { x: 222, y: 210, w: 59, h: 62, color: "#19212c" },
  { x: 222, y: 280, w: 59, h: 30, color: "#1d2531" },
  { x: 222, y: 313, w: 59, h: 30, color: "#1c2430" },
  { x: 289, y: -66, w: 32, h: 30, color: "#1c2430" },
  { x: 324, y: -66, w: 33, h: 30, color: "#171e27" },
  { x: 289, y: -33, w: 32, h: 30, color: "#1c2430" },
  { x: 324, y: -33, w: 33, h: 30, color: "#171e27" },
  { x: 289, y: 4, w: 32, h: 30, color: "#171e27" },
  { x: 324, y: 4, w: 33, h: 30, color: "#1c2430" },
  { x: 289, y: 37, w: 32, h: 30, color: "#161c24" },
  { x: 324, y: 37, w: 33, h: 30, color: "#1a222d" },
  { x: 289, y: 74, w: 67, h: 60, color: "#1d2531" },
  { x: 289, y: 142, w: 67, h: 29, color: "#1c2430" },
  { x: 289, y: 174, w: 67, h: 29, color: "#1a222d" },
  { x: 289, y: 210, w: 67, h: 62, color: "#1d2531" },
  { x: 289, y: 280, w: 32, h: 30, color: "#161c24" },
  { x: 324, y: 280, w: 33, h: 30, color: "#19212c" },
  { x: 289, y: 313, w: 32, h: 30, color: "#161c24" },
  { x: 324, y: 313, w: 33, h: 30, color: "#1c2430" },
];

export default function LocationMapBackground() {
  return (
    <div className="map-bg" aria-hidden="true">
      {/* ─── Layer A: Street Map (Noida Sector 28 Street Grid) ────────────── */}
      <svg
        className="map-svg-base"
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="300" height="300" className="map-base-ground" />
        {/* Rotated to match the diagonal orientation of Kachnar Marg & Mall Road in Sector 28 */}
        <g transform="rotate(-38 150 138)">
          {noidaSector28Blocks.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={1.5}
              className={`map-block ${i < 4 ? "map-block-park" : "map-block-building"}`}
            />
          ))}
        </g>
      </svg>

      {/* ─── Layer B: Lighted Trails Converging on Blinking Location Point ─── */}
      <svg
        className="map-svg-streaks"
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <g transform="rotate(-38 150 138)">
          {/* Trail 1: North Mall Road -> converges onto Pin (150, 138) */}
          <path
            className="map-streak map-streak-1"
            d="M 150 -50 L 150 138"
            pathLength="100"
          />
          {/* Trail 2: South Mall Road -> converges onto Pin (150, 138) */}
          <path
            className="map-streak map-streak-2"
            d="M 150 330 L 150 138"
            pathLength="100"
          />
          {/* Trail 3: West Cross Lane -> converges onto Pin (150, 138) */}
          <path
            className="map-streak map-streak-3"
            d="M -40 138 L 150 138"
            pathLength="100"
          />
          {/* Trail 4: East Cross Lane (from Chameli Marg) -> converges onto Pin (150, 138) */}
          <path
            className="map-streak map-streak-4"
            d="M 340 138 L 150 138"
            pathLength="100"
          />
          {/* Trail 5: Kachnar Marg NW -> turns onto Mall Road -> collects at Pin */}
          <path
            className="map-streak map-streak-5"
            d="M -20 70 L 150 70 L 150 138"
            pathLength="100"
          />
          {/* Trail 6: Chameli Marg NE -> turns onto Cross Lane -> collects at Pin */}
          <path
            className="map-streak map-streak-6"
            d="M 218 -40 L 218 138 L 150 138"
            pathLength="100"
          />
          {/* Trail 7: West Lane SW -> turns onto Cross Lane -> collects at Pin */}
          <path
            className="map-streak map-streak-7"
            d="M 82 310 L 82 138 L 150 138"
            pathLength="100"
          />
          {/* Trail 8: Chameli Marg SE -> turns onto Cross Lane -> collects at Pin */}
          <path
            className="map-streak map-streak-8"
            d="M 218 310 L 218 138 L 150 138"
            pathLength="100"
          />
          {/* Central convergence node right at Pin (150, 138) where all trails collect */}
          <circle
            cx="150"
            cy="138"
            r="4.5"
            className="map-streak-collector"
          />
        </g>
      </svg>

      {/* ─── Layer C: Blinking Location Point + Converging Radar Pulse Ring ─ */}
      <div className="map-pin-pulse" />
      <div className="map-pin-dot" />

      {/* ─── Layer D: Readability Overlay ─────────────────────────────────── */}
      <div className="map-readability-overlay" />
    </div>
  );
}
