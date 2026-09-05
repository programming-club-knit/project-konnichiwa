"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
  /** Enable mouse-reactive spotlight effect */
  mouseInteraction?: boolean
  /** Radius (in px) of the mouse spotlight area */
  mouseRadius?: number
  /** Max opacity for squares at the mouse center */
  mouseMaxOpacity?: number
  /** Enable a halftone dither dissolve at the bottom */
  ditherBottom?: boolean
  /** Height in px of the dither zone from the bottom */
  ditherHeight?: number
  /** Max opacity at the very bottom of the dither */
  ditherMaxOpacity?: number
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  mouseInteraction = false,
  mouseRadius = 150,
  mouseMaxOpacity = 0.6,
  ditherBottom = false,
  ditherHeight = 280,
  ditherMaxOpacity = 0.85,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  // Mutable ref to avoid re-renders on every mousemove
  const mousePos = useRef<{ x: number; y: number } | null>(null)

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string) => {
      if (typeof window === "undefined") {
        return `rgba(0, 0, 0,`
      }
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext("2d")
      if (!ctx) return "rgba(255, 0, 0,"
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
      return `rgba(${r}, ${g}, ${b},`
    }
    return toRGBA(color)
  }, [color])

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const cols = Math.ceil(width / (squareSize + gridGap))
      const rows = Math.ceil(height / (squareSize + gridGap))

      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity]
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity]
  )


  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext("2d") ?? null
    let animationFrameId: number | null = null
    let resizeObserver: ResizeObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
    let gridParams: ReturnType<typeof setupCanvas> | null = null

    // Mouse tracking handler — defined here so it shares the same lifecycle
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mousePos.current = { x, y }
      } else {
        mousePos.current = null
      }
    }
    const handleMouseLeave = () => {
      mousePos.current = null
    }

    if (canvas && container && ctx) {
      // Set up mouse tracking at window level so overlaid elements don't block it
      if (mouseInteraction) {
        window.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseleave", handleMouseLeave)
      }

      const updateCanvasSize = () => {
        const newWidth = width || container.clientWidth
        const newHeight = height || container.clientHeight
        setCanvasSize({ width: newWidth, height: newHeight })
        gridParams = setupCanvas(canvas, newWidth, newHeight)
      }

      updateCanvasSize()

      let lastTime = 0
      const animate = (time: number) => {
        if (!isInView || !gridParams) return

        const deltaTime = (time - lastTime) / 1000
        lastTime = time

        updateSquares(gridParams.squares, deltaTime)

        // Read mouse position directly from ref (always fresh)
        const currentMouse = mouseInteraction ? mousePos.current : null

        // Inline draw with mouse spotlight + bottom dither
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const step = squareSize + gridGap
        const dpr = gridParams.dpr
        const canvasH = canvasSize.height

        // Seeded random for deterministic dither pattern
        const seededRand = (seed: number) => {
          const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453
          return x - Math.floor(x)
        }

        for (let i = 0; i < gridParams.cols; i++) {
          for (let j = 0; j < gridParams.rows; j++) {
            let opacity = gridParams.squares[i * gridParams.rows + j]

            // Bottom dither: boost opacity for squares near the bottom
            if (ditherBottom) {
              const sqY = j * step
              const distFromBottom = canvasH - sqY
              if (distFromBottom <= ditherHeight) {
                const t = 1 - distFromBottom / ditherHeight // 0 at top of zone → 1 at bottom
                const probability = t * t * t // Cubic ease-in
                const seed = j * 1000 + i
                const rand = seededRand(seed)
                if (rand < probability) {
                  const boosted = ditherMaxOpacity * (0.6 + rand * 0.4)
                  opacity = Math.max(opacity, boosted)
                }
              }
            }

            // Mouse spotlight
            if (currentMouse) {
              const sqCenterX = i * step + squareSize / 2
              const sqCenterY = j * step + squareSize / 2
              const dx = sqCenterX - currentMouse.x
              const dy = sqCenterY - currentMouse.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist < mouseRadius) {
                const t = 1 - dist / mouseRadius
                const boosted = mouseMaxOpacity * t * t
                opacity = Math.max(opacity, boosted)
              }
            }

            ctx.fillStyle = `${memoizedColor}${opacity})`
            ctx.fillRect(
              i * step * dpr,
              j * step * dpr,
              squareSize * dpr,
              squareSize * dpr
            )
          }
        }

        animationFrameId = requestAnimationFrame(animate)
      }

      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize()
      })
      resizeObserver.observe(container)

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting)
        },
        { threshold: 0 }
      )
      intersectionObserver.observe(canvas)

      if (isInView) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [setupCanvas, updateSquares, width, height, isInView, mouseInteraction, mouseRadius, mouseMaxOpacity, memoizedColor, squareSize, gridGap, ditherBottom, ditherHeight, ditherMaxOpacity, canvasSize.height])

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  )
}
