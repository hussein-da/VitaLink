"use client";

export default function AppleWatchIllustration() {
  return (
    <svg
      width={56}
      height={72}
      viewBox="0 0 60 80"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      {/* Wrist silhouette */}
      <rect x="10" y="4" width="40" height="72" rx="8" fill="var(--c-surface-2)" />

      {/* Band — top */}
      <rect x="24" y="4" width="12" height="22" rx="3" fill="var(--c-cat-lifestyle)" />

      {/* Watch case — dark Apple-product grey, light/dark via CSS var */}
      <rect
        x="16" y="26" width="28" height="32" rx="7"
        style={{ fill: "var(--c-watch-case)" }}
      />

      {/* Watch screen */}
      <rect x="19" y="29" width="22" height="26" rx="5" fill="#000000" />

      {/* Heart icon on screen (white, tiny) */}
      <g transform="translate(30, 42) scale(0.38)">
        <path
          d="M0 9 C0 9 -13 3 -13 -3.5 C-13 -7.5 -10 -10 -7 -10 C-4.5 -10 0 -6.5 0 -6.5 C0 -6.5 4.5 -10 7 -10 C10 -10 13 -7.5 13 -3.5 C13 3 0 9 0 9Z"
          fill="white"
        />
      </g>

      {/* Band — bottom */}
      <rect x="24" y="58" width="12" height="18" rx="3" fill="var(--c-cat-lifestyle)" />
    </svg>
  );
}
