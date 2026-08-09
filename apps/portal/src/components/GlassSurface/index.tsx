import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import styles from './index.module.scss'

type Channel = 'R' | 'G' | 'B'

type GlassStyle = CSSProperties & {
  '--glass-frost': number
  '--glass-saturation': number
  '--glass-filter': string
}

export interface GlassSurfaceProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style'
> {
  children?: ReactNode
  className?: string
  contentClassName?: string
  style?: CSSProperties
  borderRadius?: number
  borderWidth?: number
  brightness?: number
  opacity?: number
  blur?: number
  displace?: number
  backgroundOpacity?: number
  saturation?: number
  distortionScale?: number
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  xChannel?: Channel
  yChannel?: Channel
  mixBlendMode?: CSSProperties['mixBlendMode']
}

function supportsSvgBackdropFilter(filterId: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false

  const userAgent = window.navigator.userAgent
  const isSafari = /Safari/.test(userAgent) && !/(Chrome|Chromium|CriOS)/.test(userAgent)
  const isFirefox = /Firefox/.test(userAgent)

  if (isSafari || isFirefox) return false

  const probe = document.createElement('div')
  probe.style.backdropFilter = `url(#${filterId})`
  return probe.style.backdropFilter !== ''
}

export function GlassSurface({
  children,
  className = '',
  contentClassName = '',
  style,
  borderRadius = 26,
  borderWidth = 0.055,
  brightness = 68,
  opacity = 0.9,
  blur = 8,
  displace = 0.45,
  backgroundOpacity = 0.08,
  saturation = 1.55,
  distortionScale = -82,
  redOffset = 0,
  greenOffset = 3,
  blueOffset = 6,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  ...props
}: GlassSurfaceProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const filterId = `atlas-glass-${reactId}`
  const redGradientId = `atlas-glass-red-${reactId}`
  const blueGradientId = `atlas-glass-blue-${reactId}`
  const [svgSupported, setSvgSupported] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<SVGFEImageElement>(null)

  const updateDisplacementMap = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect?.width ?? 400))
    const height = Math.max(1, Math.round(rect?.height ?? 200))
    const edgeSize = Math.min(width, height) * borderWidth * 0.5
    const innerWidth = Math.max(1, width - edgeSize * 2)
    const innerHeight = Math.max(1, height - edgeSize * 2)

    const displacementMap = `
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradientId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000" />
            <stop offset="100%" stop-color="red" />
          </linearGradient>
          <linearGradient id="${blueGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000" />
            <stop offset="100%" stop-color="blue" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="black" />
        <rect width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${redGradientId})" />
        <rect width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${blueGradientId})" style="mix-blend-mode:${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${innerWidth}" height="${innerHeight}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `

    imageRef.current?.setAttribute(
      'href',
      `data:image/svg+xml,${encodeURIComponent(displacementMap)}`
    )
  }, [
    blueGradientId,
    blur,
    borderRadius,
    borderWidth,
    brightness,
    mixBlendMode,
    opacity,
    redGradientId,
  ])

  useEffect(() => {
    setSvgSupported(supportsSvgBackdropFilter(filterId))
  }, [filterId])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrame = window.requestAnimationFrame(updateDisplacementMap)
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateDisplacementMap)
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [updateDisplacementMap])

  const containerStyle: GlassStyle = {
    ...style,
    borderRadius,
    '--glass-frost': backgroundOpacity,
    '--glass-saturation': saturation,
    '--glass-filter': `url(#${filterId})`,
  }

  return (
    <div
      {...props}
      ref={containerRef}
      className={`${styles.surface} ${svgSupported ? styles.svg : styles.fallback} ${className}`}
      style={containerStyle}
    >
      <svg className={styles.filter} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={imageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + redOffset}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
              result="displaced-red"
            />
            <feColorMatrix
              in="displaced-red"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + greenOffset}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
              result="displaced-green"
            />
            <feColorMatrix
              in="displaced-green"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={distortionScale + blueOffset}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
              result="displaced-blue"
            />
            <feColorMatrix
              in="displaced-blue"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="red-green" />
            <feBlend in="red-green" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation={displace} />
          </filter>
        </defs>
      </svg>

      <div className={`${styles.content} ${contentClassName}`}>{children}</div>
    </div>
  )
}
