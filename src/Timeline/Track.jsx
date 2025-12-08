import React from "react";
import { Clip } from "./Clip";
import { EyeIcon, VolumeIcon, LockIcon } from "../icons/index.jsx";
import { styles } from "../styles/constants";

export const Track = ({ trackId, track, selectedClip, onSelectClip, duration = 60, zoomLevel = 1, currentTool, currentTime, onSplitClip, onRippleDelete }) => {
  return (
    <div style={styles.track}>
      <div style={styles.trackHeader}>
        <span style={{ fontWeight: "500" }}>{track.name}</span>
        <div style={styles.trackControls}>
          <button style={{ ...styles.toolBtn, width: "24px", height: "24px" }}>
            <EyeIcon />
          </button>
          <button style={{ ...styles.toolBtn, width: "24px", height: "24px" }}>
            <VolumeIcon />
          </button>
          <button style={{ ...styles.toolBtn, width: "24px", height: "24px" }}>
            <LockIcon />
          </button>
        </div>
      </div>
      <div style={styles.trackContent}>
        {track.clips.map((clip) => (
          <Clip
            key={clip.id}
            trackId={trackId}
            clip={clip}
            isSelected={selectedClip === clip.id}
            onSelect={() => onSelectClip(clip.id)}
            duration={duration}
            zoomLevel={zoomLevel}
            currentTool={currentTool}
            currentTime={currentTime}
            onSplitClip={onSplitClip}
            onRippleDelete={onRippleDelete}
          />
        ))}
      </div>
    </div>
  );
};