import React from "react";
import {
  SelectIcon,
  RazorIcon,
  TextIcon,
  StopIcon,
  ExportIcon,
  DeleteIcon,
} from "./icons/index.jsx";
import { styles } from "./styles/constants.jsx";

export const Toolbar = ({
  activeTool = "select",
  onChangeActiveTool = () => {},
  isPlaying = false,
  onTask = () => {},
  selectedClip = null,
  selectedTextLayer = null,
  selectedEffect = null,
}) => {
  const tools = [
    { icon: <SelectIcon />, name: "Select", key: "select" },
    { icon: <RazorIcon />, name: "Razor", key: "razor" },
    { icon: <TextIcon />, name: "Add Text", key: "text" },
  ];

  return (
    <div style={styles.toolbar}>
      <div style={styles.toolbarSection}>
        {tools.map((tool) => (
          <button
            key={tool.key}
            style={{
              ...styles.toolBtn,
              ...(activeTool === tool.key ? styles.toolBtnActive : {}),
            }}
            title={tool.name}
            onClick={() => onChangeActiveTool(tool.key)}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div style={styles.toolbarSection}>
        <button
          style={{
            ...styles.toolBtn,
            ...(selectedClip ? {} : { opacity: 0.4, cursor: "not-allowed" }),
          }}
          title={selectedClip ? "Split at Playhead" : "Select a clip"}
          onClick={() => selectedClip && onTask({ type: "splitAtPlayhead" })}
          disabled={!selectedClip}
        >
          <RazorIcon />
        </button>

        <button
          style={{
            ...styles.toolBtn,
            ...(selectedClip ? {} : { opacity: 0.4, cursor: "not-allowed" }),
          }}
          title={selectedClip ? "Delete Clip" : "Select a clip"}
          onClick={() => selectedClip && onTask({ type: "rippleDeleteSelected" })}
          disabled={!selectedClip}
        >
          <DeleteIcon />
        </button>
      </div>

      <div style={styles.toolbarSection}>
        <button
          style={{
            ...styles.toolBtn,
            ...(selectedTextLayer ? {} : { opacity: 0.4, cursor: "not-allowed" }),
          }}
          title={selectedTextLayer ? "Delete Text Layer" : "Select text layer"}
          onClick={() => selectedTextLayer && onTask({ type: "deleteTextLayer" })}
          disabled={!selectedTextLayer}
        >
          ✕
        </button>

        <button
          style={{
            ...styles.toolBtn,
            ...(selectedEffect ? {} : { opacity: 0.4, cursor: "not-allowed" }),
          }}
          title={selectedEffect ? "Remove Effect" : "Select effect"}
          onClick={() => selectedEffect && onTask({ type: "removeEffect" })}
          disabled={!selectedEffect}
        >
          🗑
        </button>
      </div>
    </div>
  );
};
