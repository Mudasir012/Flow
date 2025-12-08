import React, { useState, useEffect, useRef, useMemo } from "react";
import { useVideoPlayer } from "./hooks/useVideoPlayer.jsx";
import { useLayerManager } from "./hooks/useLayerManager.jsx";
import { Preview } from "./preview.jsx";
import { Timeline } from "./Timeline/Timeline.jsx";
import { Toolbar } from "./Toolbar.jsx";
import { TextOverlayLayer } from "./TextOverlayLayer.jsx";
import { MediaBrowser } from "./panels/MediaBrowser.jsx";
import { EffectsPanel } from "./panels/EffectsPanel.jsx";
import { PropertiesPanel } from "./panels/PropertiesPanel.jsx";
import { LayerPanel } from "./components/LayerPanel.jsx";
import { applyEffectFilter } from "./effects/effectsLibrary.jsx";
import { applyTransition } from "./effects/transitionsLibrary.jsx";

import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  PrevIcon,
  NextIcon,
  ExportIcon,
} from "./icons/index.jsx";
import { styles } from "./styles/constants.jsx";

const VideoEditor = () => {
  const mediaRef = useRef(null);
  const previewRef = useRef(null);

  // Video player hook
  const {
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    isPlaying,
    play,
    pause,
    stop,
    seek,
    seekVersion,
  } = useVideoPlayer(60, mediaRef);
  

  // Unified layer system
  const {
    layers,
    selectedLayerId,
    setSelectedLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayerUp,
    moveLayerDown,
    getLayersByType,
    getSelectedLayer,
  } = useLayerManager();

  // State
  const [tracks, setTracks] = useState([]);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [selectedClip, setSelectedClip] = useState(null);
  const [currentTool, setCurrentTool] = useState("select");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activePanel, setActivePanel] = useState("project");
  const [mediaItems, setMediaItems] = useState([]);

  // Text layers (preserved for backward compatibility)
  const [textLayers, setTextLayers] = useState([]);
  const [selectedTextLayer, setSelectedTextLayer] = useState(null);

  // Compute active effects for current time
  const activeEffects = useMemo(() => {
    return getLayersByType("effect").filter(
      (layer) =>
        layer.timeRange.start <= currentTime && currentTime <= layer.timeRange.end
    );
  }, [layers, currentTime, getLayersByType]);

  // Compute active transitions for current time
  const activeTransitions = useMemo(() => {
    return getLayersByType("transition").filter(
      (layer) =>
        layer.timeRange.start <= currentTime && currentTime <= layer.timeRange.end
    );
  }, [layers, currentTime, getLayersByType]);
  

  const handleSelectMedia = (item) => {
    if (!item) return;
    setCurrentMedia(item);
    if (item.duration) {
      setDuration(item.duration);
    }

    // create a video and audio track containing a single clip spanning full duration
    const dur = item.duration || 60;
    const videoClip = {
      id: `${item.id}-v`,
      name: item.name,
      type: item.type === "audio" ? "audio" : "video",
      start: 0,
      end: dur,
      src: item.src,
    };
    const audioClip = {
      id: `${item.id}-a`,
      name: item.name + " (audio)",
      type: "audio",
      start: 0,
      end: dur,
      src: item.src,
    };

    setTracks([
      { id: `track-video-${item.id}`, name: "Video 1", clips: [videoClip] },
      { id: `track-audio-${item.id}`, name: "Audio 1", clips: [audioClip] },
    ]);
    seek(0);
    // auto-play when a media is selected
    setTimeout(() => {
      console.log("Auto-play triggered, mediaRef current:", mediaRef.current);
      play();
    }, 100);
  };

  useEffect(() => {
    // local-only: no remote media fetch
  }, []);

  const handlePlayPause = () => {
    console.log("PlayPause clicked - isPlaying:", isPlaying, "mediaRef.current:", mediaRef.current);
    if (isPlaying) {
      console.log("Calling pause()");
      pause();
    } else {
      console.log("Calling play()");
      play();
    }
    console.log("After play/pause call, isPlaying state will update");
  };

  // Text layer operations
  const addTextLayer = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      text: "New Text",
      x: 100,
      y: 100,
      fontSize: 24,
      fontWeight: "normal",
      fontFamily: "Arial",
      color: "#ffffff",
      zIndex: textLayers.length,
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedTextLayer(newLayer.id);
  };

  const updateTextLayer = (layerId, updates) => {
    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  };

  const deleteTextLayer = (layerId) => {
    setTextLayers((prev) => prev.filter((layer) => layer.id !== layerId));
    if (selectedTextLayer === layerId) setSelectedTextLayer(null);
  };

  const moveTextLayerUp = (layerId) => {
    setTextLayers((prev) => {
      const layer = prev.find((l) => l.id === layerId);
      if (!layer || layer.zIndex === prev.length - 1) return prev;
      return prev.map((l) =>
        l.id === layerId ? { ...l, zIndex: l.zIndex + 1 } : l.zIndex === layer.zIndex + 1 ? { ...l, zIndex: l.zIndex - 1 } : l
      );
    });
  };

  const moveTextLayerDown = (layerId) => {
    setTextLayers((prev) => {
      const layer = prev.find((l) => l.id === layerId);
      if (!layer || layer.zIndex === 0) return prev;
      return prev.map((l) =>
        l.id === layerId ? { ...l, zIndex: l.zIndex - 1 } : l.zIndex === layer.zIndex - 1 ? { ...l, zIndex: l.zIndex + 1 } : l
      );
    });
  };

  // Clip manipulation operations
  const trimClip = (clipId, side, amount) => {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => {
          if (c.id !== clipId) return c;
          if (side === "left") {
            return { ...c, start: Math.max(c.start, c.start + amount) };
          } else if (side === "right") {
            return { ...c, end: Math.min(c.end, c.end - amount) };
          }
          return c;
        }),
      }))
    );
  };

  const slipClip = (clipId, amount) => {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => {
          if (c.id !== clipId) return c;
          const duration = c.end - c.start;
          return { ...c, start: c.start + amount, end: c.start + amount + duration };
        }),
      }))
    );
  };

  const slideClip = (clipId, amount) => {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => {
          if (c.id !== clipId) return c;
          return { ...c, start: c.start + amount, end: c.end + amount };
        }),
      }))
    );
  };

  const rateStretchClip = (clipId, speedPercent) => {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        clips: t.clips.map((c) => {
          if (c.id !== clipId) return c;
          const duration = c.end - c.start;
          const newDuration = duration * (speedPercent / 100);
          return { ...c, end: c.start + newDuration, speed: speedPercent };
        }),
      }))
    );
  };

  // Central toolbar task handler: accepts { type, payload }
  const handleToolbarTask = (task) => {
    try {
      if (!task || !task.type) return;
      
      switch (task.type) {
        case "playPause":
          handlePlayPause();
          break;
          
        case "stop":
          stop();
          break;
          
        case "splitAtPlayhead":
          tracks.forEach((t) => {
            t.clips.forEach((c) => {
              if (currentTime > c.start && currentTime < c.end) {
                splitClipAt(t.id, c.id, currentTime);
              }
            });
          });
          break;
          
        case "rippleDeleteSelected":
          if (!selectedClip) return;
          const track = tracks.find((t) => t.clips.some((c) => c.id === selectedClip));
          if (!track) return;
          rippleDeleteClip(track.id, selectedClip);
          break;
          
        case "export":
          handleExport();
          break;
          
        case "addText":
          addTextLayer();
          break;
          
        case "deleteTextLayer":
          if (!selectedTextLayer) return;
          deleteTextLayer(selectedTextLayer);
          break;
          
        case "trimClip":
          if (!selectedClip) return;
          trimClip(selectedClip, task.payload?.side || "right", task.payload?.amount || 0.5);
          break;
          
        case "removeEffect":
          if (!selectedLayerId) return;
          const selectedLayer = getSelectedLayer();
          if (selectedLayer?.type !== "effect") return;
          deleteLayer(selectedLayerId);
          break;
          
        default:
          console.warn("Unknown toolbar task:", task.type);
      }
    } catch (error) {
      console.error("Error in handleToolbarTask:", error);
    }
  };

  // New handler for applying effects
  const handleApplyEffect = (effectId) => {
    try {
      if (!selectedClip) {
        console.warn("No clip selected for effect application");
        return;
      }

      // Find the clip's time range
      let clipStart = 0;
      let clipEnd = duration;
      tracks.forEach((t) => {
        const clip = t.clips.find((c) => c.id === selectedClip);
        if (clip) {
          clipStart = clip.start;
          clipEnd = clip.end;
        }
      });

      addLayer(
        "effect",
        effectId,
        { effectId, parameters: {} },
        { start: clipStart, end: clipEnd }
      );
    } catch (error) {
      console.error("Error applying effect:", error);
    }
  };

  // New handler for applying transitions
  const handleApplyTransition = (transitionId) => {
    try {
      if (!selectedClip) {
        console.warn("No clip selected for transition");
        return;
      }

      let clipEnd = 0;
      tracks.forEach((t) => {
        const clip = t.clips.find((c) => c.id === selectedClip);
        if (clip) {
          clipEnd = clip.end;
        }
      });

      addLayer(
        "transition",
        transitionId,
        { transitionId, duration: 0.5 },
        { start: clipEnd - 0.5, end: clipEnd }
      );
    } catch (error) {
      console.error("Error applying transition:", error);
    }
  };

  // Export handler
  const handleExport = () => {
    try {
      const exportData = {
        project: {
          name: "Exported Project",
          duration,
          tracks,
          layers,
          textLayers,
        },
      };
      console.log("Export data:", exportData);
      console.log("Export feature: Implement actual export (MP4/WebM encoding)");
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  // --- Editing helpers: split (razor) and ripple delete (basic) ---
  const splitClipAt = (trackId, clipId, time) => {
    setTracks((prev) => {
      return prev.map((t) => {
        if (t.id !== trackId) return t;
        const clipIndex = t.clips.findIndex((c) => c.id === clipId);
        if (clipIndex === -1) return t;
        const clip = t.clips[clipIndex];
        if (time <= clip.start || time >= clip.end) return t; // nothing to split

        const left = { ...clip, id: `${clip.id}-L-${Math.floor(time * 1000)}`, end: time };
        const right = { ...clip, id: `${clip.id}-R-${Math.floor(time * 1000)}`, start: time };

        const newClips = [
          ...t.clips.slice(0, clipIndex),
          left,
          right,
          ...t.clips.slice(clipIndex + 1),
        ];

        return { ...t, clips: newClips };
      });
    });
    // select the right side of the split
    setSelectedClip(`${clipId}-R-${Math.floor(currentTime * 1000)}`);
  };

  const rippleDeleteClip = (trackId, clipId) => {
    setTracks((prev) => {
      return prev.map((t) => {
        if (t.id !== trackId) return t;
        const clipIndex = t.clips.findIndex((c) => c.id === clipId);
        if (clipIndex === -1) return t;
        const removed = t.clips[clipIndex];
        const removedDuration = Math.max(0, removed.end - removed.start);
        // remove clip and shift subsequent clips earlier by removedDuration
        const before = t.clips.slice(0, clipIndex);
        const after = t.clips.slice(clipIndex + 1).map((c) => ({ ...c, start: Math.max(0, c.start - removedDuration), end: Math.max(c.start - removedDuration, c.end - removedDuration) }));
        return { ...t, clips: [...before, ...after] };
      });
    });
    if (selectedClip === clipId) setSelectedClip(null);
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.appHeader}>
        <div style={styles.appLogo}>
          <div style={styles.logoIcon}>Pr</div>
        </div>
        <div style={styles.playbackControls}>
          <button style={styles.btnIcon} title="Previous Frame">
            <PrevIcon />
          </button>
          <button
            style={{
              ...styles.btnPrimary,
              background: isPlaying ? "#ff4757" : "#5a8fff",
              borderColor: isPlaying ? "#ff3747" : "#4a7fef",
            }}
            onClick={handlePlayPause}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button style={styles.btnIcon} title="Next Frame">
            <NextIcon />
          </button>
          <button style={styles.btnIcon} title="Stop" onClick={stop}>
            <StopIcon />
          </button>
        </div>
        <div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button style={styles.btnExport}>
              <ExportIcon />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.appMain}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.panelTabs}>
            <button
              style={{
                ...styles.tab,
                ...(activePanel === "project" ? styles.tabActive : {}),
              }}
              onClick={() => setActivePanel("project")}
            >
              PROJECT
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activePanel === "effects" ? styles.tabActive : {}),
              }}
              onClick={() => setActivePanel("effects")}
            >
              EFFECTS
            </button>
          </div>
          <div style={styles.panelContent}>
            {activePanel === "project" && (
              <MediaBrowser
                mediaItems={mediaItems}
                setMediaItems={setMediaItems}
                onSelectMedia={handleSelectMedia}
              />
            )}
            {activePanel === "effects" && (
              <EffectsPanel
                onApplyEffect={handleApplyEffect}
                selectedClip={selectedClip}
              />
            )}
          </div>
        </div>

        {/* Center Panel */}
        <div style={styles.centerPanel}>
          <div style={{ position: "relative", width: "100%", height: "420px" }}>
            <Preview
              currentTime={currentTime}
              isPlaying={isPlaying}
              duration={duration}
              media={currentMedia}
              mediaRef={mediaRef}
              effects={activeEffects}
              transitions={activeTransitions}
            />
            <div
              ref={previewRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "360px",
                overflow: "hidden",
                backgroundColor: "transparent",
                pointerEvents: currentTool === "text" ? "auto" : "none",
              }}
              onClick={(e) => {
                if (currentTool === "text" && e.target === previewRef.current) {
                  addTextLayer();
                }
              }}
            >
              {textLayers.map((layer) => (
                <TextOverlayLayer
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedTextLayer === layer.id}
                  onSelect={(id) => { setSelectedTextLayer(id); setCurrentTool("select"); }}
                  onUpdate={updateTextLayer}
                  onDelete={deleteTextLayer}
                  zIndex={100 + layer.zIndex}
                />
              ))}
            </div>
          </div>
          <Timeline
            currentTime={currentTime}
            seek={seek}
            duration={duration}
            tracks={tracks}
            selectedClip={selectedClip}
            setSelectedClip={setSelectedClip}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            currentTool={currentTool}
            setTracks={setTracks}
            onSplitClip={splitClipAt}
            onRippleDelete={rippleDeleteClip}
            layers={layers}
            textLayers={textLayers}
            selectedLayerId={selectedLayerId}
            setSelectedLayerId={setSelectedLayerId}
            selectedTextLayer={selectedTextLayer}
            setSelectedTextLayer={setSelectedTextLayer}
          />
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.panelHeader}>Layers</div>
          <LayerPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={updateLayer}
            onDeleteLayer={deleteLayer}
            onMoveLayerUp={moveLayerUp}
            onMoveLayerDown={moveLayerDown}
          />
          
          <div style={{ ...styles.panelHeader, marginTop: "12px" }}>Properties</div>
          <PropertiesPanel
            selectedClip={selectedClip}
            tracks={tracks}
            selectedTextLayer={selectedTextLayer}
            textLayers={textLayers}
            onTextLayerUpdate={updateTextLayer}
          />
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        activeTool={currentTool}
        onChangeActiveTool={setCurrentTool}
        isPlaying={isPlaying}
        onTask={handleToolbarTask}
        selectedClip={selectedClip}
        selectedTextLayer={selectedTextLayer}
        selectedEffect={selectedLayerId && getSelectedLayer()?.type === "effect" ? selectedLayerId : null}
      />
    </div>
  );
};
export default VideoEditor;