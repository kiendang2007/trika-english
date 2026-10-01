// The only icons in the product: check circle, cross circle, outline lock. Each means one specific thing.

export function CheckCircle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="9" cy="9" r="8" fill="#2E9E57" />
      <path
        d="M5.2 9.3l2.4 2.4 5-5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CrossCircle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="9" cy="9" r="8" fill="#E0836B" />
      <path
        d="M6.2 6.2l5.6 5.6M11.8 6.2l-5.6 5.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Outline lock used by the top bar, its menu and the locked subject page. Drawn with
// currentColor so each place sets its own grey.
export function LockOutline({ size = 16, width = 1.6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="10" height="7" rx="2" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}
