import React, { useState, useRef, useEffect } from "react";
import { styles } from "./styles/constants.jsx";

export const TextOverlayLayer = ({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  zIndex,
  previewWidth = 960,
  previewHeight = 540,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const ref = useRef();

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(layer.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - layer.x,
      y: e.clientY - layer.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onUpdate(layer.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, layer.id, onUpdate]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${layer.x}px`,
        top: `${layer.y}px`,
        zIndex: zIndex,
        cursor: isDragging ? "grabbing" : "grab",
        padding: "8px 12px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: layer.color || "#ffffff",
        fontSize: `${layer.fontSize || 24}px`,
        fontWeight: layer.fontWeight || "normal",
        fontFamily: layer.fontFamily || "Arial",
        border: isSelected ? "2px solid #5a8fff" : "2px solid transparent",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "auto",
        onMouseDown: handleMouseDown,
      }}
      onMouseDown={handleMouseDown}
    >
      {layer.text}
      {isSelected && (
        <button
          style={{
            marginLeft: "8px",
            padding: "2px 6px",
            fontSize: "12px",
            backgroundColor: "#ff4757",
            color: "#fff",
            border: "none",
            borderRadius: "2px",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(layer.id);
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
