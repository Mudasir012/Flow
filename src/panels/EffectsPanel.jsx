import React, { useState } from "react";
import { styles } from "../styles/constants";
import { getEffectsByCategory } from "../effects/effectsLibrary.jsx";

export const EffectsPanel = ({ onApplyEffect, selectedClip }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Color Correction",
    "Blur & Sharpen",
    "Distort",
    "Perspective",
    "Transform",
    "Style",
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            style={{
              ...(activeCategory === category
                ? { ...styles.categoryBtn, ...styles.categoryBtnActive }
                : styles.categoryBtn),
            }}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {!selectedClip && (
        <div
          style={{
            padding: "12px",
            textAlign: "center",
            color: "#666",
            fontSize: "12px",
            background: "#1a1a1a",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          Select a clip to apply effects
        </div>
      )}

      <div>
        {getEffectsByCategory(activeCategory).map((effect) => (
          <div
            key={effect.id}
            style={{
              ...styles.effectItem,
              cursor: selectedClip ? "pointer" : "not-allowed",
              opacity: selectedClip ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (selectedClip) {
                e.currentTarget.style.backgroundColor = "#2d2d2d";
                e.currentTarget.style.borderColor = "#3a3a3a";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#252525";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => {
              if (selectedClip && onApplyEffect) {
                onApplyEffect(effect.id);
              }
            }}
          >
            <div style={styles.effectIcon}>
              <span style={{ fontSize: "18px", color: "#5a8fff" }}>✨</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", color: "#d4d4d4", marginBottom: "2px" }}>
                {effect.name}
              </div>
              <div style={{ fontSize: "10px", color: "#666666" }}>
                {effect.category}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};