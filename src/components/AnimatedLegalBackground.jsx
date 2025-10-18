// src/components/AnimatedLegalBackground.jsx
import React, { useEffect, useState } from "react";

/**
 * Full-bleed animated legal-themed background using your Canva embed.
 * - No extra deps (replaces lottie-react).
 * - Covers the entire parent via absolute positioning.
 * - Adds a soft white gradient overlay to keep foreground text readable.
 * - Respects prefers-reduced-motion (shows a subtle static gradient).
 *
 * Usage: place <AnimatedLegalBackground /> inside a relatively-positioned section/container.
 */
export default function AnimatedLegalBackground({ overlayOpacity = 0.75 }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const set = () => setReducedMotion(!!mq?.matches);
    set();
    mq?.addEventListener?.("change", set);
    return () => mq?.removeEventListener?.("change", set);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {!reducedMotion && (
        <div className="absolute inset-0">
          <iframe
            title="Canva Animated Background"
            loading="lazy"
            src="https://www.canva.com/design/DAG2IuF1hRg/vSVK1w0ME2EWGRKP7HCJrw/watch?embed"
            allow="fullscreen"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              margin: 0,
              padding: 0,
            }}
          />
        </div>
      )}

      {/* Reduced-motion fallback: soft gradient only */}
      {reducedMotion && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 800px at 10% 10%, #E8F1FF 0%, transparent 60%)," +
              "radial-gradient(1000px 700px at 90% 20%, #F1FBFF 0%, transparent 55%)," +
              "linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)",
          }}
        />
      )}

      {/* Readability overlay (keeps UI crisp over the animation) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,${overlayOpacity}) 0%, rgba(255,255,255,1) 60%)`,
        }}
      />
    </div>
  );
}