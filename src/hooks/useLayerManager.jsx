import { useState, useCallback } from "react";

// Unified layer management system for all layer types
export const useLayerManager = () => {
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  // Layer structure: { id, type: 'video'|'audio'|'text'|'effect'|'transition', name, zIndex, visible, locked, properties: {}, timeRange: {start, end} }

  const addLayer = useCallback((type, name, properties = {}, timeRange = { start: 0, end: 60 }) => {
    try {
      const newLayer = {
        id: `${type}-${Date.now()}`,
        type,
        name,
        zIndex: layers.length,
        visible: true,
        locked: false,
        properties,
        timeRange,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
      return newLayer;
    } catch (error) {
      console.error("Error adding layer:", error);
      return null;
    }
  }, [layers.length]);

  const updateLayer = useCallback((layerId, updates) => {
    try {
      setLayers((prev) =>
        prev.map((layer) =>
          layer.id === layerId ? { ...layer, ...updates } : layer
        )
      );
    } catch (error) {
      console.error("Error updating layer:", error);
    }
  }, []);

  const deleteLayer = useCallback((layerId) => {
    try {
      setLayers((prev) => prev.filter((layer) => layer.id !== layerId));
      if (selectedLayerId === layerId) setSelectedLayerId(null);
    } catch (error) {
      console.error("Error deleting layer:", error);
    }
  }, [selectedLayerId]);

  const moveLayerUp = useCallback((layerId) => {
    try {
      setLayers((prev) => {
        const layer = prev.find((l) => l.id === layerId);
        if (!layer || layer.zIndex === prev.length - 1) return prev;
        return prev.map((l) =>
          l.id === layerId
            ? { ...l, zIndex: l.zIndex + 1 }
            : l.zIndex === layer.zIndex + 1
            ? { ...l, zIndex: l.zIndex - 1 }
            : l
        );
      });
    } catch (error) {
      console.error("Error moving layer up:", error);
    }
  }, []);

  const moveLayerDown = useCallback((layerId) => {
    try {
      setLayers((prev) => {
        const layer = prev.find((l) => l.id === layerId);
        if (!layer || layer.zIndex === 0) return prev;
        return prev.map((l) =>
          l.id === layerId
            ? { ...l, zIndex: l.zIndex - 1 }
            : l.zIndex === layer.zIndex - 1
            ? { ...l, zIndex: l.zIndex + 1 }
            : l
        );
      });
    } catch (error) {
      console.error("Error moving layer down:", error);
    }
  }, []);

  const reorderLayers = useCallback((fromIndex, toIndex) => {
    try {
      setLayers((prev) => {
        const newLayers = [...prev];
        const [removed] = newLayers.splice(fromIndex, 1);
        newLayers.splice(toIndex, 0, removed);
        return newLayers.map((layer, idx) => ({ ...layer, zIndex: idx }));
      });
    } catch (error) {
      console.error("Error reordering layers:", error);
    }
  }, []);

  const toggleLayerVisibility = useCallback((layerId) => {
    try {
      updateLayer(layerId, {
        visible: !layers.find((l) => l.id === layerId)?.visible,
      });
    } catch (error) {
      console.error("Error toggling layer visibility:", error);
    }
  }, [layers, updateLayer]);

  const toggleLayerLock = useCallback((layerId) => {
    try {
      updateLayer(layerId, {
        locked: !layers.find((l) => l.id === layerId)?.locked,
      });
    } catch (error) {
      console.error("Error toggling layer lock:", error);
    }
  }, [layers, updateLayer]);

  const getLayersByType = useCallback((type) => {
    try {
      return layers.filter((layer) => layer.type === type);
    } catch (error) {
      console.error("Error getting layers by type:", error);
      return [];
    }
  }, [layers]);

  const getSelectedLayer = useCallback(() => {
    try {
      return layers.find((l) => l.id === selectedLayerId) || null;
    } catch (error) {
      console.error("Error getting selected layer:", error);
      return null;
    }
  }, [layers, selectedLayerId]);

  return {
    layers,
    selectedLayerId,
    setSelectedLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    reorderLayers,
    toggleLayerVisibility,
    toggleLayerLock,
    getLayersByType,
    getSelectedLayer,
  };
};
