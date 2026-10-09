import { useId } from "react";

function safeId(value) {
  return value.replace(/:/g, "");
}

function DropShadow({ id }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow
        dx="0"
        dy="5"
        stdDeviation="3.5"
        floodColor="#000000"
        floodOpacity="0.35"
      />
    </filter>
  );
}

export function LinkedInMark({ className = "h-space-8 w-space-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function LinkedIn3D({ className = "h-icon-3d w-icon-3d" }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        <rect x="8" y="8" width="48" height="48" rx="10" fill="white" />
        <g transform="translate(8, 8) scale(2)">
          <path
            fill="#0A66C2"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
          />
        </g>
      </g>
    </svg>
  );
}

// Backward-compatible exports
export const FacebookMark = LinkedInMark;
export const Facebook3D = LinkedIn3D;

export function GithubMark({ className = "h-space-8 w-space-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.9 1.52 2.34 1.08 2.91.83.09-.66.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.32 1.9-1.3 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.71 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function Github3D({ className = "h-icon-3d w-icon-3d" }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        <circle cx="32" cy="32" r="22" fill="white" />
        <path
          fill="#111111"
          d="M32 18.2a13.8 13.8 0 0 0-4.36 26.9c.69.12.94-.3.94-.66v-2.35c-3.84.83-4.65-1.85-4.65-1.85-.62-1.6-1.52-2.03-1.52-2.03-1.24-.86.1-.83.1-.83 1.38.1 2.1 1.42 2.1 1.42 1.24 2.1 3.23 1.5 4.02 1.15.12-.91.48-1.5.87-1.84-3.07-.35-6.28-1.53-6.28-6.83 0-1.52.54-2.75 1.42-3.73-.14-.35-.62-1.75.14-3.64 0 0 1.16-.37 3.8 1.41A13.2 13.2 0 0 1 32 24.8c1.17 0 2.35.15 3.45.44 2.62-1.78 3.78-1.41 3.78-1.41.76 1.89.28 3.3.14 3.64.88.98 1.42 2.21 1.42 3.73 0 5.32-3.23 6.48-6.31 6.83.5.43.94 1.27.94 2.57v3.81c0 .36.25.8.95.66A13.8 13.8 0 0 0 32 18.2Z"
        />
      </g>
    </svg>
  );
}

export function XMark({ className = "h-space-8 w-space-8" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function X3D({ className = "h-icon-3d w-icon-3d" }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="11"
          fill="#000000"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
        />
        <g transform="translate(14, 14) scale(1.5)">
          <path
            fill="white"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </g>
      </g>
    </svg>
  );
}

export function FigmaMark({ className = "h-space-8 w-space-8" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="9" cy="6.5" r="3.2" fill="#F24E1E" />
      <circle cx="15" cy="6.5" r="3.2" fill="#FF7262" />
      <circle cx="9" cy="12" r="3.2" fill="#A259FF" />
      <circle cx="15" cy="12" r="3.2" fill="#1ABCFE" />
      <circle cx="9" cy="17.5" r="3.2" fill="#0ACF83" />
    </svg>
  );
}

export function Figma3D({ className = "h-icon-3d w-icon-3d" }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        <circle cx="24.5" cy="18" r="8.5" fill="#F24E1E" />
        <circle cx="39.5" cy="18" r="8.5" fill="#FF7262" />
        <circle cx="24.5" cy="32" r="8.5" fill="#A259FF" />
        <circle cx="39.5" cy="32" r="8.5" fill="#1ABCFE" />
        <circle cx="24.5" cy="46" r="8.5" fill="#0ACF83" />
      </g>
    </svg>
  );
}

export function InstagramMark({ className = "h-space-8 w-space-8" }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <radialGradient id={id} cx="30%" cy="110%" r="120%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="45%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </radialGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill={`url(#${id})`} />
      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="white"
        strokeWidth="1.7"
      />
      <circle cx="17.1" cy="6.9" r="1.05" fill="white" />
    </svg>
  );
}

export function DevtoMark({ className = "h-space-8 w-space-8" }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden>
      <rect width="48" height="24" rx="4" fill="#0A0A0A" />
      <text
        x="24"
        y="16.5"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
      >
        DEV
      </text>
    </svg>
  );
}

export function Devto3D({ className = "h-icon-3d w-icon-3d" }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 72 40" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        <rect x="4" y="6" width="64" height="28" rx="8" fill="#111111" />
        <text
          x="36"
          y="26"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
        >
          DEV
        </text>
      </g>
    </svg>
  );
}

export function MailMark({ className = "h-space-8 w-space-8" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="4" y="10" width="40" height="28" rx="6" fill="white" />
      <path
        d="M6 14 24 27 42 14"
        fill="none"
        stroke="#3B4A8A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mail3D({ className = "h-icon-3d w-icon-3d" }) {
  const id = safeId(useId());
  const paper = safeId(useId());
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
        <linearGradient id={paper} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D7E0F2" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id})`}>
        <rect
          x="8"
          y="16"
          width="48"
          height="32"
          rx="7"
          fill={`url(#${paper})`}
        />
        <path
          d="M11 20.5 32 35 53 20.5"
          fill="none"
          stroke="#4C5E92"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M11 44.5 24 31"
          stroke="#4C5E92"
          strokeWidth="2"
          opacity="0.45"
        />
        <path
          d="M53 44.5 40 31"
          stroke="#4C5E92"
          strokeWidth="2"
          opacity="0.45"
        />
      </g>
    </svg>
  );
}
