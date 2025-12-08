import React from "react";
import { EffectLayer } from "./EffectLayer.jsx";
import { TransitionLayer } from "./TransitionLayer.jsx";

export const LayerPanel = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
}) => {
  if (!layers || layers.length === 0) {
    return (
      <div
        style={{
          padding: "12px",
          textAlign: "center",
          color: "#666",
          fontSize: "12px",
        }}
      >
        No layers added yet
      </div>
    );
  }

  const getLayerIcon = (type) => {
    const icons = {
      video: "🎬",
      audio: "🔊",
      text: "📝",
      effect: "✨",
      transition: "🔄",
    };
    return icons[type] || "📦";
  };

  // Sort by zIndex descending (top layer first)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div
      style={{
        padding: "8px",
        maxHeight: "400px",
        overflowY: "auto",
        backgroundColor: "#0a0a0a",
        borderRadius: "4px",
      }}
    >
      {sortedLayers.map((layer, idx) => (
        <div key={layer.id} style={{ marginBottom: "4px" }}>
          {layer.type === "effect" && (
            <EffectLayer
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={onSelectLayer}
              onUpdate={onUpdateLayer}
              onDelete={onDeleteLayer}
              zIndex={layer.zIndex}
            />
          )}
          {layer.type === "transition" && (
            <TransitionLayer
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={onSelectLayer}
              onUpdate={onUpdateLayer}
              onDelete={onDeleteLayer}
              zIndex={layer.zIndex}
            />
          )}
          {!["effect", "transition"].includes(layer.type) && (
            <div
              style={{
                padding: "8px",
                marginBottom: "4px",
                background: selectedLayerId === layer.id ? "#2a3f5f" : "#1a2332",
                border: selectedLayerId === layer.id ? "2px solid #5a8fff" : "1px solid #333",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => onSelectLayer(layer.id)}
            >
              <span style={{ fontSize: "13px", color: "#fff" }}>
                {getLayerIcon(layer.type)} {layer.name}
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayerUp(layer.id);
                  }}
                  style={{
                    padding: "2px 6px",
                    fontSize: "10px",
                    background: "#333",
                    border: "1px solid #555",
                    color: "#aaa",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayerDown(layer.id);
                  }}
                  style={{
                    padding: "2px 6px",
                    fontSize: "10px",
                    background: "#333",
                    border: "1px solid #555",
                    color: "#aaa",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  style={{
                    padding: "2px 6px",
                    fontSize: "10px",
                    background: "#ff4757",
                    border: "1px solid #ff3747",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
