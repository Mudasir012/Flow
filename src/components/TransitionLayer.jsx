import React from "react";
import { TRANSITIONS } from "../effects/transitionsLibrary.jsx";

export const TransitionLayer = ({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  zIndex,
}) => {
  if (!layer) return null;

  const transition = Object.values(TRANSITIONS).find(
    (t) => t.id === layer.properties.transitionId
  );

  if (!transition) return null;

  return (
    <div
      style={{
        padding: "8px",
        marginBottom: "4px",
        background: isSelected ? "#3f2a5f" : "#2a1a32",
        border: isSelected ? "2px solid #a75aff" : "1px solid #333",
        borderRadius: "4px",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => onSelect(layer.id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#fff" }}>
          🔄 {transition.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(layer.id);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#ff4757",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: "11px", color: "#aaa" }}>
        <div style={{ marginBottom: "3px" }}>
          <label>Duration: </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={layer.properties.duration || transition.duration}
            onChange={(e) => {
              onUpdate(layer.id, {
                properties: {
                  ...layer.properties,
                  duration: parseFloat(e.target.value),
                },
              });
            }}
            style={{ width: "60px", marginLeft: "4px" }}
          />
          <span style={{ marginLeft: "4px" }}>
            {(layer.properties.duration || transition.duration).toFixed(1)}s
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "#666",
          marginTop: "6px",
          borderTop: "1px solid #333",
          paddingTop: "4px",
        }}
      >
        {layer.timeRange.start.toFixed(2)}s - {layer.timeRange.end.toFixed(2)}s
      </div>
    </div>
  );
};
