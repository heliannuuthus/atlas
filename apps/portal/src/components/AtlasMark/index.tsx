interface AtlasMarkProps {
  size?: number
  className?: string
}

export function AtlasMark({ size = 32, className }: AtlasMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="12" fill="#2557d6" />
      <path d="M12 12h7v7h-7z" fill="white" />
      <path d="M21 12h7v7h-7z" fill="white" opacity=".48" />
      <path d="M12 21h7v7h-7z" fill="white" opacity=".48" />
      <path d="M21 21h7v7h-7z" fill="#9fc1ff" />
    </svg>
  )
}
