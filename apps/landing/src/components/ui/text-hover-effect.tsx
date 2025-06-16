"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

interface TextHoverEffectProps {
  text: string;
  duration?: number;
  automatic?: boolean;
}

export function TextHoverEffect({
  text,
  duration = 0.1,
}: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  // Update mask center based on cursor
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = ((cursor.x - rect.left) / rect.width) * 100;
    const cy = ((cursor.y - rect.top) / rect.height) * 100;
    setMaskPosition({ cx: `${cx}%`, cy: `${cy}%` });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        {/* Gradient for fill color */}
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#0B3D91" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        {/* Radial gradient mask controls reveal */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          initial={{ r: "0%", cx: maskPosition.cx, cy: maskPosition.cy }}
          animate={{
            r: hovered ? "25%" : "0%",
            cx: maskPosition.cx,
            cy: maskPosition.cy,
          }}
          transition={{
            duration,
            ease: "easeOut",
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        {/* Mask uses radial gradient */}
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Stroke-outline animation */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-foreground font-black-han-sans text-6xl lg:text-7xl font-bold"
      >
        {text}
      </motion.text>

      {/* Fill fade-in animation */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-black-han-sans text-6xl lg:text-7xl font-bold"
        fill="url(#textGradient)"
        mask="url(#textMask)"
        initial={{ fillOpacity: 0 }}
        animate={{ fillOpacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
    </svg>
  );
}
