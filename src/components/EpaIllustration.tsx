"use client";

export default function EpaIllustration() {
  return (
    <svg
      width={56}
      height={72}
      viewBox="0 0 56 72"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      {/* Smartphone body */}
      <rect
        x="12" y="10" width="32" height="52" rx="8"
        fill="var(--c-surface-2)"
        stroke="var(--c-border)"
        strokeWidth="1.5"
      />

      {/* Screen */}
      <rect x="15" y="15" width="26" height="40" rx="5" fill="var(--c-cat-cardio-light)" />

      {/* Health cross — vertical bar */}
      <rect x="26" y="26" width="4" height="14" rx="1" fill="var(--c-cat-cardio)" />
      {/* Health cross — horizontal bar */}
      <rect x="22" y="30" width="12" height="4" rx="1" fill="var(--c-cat-cardio)" />

      {/* Top connector (cable/plug symbol) */}
      <rect x="24" y="6" width="8" height="4" rx="2" fill="var(--c-border-strong)" />

      {/* Small bidirectional arrows — digital connection symbol */}
      <g fill="var(--c-cat-lifestyle)">
        <path d="M44 36 L48 33 L48 35 L52 35 L52 37 L48 37 L48 39 Z" />
        <path d="M44 42 L40 39 L40 41 L36 41 L36 43 L40 43 L40 45 Z" />
      </g>
    </svg>
  );
}
