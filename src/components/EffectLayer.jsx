import React from "react";
import { EFFECTS } from "../effects/effectsLibrary.jsx";

export const EffectLayer = ({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  zIndex,
}) => {
  if (!layer) return null;

  const effect = Object.values(EFFECTS).find((e) => e.id === layer.properties.effectId);

  if (!effect) return null;

  return (
    <div
      style={{
        padding: "8px",
        marginBottom: "4px",
        background: isSelected ? "#2a3f5f" : "#1a2332",
        border: isSelected ? "2px solid #5a8fff" : "1px solid #333",
        borderRadius: "4px",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => onSelect(layer.id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#fff" }}>
          {effect.name}
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

      {/* Effect parameters */}
      {effect.params && effect.params.length > 0 && (
        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
          {effect.params.map((param) => (
            <div
              key={param.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
                padding: "2px 4px",
              }}
            >
              <label style={{ flex: 1 }}>{param.label}:</label>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.min > 10 ? 1 : 0.1}
                value={layer.properties[param.name] || param.default}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  onUpdate(layer.id, {
                    properties: {
                      ...layer.properties,
                      [param.name]: newValue,
                    },
                  });
                }}
                style={{ width: "60px", marginLeft: "4px" }}
              />
              <span style={{ width: "30px", textAlign: "right", marginLeft: "4px" }}>
                {layer.properties[param.name] || param.default}
                {param.unit}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Time range */}
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
