import React, { useEffect, useRef } from "react";
import { FitIcon, FullScreenIcon } from "./icons/index.jsx";
import { formatTime } from "./hooks/useVideoPlayer.jsx";
import { applyEffectFilter } from "./effects/effectsLibrary.jsx";
import { styles } from "./styles/constants.jsx";


export const Preview = ({ currentTime, isPlaying, duration, media, mediaRef, effects = [], transitions = [], seekVersion = 0 }) => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const lastSeekRef = useRef(seekVersion);

  // draw fallback canvas only when there is no media to show
  useEffect(() => {
    if (media && media.src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const DPR = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || 800;
    const displayHeight = canvas.clientHeight || 450;
    canvas.width = Math.floor(displayWidth * DPR);
    canvas.height = Math.floor(displayHeight * DPR);
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const drawFrame = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width / DPR; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / DPR);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height / DPR; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / DPR, y);
        ctx.stroke();
      }

      const padding = 80;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(
        padding,
        padding,
        canvas.width / DPR - padding * 2,
        canvas.height / DPR - padding * 2
      );

      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo((canvas.width / DPR) / 2, 0);
      ctx.lineTo((canvas.width / DPR) / 2, canvas.height / DPR);
      ctx.moveTo(0, (canvas.height / DPR) / 2);
      ctx.lineTo(canvas.width / DPR, (canvas.height / DPR) / 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(10, 10, 120, 30);
      ctx.fillStyle = "#5a8fff";
      ctx.font = "bold 16px monospace";
      ctx.fillText(formatTime(currentTime), 20, 32);

      if (isPlaying) {
        ctx.fillStyle = "#ff4757";
        ctx.beginPath();
        ctx.arc((canvas.width / DPR) - 20, 20, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect((canvas.width / DPR) - 130, 10, 120, 30);
      ctx.fillStyle = "#888888";
      ctx.font = "12px monospace";
      ctx.fillText("1920x1080", (canvas.width / DPR) - 120, 32);
    };

    drawFrame();

    if (isPlaying) {
      const animate = () => {
        // redraw frame with the latest state
        try { drawFrame(); } catch (e) { /* drawing error - ignore */ }
        animationRef.current = requestAnimationFrame(animate);
      };
      // ensure we don't have a runaway animation
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, currentTime, media]);

  // Sync currentTime when it changes (only on explicit seek or large desync)
  useEffect(() => {
    const el = mediaRef?.current;
    if (!el) return;

    const actual = el.currentTime || 0;
    const diff = Math.abs(actual - currentTime);

    // If seekVersion changed, this was an explicit seek — apply it immediately
    if (seekVersion !== lastSeekRef.current) {
      console.log("Preview: applying explicit seek ->", currentTime, "(seekVersion)");
      try {
        el.currentTime = currentTime;
      } catch (e) {
        /* ignore */
      }
      lastSeekRef.current = seekVersion;
      return;
    }

    if (!isPlaying && diff > 0.5) {
      console.log("Preview: large desync while paused, syncing ->", currentTime, "(diff)", diff);
      try {
        el.currentTime = currentTime;
      } catch (e) {
      }
    }
  }, [seekVersion, currentTime, isPlaying]);

  const renderMediaElement = () => {
    if (!media || !media.src) return null;
    
    // Compute combined CSS filter from active effects
    let filterStyles = "";
    if (effects && effects.length > 0) {
      try {
        filterStyles = effects
          .map((effect) => {
            const filter = applyEffectFilter(effect.properties.effectId, effect.properties);
            return filter;
          })
          .filter((f) => f)
          .join(" ");
      } catch (e) {
        console.error("Error applying effects:", e);
      }
    }

    if ((media.type || "").startsWith("audio") || media.type === "audio") {
      return (
        <audio
          ref={mediaRef}
          src={media.src}
          style={{ width: "100%" }}
          preload="metadata"
        />
      );
    }

    return (
      <video
        ref={mediaRef}
        src={media.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
          filter: filterStyles || undefined,
        }}
        preload="metadata"
      />
    );
  };

  return (
    <div style={styles.previewContainer}>
      <div style={styles.previewHeader}>
        <div style={styles.toolbarSection}>
          <button style={styles.btnIcon} title="Fit to Screen">
            <FitIcon />
          </button>
          <button style={styles.btnIcon} title="Full Screen">
            <FullScreenIcon />
          </button>
        </div>
        <div style={{ fontSize: "12px", color: "#888888", fontWeight: "500" }}>
          Program Monitor
        </div>
        <select style={styles.select}>
          <option>Full Quality</option>
          <option>1/2 Quality</option>
          <option>1/4 Quality</option>
        </select>
        <div style={{ marginLeft: "12px", color: "#aaa", fontSize: "12px" }}>
          {media ? `${media.name} ${media.duration ? `· ${formatTime(media.duration)}` : ""}` : "No media loaded"}
        </div>
      </div>
      <div style={styles.previewContent}>
        {media && media.src ? (
          <div style={{ width: "100%", height: 360, position: "relative", background: "#000" }}>
            {renderMediaElement()}
            <div style={{ position: "absolute", left: 12, bottom: 12, color: "#bbb", fontSize: 12 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            style={styles.previewCanvas}
          />
        )}
      </div>
    </div>
  );
};