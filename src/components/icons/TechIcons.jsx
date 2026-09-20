/**
 * Tech stack brand icons — official colors, simple SVG paths.
 * Used in ProjectCard to visually represent the stack behind each project.
 */

export function AngularIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2L3.5 5.5l1.3 11.3L12 22l7.2-5.2 1.3-11.3L12 2Z"
        fill="#DD0031"
      />
      <path d="M12 2v20l7.2-5.2 1.3-11.3L12 2Z" fill="#C3002F" />
      <path
        d="M12 4.6 7.2 16h1.9l1-2.4h3.8l1 2.4h1.9L12 4.6Zm1.3 7.4h-2.6L12 8.4l1.3 3.6Z"
        fill="white"
      />
    </svg>
  );
}

export function TypeScriptIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178C6" />
      <path
        d="M15.2 16.8c.3.5.8.9 1.4 1.1.6.2 1.2.3 1.8.1.5-.1.9-.5 1-1 .1-.5 0-1-.4-1.3-.4-.3-.9-.5-1.4-.7-.6-.2-1.1-.4-1.5-.7-.4-.3-.7-.7-.8-1.2-.1-.6 0-1.2.4-1.7.5-.5 1.2-.8 2-.8.7 0 1.3.2 1.8.5.5.4.8.9 1 1.5l-1.3.5c-.1-.3-.3-.6-.6-.8-.3-.2-.7-.3-1-.2-.4 0-.7.1-.9.4-.2.3-.2.6 0 .9.2.3.5.4.9.6l1 .4c.8.3 1.3.6 1.7 1.1.3.5.4 1 .3 1.6-.1.7-.5 1.2-1.1 1.6-.6.3-1.3.5-2 .4-.8 0-1.5-.3-2.1-.7-.5-.5-.9-1-1.1-1.7l1.4-.5ZM6 10.2h2.4v8.2H10V10.2h2.4V9H6v1.2Z"
        fill="white"
      />
    </svg>
  );
}

export function ReactIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
      <g fill="none" stroke="#61DAFB" strokeWidth="1">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          transform="rotate(120 12 12)"
        />
      </g>
    </svg>
  );
}

export function ReduxIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M16.6 16.8c.8-.1 1.4-.8 1.4-1.6 0-.9-.7-1.6-1.6-1.6h-.1c-.9 0-1.6.8-1.5 1.7-.3.6-.8 1.1-1.5 1.4-1 .5-2 .5-2.8.2-.6-.3-1.1-.7-1.4-1.4-.3-1-.2-1.9.3-2.7.4-.6.9-1 1.2-1.2-.1-.3-.2-.8-.3-1.1-3.4 2.4-3 5.7-2 7 .8 1 2.3 1.6 3.9 1.6.5 0 .9 0 1.4-.2 1.5-.4 2.7-1.4 3-2.1Zm3.2-3.6c-1.7-2-4.2-3.1-7.1-3.1h-.4c-.2-.4-.6-.7-1.1-.7h-.1c-.9 0-1.6.8-1.5 1.7 0 .9.7 1.6 1.6 1.6h.1c.5 0 .9-.3 1.1-.7h.4c1.7 0 3.3.5 4.7 1.5 1 .7 1.8 1.7 2.1 2.8.3.9.2 1.8-.2 2.5-.7 1.1-1.8 1.7-3.2 1.7-.9 0-1.7-.3-2.1-.5-.3.3-.7.5-1.2.8 1 .5 2.1.8 3.1.8 2.3 0 4-1.3 4.6-2.5.7-1.4.7-3.8-1-5.9ZM7.6 16.6c0 .9.7 1.6 1.6 1.6h.1c.9 0 1.6-.8 1.5-1.7 0-.9-.7-1.6-1.6-1.6h-.1c-.1 0-.2 0-.3.1-.9-1.6-1.3-3.3-1.2-5.1.1-1.4.5-2.6 1.3-3.5.6-.8 1.8-1.2 2.6-1.2 2.2 0 3.2 2.7 3.3 3.9l1.1.3c-.3-3.6-2.7-5.3-4.5-5.3-1.7 0-3.2 1.2-3.9 3-.9 2.4-.3 4.7.6 6.5-.2.2-.4.5-.5 1Z"
        fill="#764ABC"
      />
    </svg>
  );
}
