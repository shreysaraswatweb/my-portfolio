import { useId } from 'react'

function safeId(value) {
  return value.replace(/:/g, '')
}

function DropShadow({ id }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.35" />
    </filter>
  )
}

export function FacebookMark({ className = 'h-space-8 w-space-8' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1.3 1.6-1.3H18V3h-2.4C12.8 3 11 4.7 11 7.2v1.3H9v2.6h2V21h3.5v-9.9h2.4l.6-2.6h-3Z" />
    </svg>
  )
}

export function Facebook3D({ className = 'h-icon-3d w-icon-3d' }) {
  const id = safeId(useId())
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <DropShadow id={id} />
      </defs>
      <g filter={`url(#${id})`}>
        <path
          fill="white"
          d="M36.2 22.4V18c0-2.2 1.4-3.8 4.2-3.8H46V8h-6.8C32.6 8 28 12.6 28 19.2v3.2h-5.2v7.2H28V56h9.2V29.6h6.4l1.6-7.2H37.2Z"
        />
      </g>
    </svg>
  )
}

export function GithubMark({ className = 'h-space-8 w-space-8' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.9 1.52 2.34 1.08 2.91.83.09-.66.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.32 1.9-1.3 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.71 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

export function Github3D({ className = 'h-icon-3d w-icon-3d' }) {
  const id = safeId(useId())
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
  )
}

export function FigmaMark({ className = 'h-space-8 w-space-8' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="9" cy="6.5" r="3.2" fill="#F24E1E" />
      <circle cx="15" cy="6.5" r="3.2" fill="#FF7262" />
      <circle cx="9" cy="12" r="3.2" fill="#A259FF" />
      <circle cx="15" cy="12" r="3.2" fill="#1ABCFE" />
      <circle cx="9" cy="17.5" r="3.2" fill="#0ACF83" />
    </svg>
  )
}

export function Figma3D({ className = 'h-icon-3d w-icon-3d' }) {
  const id = safeId(useId())
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
  )
}

export function InstagramMark({ className = 'h-space-8 w-space-8' }) {
  const id = safeId(useId())
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
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="white" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1.05" fill="white" />
    </svg>
  )
}

export function DevtoMark({ className = 'h-space-8 w-space-8' }) {
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
  )
}

export function Devto3D({ className = 'h-icon-3d w-icon-3d' }) {
  const id = safeId(useId())
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
  )
}

export function MailMark({ className = 'h-space-8 w-space-8' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="4" y="10" width="40" height="28" rx="6" fill="white" />
      <path d="M6 14 24 27 42 14" fill="none" stroke="#3B4A8A" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

export function Mail3D({ className = 'h-icon-3d w-icon-3d' }) {
  const id = safeId(useId())
  const paper = safeId(useId())
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
        <rect x="8" y="16" width="48" height="32" rx="7" fill={`url(#${paper})`} />
        <path d="M11 20.5 32 35 53 20.5" fill="none" stroke="#4C5E92" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M11 44.5 24 31" stroke="#4C5E92" strokeWidth="2" opacity="0.45" />
        <path d="M53 44.5 40 31" stroke="#4C5E92" strokeWidth="2" opacity="0.45" />
      </g>
    </svg>
  )
}
