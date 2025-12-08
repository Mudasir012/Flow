import React, { useState } from "react";
import { PlusIcon } from "../icons";
import { formatTime } from "../hooks/useVideoPlayer";
import { styles } from "../styles/constants";

export const PropertiesPanel = ({ selectedClip, tracks, selectedTextLayer, textLayers, onTextLayerUpdate }) => {
  if (selectedTextLayer && textLayers) {
    const layer = textLayers.find((l) => l.id === selectedTextLayer);
    if (layer) {
      return (
        <div style={styles.propertiesPanel}>
          <div style={styles.panelHeader}>Text Layer Properties</div>
          <div style={{ padding: "16px 0" }}>
            <div style={styles.propertiesSection}>
              <h4 style={styles.sectionTitle}>Text Content</h4>
              <div style={styles.property}>
                <label style={styles.propertyLabel}>Text</label>
                <input
                  type="text"
                  value={layer.text}
                  onChange={(e) => onTextLayerUpdate?.(layer.id, { text: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.propertiesSection}>
              <h4 style={styles.sectionTitle}>Style</h4>
              <div style={styles.property}>
                <label style={styles.propertyLabel}>Font Size</label>
                <input
                  type="number"
                  value={layer.fontSize}
                  onChange={(e) => onTextLayerUpdate?.(layer.id, { fontSize: parseInt(e.target.value) })}
                  style={styles.input}
                  min="8"
                  max="100"
                />
              </div>
              <div style={styles.property}>
                <label style={styles.propertyLabel}>Color</label>
                <input
                  type="color"
                  value={layer.color}
                  onChange={(e) => onTextLayerUpdate?.(layer.id, { color: e.target.value })}
                  style={{ ...styles.input, height: "32px", cursor: "pointer" }}
                />
              </div>
              <div style={styles.property}>
                <label style={styles.propertyLabel}>Font Weight</label>
                <select
                  value={layer.fontWeight}
                  onChange={(e) => onTextLayerUpdate?.(layer.id, { fontWeight: e.target.value })}
                  style={styles.input}
                >
                  <option>normal</option>
                  <option>bold</option>
                </select>
              </div>
            </div>

            <div style={styles.propertiesSection}>
              <h4 style={styles.sectionTitle}>Position</h4>
              <div style={styles.property}>
                <label style={styles.propertyLabel}>X</label>
                <input
                  type="number"
                  value={Math.round(layer.x)}
                  onChange={(e) => onTextLayerUpdate?.(layer.id, { x: parseInt(e.target.value) })}
                  style={styles.input}
                />
              </div>
              <div style={styles.property}>
                <label style={styles.propertyLabel}>Y</label>
                <input
                  type="number"
                  value={Math.round(layer.y)}
                  onChange={(e) => onTextLayerUpdate?.(layer.id, { y: parseInt(e.target.value) })}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (!selectedClip) {
    return (
      <div style={styles.propertiesPanel}>
        <div style={styles.panelPlaceholder}>
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <p style={{ fontSize: "12px" }}>Select a clip to edit properties</p>
        </div>
      </div>
    );
  }

  const selectedClipData = tracks.flatMap((t) => t.clips).find((c) => c.id === selectedClip);

  return (
    <div style={styles.propertiesPanel}>
      <div style={styles.panelHeader}>Effect Controls</div>

      <div style={{ padding: "16px 0" }}>
        <div
          style={{
            ...styles.propertiesSection,
            borderBottom: "1px solid #1a1a1a",
            paddingBottom: "16px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "12px", color: "#d4d4d4" }}>
            {selectedClipData?.name}
          </div>
          <div style={{ fontSize: "11px", color: "#666666" }}>
            {selectedClipData?.type.toUpperCase()} • {formatTime(selectedClipData?.start)} -{" "}
            {formatTime(selectedClipData?.end)}
          </div>
        </div>

        <div style={styles.propertiesSection}>
          <h4 style={{ ...styles.sectionTitle }}>Motion</h4>
          <div style={styles.propertyGroup}>
            <div style={styles.property}>
              <label style={styles.propertyLabel}>Position</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input type="number" defaultValue={960} style={styles.input} placeholder="X" />
                <input type="number" defaultValue={540} style={styles.input} placeholder="Y" />
              </div>
            </div>
            <div style={styles.property}>
              <label style={styles.propertyLabel}>Scale</label>
              <input type="number" defaultValue={100} style={styles.input} />
            </div>
            <div style={styles.property}>
              <label style={styles.propertyLabel}>Rotation</label>
              <input type="number" defaultValue={0} style={styles.input} />
            </div>
          </div>
        </div>

        <div style={styles.propertiesSection}>
          <h4 style={styles.sectionTitle}>Opacity</h4>
          <div style={styles.property}>
            <label style={styles.propertyLabel}>Opacity</label>
            <input type="range" min="0" max="100" defaultValue={100} style={styles.slider} />
            <input type="number" defaultValue={100} style={{ ...styles.input, width: "50px" }} />
          </div>
        </div>

        <div style={styles.propertiesSection}>
          <h4 style={styles.sectionTitle}>Time Remapping</h4>
          <div style={styles.property}>
            <label style={styles.propertyLabel}>Speed</label>
            <input type="number" defaultValue={selectedClipData?.speed || 100} style={styles.input} />
            <span style={{ fontSize: "11px", color: "#666666" }}>%</span>
          </div>
        </div>

        <div style={styles.propertiesSection}>
          <h4 style={styles.sectionTitle}>Audio</h4>
          <div style={styles.propertyGroup}>
            <div style={styles.property}>
              <label style={styles.propertyLabel}>Level</label>
              <input type="range" min="0" max="200" defaultValue={100} style={styles.slider} />
              <input type="number" defaultValue={0} style={{ ...styles.input, width: "50px" }} />
            </div>
          </div>
        </div>

        <div style={styles.propertiesSection}>
          <button
            style={{
              ...styles.btnPrimary,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <PlusIcon />
            Add Effect
          </button>
        </div>
      </div>
    </div>
  );
};