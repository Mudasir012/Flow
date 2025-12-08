import React from "react";
import { styles } from "../styles/constants";

export const Clip = ({
  trackId,
  clip,
  isSelected,
  onSelect,
  duration = 60,
  zoomLevel = 1,
  currentTool = "select",
  currentTime = 0,
  onSplitClip = () => {},
  onRippleDelete = () => {},
}) => {
  const width = ((clip.end - clip.start) / Math.max(1, duration)) * 100 * zoomLevel;
  const left = (clip.start / Math.max(1, duration)) * 100 * zoomLevel;

  const handleClick = (e) => {
    e.stopPropagation();
    // Tool-based actions
    if (currentTool === "razor") {
      // split at current playhead/time
      onSplitClip(trackId, clip.id, currentTime);
      return;
    }

    if (currentTool === "ripple") {
      // basic ripple delete
      onRippleDelete(trackId, clip.id);
      return;
    }

    // default: select
    onSelect();
  };

  return (
    <div
      style={{
        ...styles.clip,
        ...(clip.type === "video" ? styles.clipVideo : styles.clipAudio),
        ...(isSelected ? styles.clipSelected : {}),
        width: `${width}%`,
        left: `${left}%`,
      }}
      onClick={handleClick}
      title={clip.name}
    >
      {clip.name}
    </div>
  );
};