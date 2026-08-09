import { useCallback, useEffect, useRef } from 'react'
import styles from './index.module.scss'

interface Dot {
  x: number
  y: number
}

const SPACING = 28
const RADIUS = 1.45
const PROXIMITY = 150
const MAX_SHIFT = 4.5
const BASE_COLOR = { r: 99, g: 145, b: 199, a: 0.3 }
const ACTIVE_COLOR = { r: 22, g: 119, b: 255, a: 0.68 }

export function DotGridBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const frameRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const context = canvas.getContext('2d')
    if (!context) return

    const { width, height } = root.getBoundingClientRect()
    context.clearRect(0, 0, width, height)

    const pointer = pointerRef.current

    for (const dot of dotsRef.current) {
      let influence = 0
      let offsetX = 0
      let offsetY = 0

      if (pointer.active) {
        const deltaX = dot.x - pointer.x
        const deltaY = dot.y - pointer.y
        const distance = Math.hypot(deltaX, deltaY)

        if (distance < PROXIMITY) {
          influence = 1 - distance / PROXIMITY
          const shift = influence * influence * MAX_SHIFT
          const safeDistance = Math.max(distance, 1)
          offsetX = (deltaX / safeDistance) * shift
          offsetY = (deltaY / safeDistance) * shift
        }
      }

      const red = Math.round(BASE_COLOR.r + (ACTIVE_COLOR.r - BASE_COLOR.r) * influence)
      const green = Math.round(BASE_COLOR.g + (ACTIVE_COLOR.g - BASE_COLOR.g) * influence)
      const blue = Math.round(BASE_COLOR.b + (ACTIVE_COLOR.b - BASE_COLOR.b) * influence)
      const alpha = BASE_COLOR.a + (ACTIVE_COLOR.a - BASE_COLOR.a) * influence

      context.beginPath()
      context.arc(dot.x + offsetX, dot.y + offsetY, RADIUS + influence * 0.45, 0, Math.PI * 2)
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`
      context.fill()
    }
  }, [])

  const scheduleDraw = useCallback(() => {
    if (frameRef.current) return

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      draw()
    })
  }, [draw])

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return

    const { width, height } = root.getBoundingClientRect()
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.getContext('2d')?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    const columns = Math.ceil(width / SPACING) + 1
    const rows = Math.ceil(height / SPACING) + 1
    const offsetX = (width - (columns - 1) * SPACING) / 2
    const offsetY = (height - (rows - 1) * SPACING) / 2
    const dots: Dot[] = []

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        dots.push({
          x: offsetX + column * SPACING,
          y: offsetY + row * SPACING,
        })
      }
    }

    dotsRef.current = dots
    scheduleDraw()
  }, [scheduleDraw])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const resizeObserver = new ResizeObserver(buildGrid)
    resizeObserver.observe(root)
    buildGrid()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      const rect = root.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      }
      scheduleDraw()
    }

    const resetPointer = () => {
      pointerRef.current.active = false
      scheduleDraw()
    }

    if (!reducedMotion) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('blur', resetPointer)
      document.documentElement.addEventListener('mouseleave', resetPointer)
    }

    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', resetPointer)
      document.documentElement.removeEventListener('mouseleave', resetPointer)
    }
  }, [buildGrid, scheduleDraw])

  return (
    <div ref={rootRef} className={styles.background} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
