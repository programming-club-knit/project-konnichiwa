"use client"

import React from "react"
import Image from "next/image"

interface PolaroidPhoto {
  src: string
  alt: string
  /** CSS rotation in degrees */
  rotate: number
  /** Position from left as percentage */
  left: string
  /** Position from top as percentage */
  top: string
  /** Width in px */
  width: number
}

interface ScatteredPolaroidsProps {
  photos?: PolaroidPhoto[]
  className?: string
}

const defaultPhotos: PolaroidPhoto[] = [
  {
    src: "/images/polaroid-1.jpg",
    alt: "Hackathon",
    rotate: -6,
    left: "4%",
    top: "10%",
    width: 220,
  },
  {
    src: "/images/polaroid-2.jpg",
    alt: "Club Meeting",
    rotate: 3,
    left: "28%",
    top: "25%",
    width: 210,
  },
  {
    src: "/images/polaroid-3.jpg",
    alt: "Cyber Workspace",
    rotate: -4,
    left: "52%",
    top: "5%",
    width: 230,
  },
  {
    src: "/images/polaroid-4.jpg",
    alt: "Awards Ceremony",
    rotate: 5,
    left: "74%",
    top: "18%",
    width: 210,
  },
]

export const ScatteredPolaroids: React.FC<ScatteredPolaroidsProps> = ({
  photos = defaultPhotos,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`} style={{ height: "420px" }}>
      {photos.map((photo, i) => (
        <div
          key={i}
          className="group absolute transition-transform duration-500 ease-out hover:scale-105 hover:z-20"
          style={{
            left: photo.left,
            top: photo.top,
            transform: `rotate(${photo.rotate}deg)`,
            zIndex: 10 + i,
          }}
        >
          {/* Polaroid frame */}
          <div
            className="relative bg-white p-2 pb-10 shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_20px_60px_rgba(255,53,94,0.3)]"
            style={{ width: photo.width }}
          >
            {/* Photo */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                sizes={`${photo.width}px`}
              />
            </div>
            {/* Caption area - like a real polaroid */}
            <p className="mt-2 text-center font-mono text-xs tracking-wider text-neutral-400">
              {photo.alt}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
