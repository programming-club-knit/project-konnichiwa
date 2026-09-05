"use client"

import React, { useEffect, useRef } from "react"

interface DitherTransitionProps {
  /** Color of the dither squares */
  color?: string
  /** Number of rows in the dither band */
  rows?: number
  /** Size of each square in px */
  squareSize?: number
  /** Gap between squares in px */
  gap?: number
  /** Height of the transition band */
  height?: number
  className?: string
}

/**
 * A halftone/dither dissolve band — sparse dots at the top,
 * increasingly dense toward the bottom, creating a Purdue-Hackers-style transition.
 */
export const DitherTransition: React.FC<DitherTransitionProps> = ({
  color = "#FF355E",
  rows = 20,
  squareSize = 6,
  gap = 4,
  height = 250,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth
    const h = height

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const step = squareSize + gap
    const cols = Math.ceil(w / step)
    const totalRows = Math.ceil(h / step)

    // Parse color to get rgba components
    const parseColor = (c: string) => {
      const tmp = document.createElement("canvas")
      tmp.width = tmp.height = 1
      const tmpCtx = tmp.getContext("2d")
      if (!tmpCtx) return { r: 255, g: 53, b: 94 }
      tmpCtx.fillStyle = c
      tmpCtx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(tmpCtx.getImageData(0, 0, 1, 1).data)
      return { r, g, b }
    }

    const { r, g, b } = parseColor(color)

    // Seed-based pseudo-random for deterministic pattern
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
      return x - Math.floor(x)
    }

    for (let row = 0; row < totalRows; row++) {
      // Probability increases from top (sparse) to bottom (dense)
      // Use a cubic curve for a more dramatic transition
      const t = row / totalRows
      const probability = t * t * t // Cubic ease-in: very sparse at top, very dense at bottom

      for (let col = 0; col < cols; col++) {
        const rand = seededRandom(row * 1000 + col)

        if (rand < probability) {
          // Vary opacity slightly for visual interest
          const opacity = 0.6 + rand * 0.4
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
          ctx.fillRect(
            col * step * dpr,
            row * step * dpr,
            squareSize * dpr,
            squareSize * dpr
          )
        }
      }
    }

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      const newW = container.clientWidth
      canvas.width = newW * dpr
      canvas.style.width = `${newW}px`
      // Re-draw on resize
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const newCols = Math.ceil(newW / step)
      for (let row = 0; row < totalRows; row++) {
        const t = row / totalRows
        const probability = t * t * t
        for (let col = 0; col < newCols; col++) {
          const rand = seededRandom(row * 1000 + col)
          if (rand < probability) {
            const opacity = 0.6 + rand * 0.4
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
            ctx.fillRect(
              col * step * dpr,
              row * step * dpr,
              squareSize * dpr,
              squareSize * dpr
            )
          }
        }
      }
    })
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [color, rows, squareSize, gap, height])

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`} style={{ height }}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  )
}
