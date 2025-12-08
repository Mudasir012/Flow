import React, { useState, useRef, useEffect } from "react";
import { Track } from "./Track";
import { ZoomInIcon, ZoomOutIcon, PlusIcon } from "../icons/index.jsx";
import { formatTime } from "../hooks/useVideoPlayer";
import { styles } from "../styles/constants";

export const Timeline = ({ 
  currentTime, 
  seek, 
  duration, 
  tracks, 
  selectedClip, 
  setSelectedClip,
  zoomLevel,
  setZoomLevel,
  currentTool,
  onSplitClip,
  onRippleDelete,
  setTracks,
  layers = [],
  textLayers = [],
  selectedLayerId,
  setSelectedLayerId,
  selectedTextLayer,
  setSelectedTextLayer,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef();

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - 140;
    const usableWidth = Math.max(1, rect.width - 140);
    const newTime = (clickX / usableWidth) * duration;
    if (newTime >= 0) seek(Math.max(0, Math.min(duration, newTime)));
  };

  const handlePlayheadDrag = (e) => {
    if (e.type === "mousedown") {
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left - 140;
        const usableWidth = Math.max(1, rect.width - 140);
        const newTime = Math.max(
          0,
          Math.min(duration, (clickX / usableWidth) * duration)
        );
        seek(newTime);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration, seek]);

  return (
    <div style={styles.timelineContainer}>
      <div style={styles.timelineHeader}>
        <div style={styles.toolbarSection}>
          <button
            style={styles.btnIcon}
            onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))}
            title="Zoom In"
          >
            <ZoomInIcon />
          </button>

          <button
            style={styles.btnIcon}
            onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))}
            title="Zoom Out"
          >
            <ZoomOutIcon />
          </button>

          <div
            style={{
              width: "1px",
              height: "20px",
              backgroundColor: "#1a1a1a",
              margin: "0 4px",
            }}
          />

          <button
            style={styles.btnIcon}
            onClick={() =>
              // This should be handled by parent component
              console.log("Add track functionality")
            }
            title="Add Track"
          >
            <PlusIcon />
          </button>
        </div>

        <div
          style={{
            color: "#888888",
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div
        style={styles.timeline}
        ref={timelineRef}
        onClick={handleTimelineClick}
      >
        <div style={styles.tracksContainer}>
          {tracks.map((track, index) => (
            <Track
              key={track.id}
              trackId={track.id}
              track={track}
              trackIndex={index}
              selectedClip={selectedClip}
              onSelectClip={setSelectedClip}
              duration={duration}
              zoomLevel={zoomLevel}
              currentTool={currentTool}
              currentTime={currentTime}
              onSplitClip={onSplitClip}
              onRippleDelete={onRippleDelete}
            />
          ))}

          {/* Universal Layer Timeline */}
          {layers.length > 0 && (
            <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "8px" }}>
              <div style={{ paddingLeft: "8px", fontSize: "11px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
                EFFECTS & TRANSITIONS
              </div>
              {layers.map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                const pixelsPerSecond = 100 * zoomLevel;
                const startPx = (layer.timeRange.start / duration) * pixelsPerSecond * duration;
                const width = ((layer.timeRange.end - layer.timeRange.start) / duration) * pixelsPerSecond * duration;
                const typeColor = layer.type === "effect" ? "#ffa502" : layer.type === "transition" ? "#6c5ce7" : "#00b894";
                const typeIcon = layer.type === "effect" ? "✨" : layer.type === "transition" ? "🔄" : "📝";

                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    style={{
                      position: "relative",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "8px",
                      borderBottom: "1px solid #1a1a1a",
                      backgroundColor: isSelected ? "#1a3a52" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = isSelected ? "#1a3a52" : "#0f1a22"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = isSelected ? "#1a3a52" : "transparent"}
                  >
                    <span style={{ marginRight: "8px", fontSize: "14px" }}>{typeIcon}</span>
                    <span style={{ fontSize: "12px", color: "#aaa", flex: 1 }}>{layer.name}</span>
                    <div
                      style={{
                        position: "absolute",
                        left: `calc(140px + ${startPx}px)`,
                        width: `${Math.max(40, width)}px`,
                        height: "20px",
                        backgroundColor: typeColor,
                        opacity: 0.7,
                        borderRadius: "2px",
                        border: isSelected ? `2px solid ${typeColor}` : "1px solid rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "4px",
                        fontSize: "10px",
                        color: "#fff",
                        fontWeight: "500",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {layer.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Layers Timeline */}
          {textLayers.length > 0 && (
            <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "8px" }}>
              <div style={{ paddingLeft: "8px", fontSize: "11px", color: "#888", fontWeight: "600", marginBottom: "4px" }}>
                TEXT LAYERS
              </div>
              {textLayers.map((layer) => {
                const isSelected = selectedTextLayer === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedTextLayer(layer.id)}
                    style={{
                      position: "relative",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "8px",
                      borderBottom: "1px solid #1a1a1a",
                      backgroundColor: isSelected ? "#1a3a52" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = isSelected ? "#1a3a52" : "#0f1a22"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = isSelected ? "#1a3a52" : "transparent"}
                  >
                    <span style={{ marginRight: "8px", fontSize: "14px" }}>📝</span>
                    <span style={{ fontSize: "12px", color: "#aaa" }}>"{layer.text}"</span>
                    <span style={{ marginLeft: "8px", fontSize: "10px", color: "#666" }}>
                      x:{layer.x} y:{layer.y}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            ...styles.playhead,
            left: `calc(140px + ${(currentTime / Math.max(1, duration)) * 100}%)`,
          }}
          onMouseDown={handlePlayheadDrag}
        >
          <div style={styles.playheadHandle} />
        </div>

        <div style={styles.timelineRuler}>
          {Array.from({ length: Math.ceil(duration * zoomLevel) + 1 }).map(
            (_, index) => {
              const time = index / zoomLevel;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    position: "relative",
                    borderRight: "1px solid #1a1a1a",
                    minWidth: "50px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "6px",
                      fontSize: "10px",
                      color: "#888888",
                      fontFamily: "monospace",
                      fontWeight: "600",
                    }}
                  >
                    {formatTime(time)}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};