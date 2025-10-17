// src/components/AnimatedLegalBackground.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Lottie from "lottie-react";

export default function AnimatedLegalBackground({ opacity = 0.12 }) {
  const [animData, setAnimData] = useState(null);

  useEffect(() => {
    // Optional Lottie file: /public/animations/legal.json
    fetch("/animations/legal.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setAnimData(json))
      .catch(() => setAnimData(null));
  }, []);

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {animData ? (
        <Lottie
          animationData={animData}
          loop
          autoplay
          style={{ width: "100%", height: "100%", opacity }}
        />
      ) : (
        <Box
          component="svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          sx={{
            width: "100%",
            height: "100%",
            opacity,
            "& .pulse": {
              animation: "pulse 6s ease-in-out infinite",
            },
            "& .flow": {
              strokeDasharray: "8 8",
              animation: "flow 18s linear infinite",
            },
            "@keyframes pulse": {
              "0%,100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" },
            },
            "@keyframes flow": {
              "0%": { strokeDashoffset: 0 },
              "100%": { strokeDashoffset: 1000 },
            },
          }}
        >
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <radialGradient id="glow" cx="70%" cy="30%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* digital glow */}
          <circle cx="900" cy="220" r="420" fill="url(#glow)" className="pulse" />

          {/* flowing lines */}
          <g fill="none" stroke="url(#g1)" strokeWidth="2">
            <path className="flow" d="M0 200 C 300 260, 600 140, 900 200 S 1200 260, 1440 200" />
            <path className="flow" d="M0 260 C 300 320, 600 200, 900 260 S 1200 320, 1440 260" />
            <path className="flow" d="M0 320 C 300 380, 600 260, 900 320 S 1200 380, 1440 320" />
          </g>

          {/* stylized scales of justice */}
          <g transform="translate(720 420) scale(2.1)" stroke="url(#g1)" strokeWidth="2" fill="none">
            <line x1="-80" y1="-60" x2="80" y2="-60" />
            <line x1="0" y1="-120" x2="0" y2="140" />
            <line x1="-80" y1="-60" x2="-110" y2="10" />
            <line x1="80" y1="-60" x2="110" y2="10" />
            <circle cx="-110" cy="10" r="30" />
            <circle cx="110" cy="10" r="30" />
            <path d="M-110 40 Q -110 55 -95 55 L -125 55 Q -110 55 -110 40 Z" />
            <path d="M110 40 Q 110 55 125 55 L 95 55 Q 110 55 110 40 Z" />
            <rect x="-20" y="140" width="40" height="14" />
          </g>
        </Box>
      )}
    </Box>
  );
}