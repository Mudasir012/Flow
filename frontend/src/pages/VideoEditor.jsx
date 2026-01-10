import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Upload, Download, Save,
  Scissors, Trash2, ZoomIn, ZoomOut, Type, Music,
  Film, X, Loader2, SkipBack, SkipForward, Home, Copy,
  RotateCw, Crop, FlipHorizontal, FlipVertical, Sliders,
  Image as ImageIcon, Layers, Eye, EyeOff, Edit3,
  Move, ArrowUp, ArrowDown, GripVertical, CornerUpLeft, CornerUpRight,
  Lock, Maximize2, Minimize2, Square, Circle,
  HelpCircle, MoreHorizontal, Check, Plus, Minus
} from 'lucide-react';

// Utility functions
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const generateId = () => Date.now() + Math.random();

// Text Editor Component
const TextEditor = ({ text, onUpdate, onDelete, onClose }) => {
  const [editText, setEditText] = useState(text);
  const duration = text.end - text.start;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Text</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Text</label>
            <input
              type="text"
              value={editText.text}
              onChange={(e) => setEditText({ ...editText, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={duration.toFixed(1)}
              onChange={(e) => {
                 const newDuration = parseFloat(e.target.value);
                 if (newDuration > 0) {
                    setEditText({ 
                       ...editText, 
                       end: editText.start + newDuration 
                    });
                 }
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Font Size: {editText.fontSize}px</label>
            <input
              type="range"
              min="12"
              max="120"
              value={editText.fontSize}
              onChange={(e) => setEditText({ ...editText, fontSize: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="color"
              value={editText.color}
              onChange={(e) => setEditText({ ...editText, color: e.target.value })}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={editText.fontFamily}
              onChange={(e) => setEditText({ ...editText, fontFamily: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Opacity: {Math.round(editText.opacity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={editText.opacity}
              onChange={(e) => setEditText({ ...editText, opacity: parseFloat(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                onDelete(editText.id);
                onClose();
              }}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => {
                onUpdate(editText);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Crop Tool Component
const CropTool = ({ clip, onApply, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Crop Video</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Width: {crop.width}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={crop.width}
              onChange={(e) => setCrop({ ...crop, width: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Height: {crop.height}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={crop.height}
              onChange={(e) => setCrop({ ...crop, height: parseInt(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 56.25 })} 
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
              16:9
            </button>
            <button onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 75 })} 
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
              4:3
            </button>
            <button onClick={() => setCrop({ x: 0, y: 0, width: 56.25, height: 100 })} 
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
              9:16
            </button>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(crop);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Renderer Component
const VideoRenderer = React.memo(({ 
  clips, 
  textOverlays, 
  currentTime, 
  isPlaying, 
  isMuted, 
  volume,
  onImportClick,
  onTimeUpdate,
  duration,             // New prop
  onCanvasMouseDown     // New prop for click/drag
}) => {
  const canvasRef = useRef(null);
  const videoCacheRef = useRef(new Map()); // Cache for video elements
  const animationFrameRef = useRef(null);
  const currentTimeRef = useRef(currentTime);
  const previewRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastUiUpdateRef = useRef(0);
  const durationRef = useRef(duration);

  // Sync duration
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Sync currentTime to ref when NOT playing (e.g. scrubbing/seeking)
  useEffect(() => {
    if (!isPlaying) {
      currentTimeRef.current = currentTime;
    }
  }, [currentTime, isPlaying]);

  // Handle Play/Pause Transition
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now() - (currentTimeRef.current * 1000);
      
      // Play all relevant videos
      videoCacheRef.current.forEach(video => {
         // In a real mixer, you only play active ones.
         // But for sync simplicity, we can play or set time.
         // We will handle play/pause in the render loop or here.
         // Let's rely on the loop to "drive" the time, but we need them initially unpaused?
         // Actually, video.currentTime is set in loop. If we don't call play(), it won't advance if it has audio?
         // Chrome requires play() for audio track.
         video.play().catch(() => {});
      });
    } else {
      videoCacheRef.current.forEach(video => {
         video.pause();
      });
    }
  }, [isPlaying]);

  // Resize canvas
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current && previewRef.current) {
        const container = previewRef.current;
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Sync Video Cache
  useEffect(() => {
     // Create new videos or update
     clips.forEach(clip => {
        if (clip.type === 'video' || clip.type === 'audio') {
           let el = videoCacheRef.current.get(clip.id);
           if (!el) {
              el = document.createElement('video');
              el.src = clip.url;
              el.preload = 'auto'; // Important for smooth seeking
              el.load();
              videoCacheRef.current.set(clip.id, el);
           } else if (el.src !== clip.url) {
              el.src = clip.url;
              el.load();
           }
        }
     });
     
     // Cleanup removed clips
     const clipIds = new Set(clips.map(c => c.id));
     for (const [id, el] of videoCacheRef.current.entries()) {
        if (!clipIds.has(id)) {
           // Cleanup blob urls if managed here? No, user handles blobs.
           el.pause();
           el.src = "";
           videoCacheRef.current.delete(id);
        }
     }
  }, [clips]);

  // Update volume/mute on ALL cached videos
  useEffect(() => {
    videoCacheRef.current.forEach(video => {
       video.volume = volume;
       video.muted = isMuted;
    });
  }, [volume, isMuted, clips]); // Deps need clips to update new ones

  // Main Render Loop - The "Master Clock"
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      // 1. Calculate Time
      let time = currentTimeRef.current;
      
      if (isPlaying) {
        // High-precision smooth time
        time = (performance.now() - startTimeRef.current) / 1000;
        
        // PAUSE AT END LOGIC
        if (time >= durationRef.current) {
          // LOOP LOGIC
          time = 0;
          startTimeRef.current = performance.now();
        }
        
        currentTimeRef.current = time; // Update ref for internal use

        // Throttle UI updates to ~15fps to save main thread
        const now = Date.now();
        if (now - lastUiUpdateRef.current > 66) { // ~15fps
           onTimeUpdate(time);
           lastUiUpdateRef.current = now;
        }
      }

      // 2. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 3. Get Visible Elements
      const visibleClips = clips.filter(clip => 
        time >= clip.start && 
        time < clip.end && 
        clip.visible !== false
      );
      
      const visibleTexts = textOverlays.filter(text => 
        time >= text.start && 
        time < text.end && 
        text.visible !== false
      );
      
      // Sort by Z-INDEX
      const allElements = [...visibleClips, ...visibleTexts].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      
      // 4. Render Elements
      allElements.forEach(element => {
        ctx.save();
        
        if (element.type === 'video' || element.type === 'image') {
          if (element.type === 'video') {
             const video = videoCacheRef.current.get(element.id);
             
             if (video && video.readyState >= 2) {
               const clipTime = time - element.start + element.trimStart;
               
               // Sync Video
               if (isPlaying && Math.abs(video.currentTime - clipTime) > 0.2) {
                 video.currentTime = clipTime; 
               } else if (!isPlaying) {
                 video.currentTime = clipTime;
               }
               
               // If playing and paused (e.g. stalled), try play
               if (isPlaying && video.paused) video.play().catch(()=>{});
               // If not playing and playing, pause
               if (!isPlaying && !video.paused) video.pause();
               
               // Transform
               ctx.translate(canvas.width / 2, canvas.height / 2);
               if (element.transform.rotation) ctx.rotate(element.transform.rotation * Math.PI / 180);
               const scaleX = element.transform.flipH ? -1 : 1;
               const scaleY = element.transform.flipV ? -1 : 1;
               ctx.scale(scaleX, scaleY);
               
               // Crop & Scale Logic
               const cropWidth = element.crop.width / 100;
               const cropHeight = element.crop.height / 100;
               const aspectRatio = video.videoWidth / video.videoHeight;
               let width, height;
               if (canvas.width / canvas.height > aspectRatio) {
                 height = canvas.height * cropHeight;
                 width = height * aspectRatio * cropWidth;
               } else {
                 width = canvas.width * cropWidth;
                 height = width / aspectRatio * cropHeight;
               }
               
               // Filters
               ctx.filter = `brightness(${element.filters.brightness}%) contrast(${element.filters.contrast}%) saturate(${element.filters.saturation}%) hue-rotate(${element.filters.hue}deg) blur(${element.filters.blur}px) grayscale(${element.filters.grayscale}%) sepia(${element.filters.sepia}%)`;
               
               ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, -width / 2, -height / 2, width, height);
             }
          } else if (element.type === 'image') {
            // Image Logic (unchanged essentially, just verifying ref access)
            const img = new Image();
            img.src = element.url;
             
             // Transform
              ctx.translate(canvas.width / 2, canvas.height / 2);
              if (element.transform.rotation) ctx.rotate(element.transform.rotation * Math.PI / 180);
              const scaleX = element.transform.flipH ? -1 : 1;
              const scaleY = element.transform.flipV ? -1 : 1;
              ctx.scale(scaleX, scaleY);
              
              // Crop & Scale
              const cropWidth = element.crop.width / 100;
              const cropHeight = element.crop.height / 100;
              const iWidth = img.naturalWidth || 1920; 
              const iHeight = img.naturalHeight || 1080;
              const aspectRatio = iWidth / iHeight;
              
              let width, height;
              if (canvas.width / canvas.height > aspectRatio) {
                height = canvas.height * cropHeight;
                width = height * aspectRatio * cropWidth;
              } else {
                width = canvas.width * cropWidth;
                height = width / aspectRatio * cropHeight;
              }

               // Filters
              ctx.filter = `brightness(${element.filters.brightness}%) contrast(${element.filters.contrast}%) saturate(${element.filters.saturation}%) hue-rotate(${element.filters.hue}deg) blur(${element.filters.blur}px) grayscale(${element.filters.grayscale}%) sepia(${element.filters.sepia}%)`;
              
              if (img.complete) {
                 ctx.drawImage(img, 0, 0, iWidth, iHeight, -width / 2, -height / 2, width, height);
              }
          }
        } else if (element.text) {
           // Text Logic
          const x = (element.x / 100) * canvas.width;
          const y = (element.y / 100) * canvas.height;
          ctx.font = `${element.fontSize}px ${element.fontFamily}`;
          ctx.fillStyle = element.color;
          ctx.globalAlpha = element.opacity;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(element.text, x, y);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
           ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
        ctx.restore();
      });
      
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Start rendering
    render();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [clips, textOverlays, isPlaying]);

  // Handle Mouse interaction for movable elements
  const handleMouseDown = (e) => {
    if (!canvasRef.current || !onCanvasMouseDown) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale coordinates to canvas resolution
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // Hit testing (Reverse order to click top elements first)
    // We need to reconstruct the visible elements list for the current time
    // Ideally we shouldn't duplicate this logic, but for now strict local check is fine.
    const time = currentTimeRef.current;
    
    // Get clips and text visible NOW
     const visibleClips = clips.filter(clip => 
        time >= clip.start && time < clip.end && clip.visible !== false
      );
      const visibleTexts = textOverlays.filter(text => 
        time >= text.start && time < text.end && text.visible !== false
      );
      const allElements = [...visibleClips, ...visibleTexts].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)); // Descending for hit test

    for (const element of allElements) {
       if (element.text) {
          // Approximate text hit box
          // This is rough because we don't have the context to measureText here easily without blocking
          // But we can estimate based on font size
          const tx = (element.x / 100) * canvasRef.current.width;
          const ty = (element.y / 100) * canvasRef.current.height;
          // Assume text is roughly centered at x,y
          // Width estimation: char count * font size * 0.6
          const estWidth = element.text.length * element.fontSize * 0.6; 
          const estHeight = element.fontSize;
          
          if (
             canvasX >= tx - estWidth/2 && 
             canvasX <= tx + estWidth/2 &&
             canvasY >= ty - estHeight/2 &&
             canvasY <= ty + estHeight/2
          ) {
             onCanvasMouseDown(element.id, 'text', e);
             return;
          }
       }
       // We can also add hit testing for video clips here if we want them movable on canvas (PIP)
       // But user specifically asked for "TEXT MOVALABLE"
    }
  };

  return (
    <div ref={previewRef} className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-lg">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer" 
        onMouseDown={handleMouseDown}
      />
      {/* Hidden Videos container to keep DOM references if needed, though we use detached elements in cache */}
      {clips.length === 0 && textOverlays.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <Film className="w-20 h-20 mb-4 opacity-30" />
          <p className="text-lg mb-2">No media in timeline</p>
          <p className="text-sm">Import media and add to timeline</p>
          <button
            onClick={onImportClick}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Import Media</span>
          </button>
        </div>
      ) : (
        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatTime(currentTime)}
        </div>
      )}
      <video className="hidden" />
    </div>
  );
});

// Main VideoEditor Component
const VideoEditor = () => {
  const PIXEL_PER_SECOND = 50;
  const TRACK_HEIGHT = 60;

  // Refs
  const fileInputRef = useRef(null);
  const timelineRef = useRef(null);

  // Core state
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [clips, setClips] = useState([]);
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canvasDrag, setCanvasDrag] = useState(null); // { id, initialX, initialY, initialMouseX, initialMouseY }
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState('selection');
  const [activeLeftTab, setActiveLeftTab] = useState('media');
  const [activeRightTab, setActiveRightTab] = useState('filters');
  const [projectName, setProjectName] = useState('Untitled Project');
  const [notification, setNotification] = useState(null);

  // UI state
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCropTool, setShowCropTool] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0
  });

  // Drag state
  const [draggingElement, setDraggingElement] = useState(null);
  const [isTimelineDragging, setIsTimelineDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragType, setDragType] = useState(null);
  const [dragClipId, setDragClipId] = useState(null);
  const [dragEdge, setDragEdge] = useState(null);
  const [dragOffset, setDragOffset] = useState(0); // For smooth dragging

  // Layers
  const [layers, setLayers] = useState([]);
  const [layerVisibility, setLayerVisibility] = useState({});

  // History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // History management
  const pushHistory = useCallback(() => {
    const snapshot = {
      clips: JSON.parse(JSON.stringify(clips)),
      textOverlays: JSON.parse(JSON.stringify(textOverlays)),
      filters: { ...filters },
      duration
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [clips, textOverlays, filters, duration, history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setClips(prevState.clips);
      setTextOverlays(prevState.textOverlays);
      setFilters(prevState.filters);
      setDuration(prevState.duration);
      setHistoryIndex(historyIndex - 1);
      showNotification('Undo');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setClips(nextState.clips);
      setTextOverlays(nextState.textOverlays);
      setFilters(nextState.filters);
      setDuration(nextState.duration);
      setHistoryIndex(historyIndex + 1);
      showNotification('Redo');
    }
  };

  // File import - FIXED
  const handleFileImport = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newMedia = [];
    
    for (const file of files) {
      const url = URL.createObjectURL(file);
      const fileType = file.type.split('/')[0];

      if (fileType === 'video') {
        try {
          const video = document.createElement('video');
          video.src = url;
          
          await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
              const newItem = {
                id: generateId(),
                name: file.name,
                type: 'video',
                url,
                duration: video.duration,
                width: video.videoWidth,
                height: video.videoHeight
              };
              newMedia.push(newItem);
              resolve();
            };
            
            video.onerror = reject;
            // Set timeout to handle cases where metadata doesn't load
            setTimeout(() => {
              if (video.duration) {
                const newItem = {
                  id: generateId(),
                  name: file.name,
                  type: 'video',
                  url,
                  duration: video.duration || 10,
                  width: video.videoWidth || 1920,
                  height: video.videoHeight || 1080
                };
                newMedia.push(newItem);
                resolve();
              }
            }, 1000);
          });
        } catch (err) {
          console.error('Error loading video:', err);
          // Add anyway with default values
          newMedia.push({
            id: generateId(),
            name: file.name,
            type: 'video',
            url,
            duration: 10,
            width: 1920,
            height: 1080
          });
        }
      } else if (fileType === 'audio') {
        try {
          const audio = new Audio(url);
          
          await new Promise((resolve) => {
            audio.onloadedmetadata = () => {
              newMedia.push({
                id: generateId(),
                name: file.name,
                type: 'audio',
                url,
                duration: audio.duration
              });
              resolve();
            };
            
            // Fallback
            setTimeout(() => {
              if (audio.duration && audio.duration !== Infinity) {
                newMedia.push({
                  id: generateId(),
                  name: file.name,
                  type: 'audio',
                  url,
                  duration: audio.duration
                });
              } else {
                newMedia.push({
                  id: generateId(),
                  name: file.name,
                  type: 'audio',
                  url,
                  duration: 30
                });
              }
              resolve();
            }, 1000);
          });
        } catch (err) {
          newMedia.push({
            id: generateId(),
            name: file.name,
            type: 'audio',
            url,
            duration: 30
          });
        }
      } else if (fileType === 'image') {
        const img = new Image();
        img.src = url;
        
        await new Promise((resolve) => {
          img.onload = () => {
            newMedia.push({
              id: generateId(),
              name: file.name,
              type: 'image',
              url,
              duration: 5,
              width: img.width,
              height: img.height
            });
            resolve();
          };
          
          img.onerror = () => {
            newMedia.push({
              id: generateId(),
              name: file.name,
              type: 'image',
              url,
              duration: 5,
              width: 800,
              height: 600
            });
            resolve();
          };
        });
      }
    }
    
    setMediaLibrary(prev => [...prev, ...newMedia]);
    showNotification(`Added ${files.length} file(s)`);
  };

  const addToTimeline = (media) => {
    const startTime = clips.length > 0 ? Math.max(...clips.map(c => c.end)) : 0;
    
    // Calculate next Z-Index
    const maxZ = Math.max(0, ...clips.map(c => c.zIndex || 0), ...textOverlays.map(t => t.zIndex || 0));

    const newClip = {
      id: generateId(),
      mediaId: media.id,
      name: media.name,
      type: media.type,
      url: media.url,
      start: startTime,
      end: startTime + media.duration,
      duration: media.duration,
      zIndex: maxZ + 1, // Assign Z-Index
      volume: 1,
      speed: 1,
      filters: { ...filters },
      transform: { 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1, 
        flipH: false, 
        flipV: false,
        x: 0,
        y: 0
      },
      crop: { x: 0, y: 0, width: 100, height: 100 },
      trimStart: 0,
      trimEnd: media.duration,
      visible: true
    };

    setClips(prev => [...prev, newClip]);
    
    // Update duration
    const newDuration = Math.max(duration, newClip.end + 5);
    setDuration(newDuration);
    
    pushHistory();
    showNotification(`Added ${media.name} to timeline`);
    
    // Auto-select the new clip
    setSelectedClip(newClip);
    setSelectedText(null);
  };

  // Playback - FIXED
  const togglePlayPause = () => {
    if (!isPlaying && clips.length === 0) {
      showNotification('Add clips to timeline first', 'error');
      return;
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    const newTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(newTime);
  };

  // Timeline dragging handlers - FIXED
  const handleTimelineMouseDown = (e) => {
    if (!timelineRef.current || e.button !== 0) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / (PIXEL_PER_SECOND * zoom);
    
    setDragStartX(x);
    setDragStartTime(time);
    setIsTimelineDragging(true);
    setDragType('playhead');
    handleSeek(time);
  };

  const handleTimelineMouseMove = useCallback((e) => {
    if (!isTimelineDragging || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(duration, x / (PIXEL_PER_SECOND * zoom)));
    
    if (dragType === 'playhead') {
      handleSeek(time);
    } else if (dragType === 'clip' && dragClipId) {
      // PROPER DRAG LOGIC
      // newStart = currentTime - dragOffset
      const newStart = Math.max(0, time - dragOffset);
      
      if (textOverlays.some(t => t.id === dragClipId)) {
         setTextOverlays(prev => prev.map(t => {
            if (t.id === dragClipId) {
               const dur = t.end - t.start;
               return { ...t, start: newStart, end: newStart + dur };
            }
            return t;
         }));
      } else {
         setClips(prev => prev.map(c => {
            if (c.id === dragClipId) {
               const dur = c.end - c.start;
               return { ...c, start: newStart, end: newStart + dur };
            }
            return c;
         }));
      }
    } else if (dragType === 'edge' && dragClipId && dragEdge) {
       // Edges logic seemed OK but lets ensure we use delta from start correctly?
       // Actually edge dragging was Delta based: time - dragStartTime. 
       // That's acceptable for edges as long as we reset dragStartTime on each move? 
       // No, standard delta is: current - initial. 
       // Current implementation: `deltaTime = time - dragStartTime`. 
       // But `dragStartTime` was set to `clip.start` (static) on mouseDown?
       // Wait, on mouseDown: `setDragStartTime(clip.start)`.
       // So `deltaTime = time - clip.start`. 
       // If `time` is the cursor time, then `time` IS roughly `clip.start` if we clicked exactly there?
       // No, `time` is cursor position. 
       
       // Let's rely on robust direct setting:
       // If left edge: New Start = time. Limit: < Old End - 0.1
       // If right edge: New End = time. Limit: > Old Start + 0.1
       
       if (textOverlays.some(t => t.id === dragClipId)) {
          setTextOverlays(prev => prev.map(t => {
             if (t.id !== dragClipId) return t;
             if (dragEdge === 'left') {
                const nStart = Math.min(t.end - 0.1, Math.max(0, time));
                return { ...t, start: nStart };
             } else {
                const nEnd = Math.max(t.start + 0.1, time);
                return { ...t, end: nEnd };
             }
          }));
       } else {
          setClips(prev => prev.map(c => {
             if (c.id !== dragClipId) return c;
             if (dragEdge === 'left') {
                const nStart = Math.min(c.end - 0.1, Math.max(0, time));
                // Adjust trimStart if video? 
                // For a simple editor, usually dragging left edge changing start implies trimming.
                // start changed by X => trimStart += X.
                // But current logic just moves start time?
                // Let's assume slide edit for now unless requested otherwise.
                return { ...c, start: nStart };
             } else {
                const nEnd = Math.max(c.start + 0.1, time);
                return { ...c, end: nEnd };
             }
          }));
       }
    }
  }, [isTimelineDragging, dragType, dragClipId, dragEdge, dragStartTime, dragOffset, clips, textOverlays, duration, zoom]);

  const handleTimelineMouseUp = () => {
    if (isTimelineDragging) {
      setIsTimelineDragging(false);
      setDragType(null);
      setDragClipId(null);
      setDragEdge(null);
      pushHistory();
    }
  };

  // Add mouse move/up listeners for TIMELINE and CANVAS dragging
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
       // Timeline Dragging
       if (isTimelineDragging) {
         handleTimelineMouseMove(e);
       }
       
       // Canvas Dragging
       if (canvasDrag) {
          const dx = e.clientX - canvasDrag.initialMouseX;
          const dy = e.clientY - canvasDrag.initialMouseY;
          
          // Container dimensions for percent calc
          // We can approximate or standardise. 
          // Since data is stored as %, we need to convert pixels to %.
          // Assuming the canvas element is the target source.
          // Getting dimensions from event target is risky if mouse moved out.
          // But we have dx/dy in pixels.
          
          // Let's assume a reference width/height based on standard 16:9 or use the refs?
          // We don't have easy access to canvasRef here in VideoEditor (it's in child).
          // But we passed onCanvasMouseDown, maybe we can assume a standard sizing?
          // Or we can rely on `previewScale`.
          
          // Better: update state with delta pixels, let renderer handle projection? 
          // No, state stores %.
          // Let's assume the preview area is roughly 800x450 or calculate from window?
          // For now, let's use a sensitivity factor or try to find the container.
          
          const container = document.querySelector('canvas'); 
          if (container) {
             const rect = container.getBoundingClientRect();
             const dXPercent = (dx / rect.width) * 100;
             const dYPercent = (dy / rect.height) * 100;
             
             const newX = canvasDrag.initialX + dXPercent;
             const newY = canvasDrag.initialY + dYPercent;
             
             if (canvasDrag.type === 'text') {
                setTextOverlays(prev => prev.map(t => 
                   t.id === canvasDrag.id ? { ...t, x: newX, y: newY } : t
                ));
             }
          }
       }
    };
    
    const handleWindowMouseUp = () => {
      if (isTimelineDragging) {
        handleTimelineMouseUp();
      }
      if (canvasDrag) {
        setCanvasDrag(null);
        pushHistory();
      }
    };

    if (isTimelineDragging || canvasDrag) {
      document.addEventListener('mousemove', handleWindowMouseMove);
      document.addEventListener('mouseup', handleWindowMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleWindowMouseMove);
        document.removeEventListener('mouseup', handleWindowMouseUp);
      };
    }
  }, [isTimelineDragging, canvasDrag, handleTimelineMouseMove]);

  const handleCanvasMouseDown = useCallback((id, type, e) => {
     let item;
     if (type === 'text') item = textOverlays.find(t => t.id === id);
     
     if (item) {
        setCanvasDrag({
           id,
           type,
           initialX: item.x,
           initialY: item.y,
           initialMouseX: e.clientX,
           initialMouseY: e.clientY
        });
        if (type === 'text') setSelectedText(item);
     }
  }, [textOverlays]);

  // Clip management
  const handleClipSelect = (clip) => {
    setSelectedClip(clip);
    setSelectedText(null);
  };

  const splitClip = () => {
    if (!selectedClip) {
      showNotification('Select a clip first', 'error');
      return;
    }

    if (currentTime <= selectedClip.start || currentTime >= selectedClip.end) {
      showNotification('Position playhead inside clip', 'error');
      return;
    }

    const splitTime = currentTime;
    
    const clip1 = {
      ...selectedClip,
      id: generateId(),
      end: splitTime,
      trimEnd: selectedClip.trimStart + (splitTime - selectedClip.start)
    };

    const clip2 = {
      ...selectedClip,
      id: generateId(),
      start: splitTime,
      trimStart: selectedClip.trimStart + (splitTime - selectedClip.start)
    };

    setClips(prev => [...prev.filter(c => c.id !== selectedClip.id), clip1, clip2]);
    setSelectedClip(null);
    pushHistory();
    showNotification('Clip split at ' + formatTime(currentTime));
  };

  const duplicateClip = () => {
    if (!selectedClip) {
      showNotification('Select a clip first', 'error');
      return;
    }
    
    const newClip = {
      ...selectedClip,
      id: generateId(),
      start: selectedClip.end + 0.5,
      end: selectedClip.end + 0.5 + (selectedClip.end - selectedClip.start)
    };
    
    setClips(prev => [...prev, newClip]);
    if (newClip.end > duration) setDuration(newClip.end + 10);
    pushHistory();
    showNotification('Clip duplicated');
  };

  const deleteClip = () => {
    if (!selectedClip && !selectedText) {
      showNotification('Select something to delete', 'error');
      return;
    }
    
    if (selectedClip) {
      setClips(prev => prev.filter(c => c.id !== selectedClip.id));
      setSelectedClip(null);
    } else if (selectedText) {
      setTextOverlays(prev => prev.filter(t => t.id !== selectedText.id));
      setSelectedText(null);
    }
    
    pushHistory();
    showNotification('Deleted');
  };

  // Transform tools - FIXED
  const applyFlip = (direction) => {
    if (!selectedClip) {
      showNotification('Select a clip first', 'error');
      return;
    }
    
    setClips(prev => prev.map(c => {
      if (c.id === selectedClip.id) {
        const transform = { ...c.transform };
        if (direction === 'horizontal') transform.flipH = !transform.flipH;
        else if (direction === 'vertical') transform.flipV = !transform.flipV;
        return { ...c, transform };
      }
      return c;
    }));
    
    setSelectedClip(prev => ({
      ...prev,
      transform: {
        ...prev.transform,
        [direction === 'horizontal' ? 'flipH' : 'flipV']: !prev.transform[direction === 'horizontal' ? 'flipH' : 'flipV']
      }
    }));
    
    pushHistory();
    showNotification(`Flipped ${direction === 'horizontal' ? 'horizontal' : 'vertical'}`);
  };

  const applyRotation = (degrees) => {
    if (!selectedClip) {
      showNotification('Select a clip first', 'error');
      return;
    }
    
    setClips(prev => prev.map(c => {
      if (c.id === selectedClip.id) {
        const newRotation = (c.transform.rotation + degrees) % 360;
        return {
          ...c,
          transform: { ...c.transform, rotation: newRotation }
        };
      }
      return c;
    }));
    
    setSelectedClip(prev => ({
      ...prev,
      transform: { ...prev.transform, rotation: (prev.transform.rotation + degrees) % 360 }
    }));
    
    pushHistory();
    showNotification(`Rotated ${degrees}°`);
  };

  // Text overlay - FIXED
  const addText = () => {
    const newText = {
      id: generateId(),
      text: 'Double click to edit',
      start: currentTime,
      end: currentTime + 5,
      x: 50,
      y: 50,
      zIndex: Math.max(0, ...clips.map(c => c.zIndex || 0), ...textOverlays.map(t => t.zIndex || 0)) + 1,
      fontSize: 48,
      color: '#ffffff',
      fontFamily: 'Arial',
      opacity: 1,
      visible: true
    };
    
    setTextOverlays(prev => [...prev, newText]);
    setSelectedText(newText);
    pushHistory();
    showNotification('Text added');
  };

  const updateText = (updatedText) => {
    setTextOverlays(prev => prev.map(t => t.id === updatedText.id ? updatedText : t));
    setSelectedText(updatedText);
    pushHistory();
    showNotification('Text updated');
  };

  const deleteText = (id) => {
    setTextOverlays(prev => prev.filter(t => t.id !== id));
    if (selectedText && selectedText.id === id) {
      setSelectedText(null);
    }
    pushHistory();
    showNotification('Text deleted');
  };

  // Filters - FIXED
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: parseFloat(value) };
    setFilters(newFilters);
    
    if (selectedClip) {
      setClips(prev => prev.map(c =>
        c.id === selectedClip.id ? { ...c, filters: newFilters } : c
      ));
      setSelectedClip(prev => ({ ...prev, filters: newFilters }));
    }
    
    pushHistory();
  };

  const resetFilters = () => {
    const defaultFilters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      grayscale: 0,
      sepia: 0
    };
    
    setFilters(defaultFilters);
    
    if (selectedClip) {
      setClips(prev => prev.map(c =>
        c.id === selectedClip.id ? { ...c, filters: defaultFilters } : c
      ));
      setSelectedClip(prev => ({ ...prev, filters: defaultFilters }));
    }
    
    pushHistory();
    showNotification('Filters reset');
  };

  // Layer management - FIXED
  const toggleLayerVisibility = (id) => {
    setLayerVisibility(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // Update clips or text overlays
    const clip = clips.find(c => c.id === id);
    if (clip) {
      setClips(prev => prev.map(c =>
        c.id === id ? { ...c, visible: !layerVisibility[id] } : c
      ));
    } else {
      const text = textOverlays.find(t => t.id === id);
      if (text) {
        setTextOverlays(prev => prev.map(t =>
          t.id === id ? { ...t, visible: !layerVisibility[id] } : t
        ));
      }
    }
    
    pushHistory();
  };

  const moveLayerUp = (id) => {
    // Find the item
    let item = clips.find(c => c.id === id);
    let isText = false;
    if (!item) {
       item = textOverlays.find(t => t.id === id);
       isText = true;
    }
    if (!item) return;
    
    const currentZ = item.zIndex || 0;
    // Find item with next highest Z
    const allItems = [...clips, ...textOverlays].sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
    const currentIndex = allItems.findIndex(i => i.id === id);
    
    if (currentIndex < allItems.length - 1) {
       const nextItem = allItems[currentIndex + 1];
       const nextZ = nextItem.zIndex || 0;
       const newCurrentZ = nextZ;
       const newNextZ = currentZ;
       // Update State
       if (isText) {
          setTextOverlays(prev => prev.map(t => t.id === id ? { ...t, zIndex: newCurrentZ } : t));
       } else {
          setClips(prev => prev.map(c => c.id === id ? { ...c, zIndex: newCurrentZ } : c));
       }
       // Update the OTHER item
       if (textOverlays.some(t => t.id === nextItem.id)) {
          setTextOverlays(prev => prev.map(t => t.id === nextItem.id ? { ...t, zIndex: newNextZ } : t));
       } else {
          setClips(prev => prev.map(c => c.id === nextItem.id ? { ...c, zIndex: newNextZ } : c));
       }
       showNotification('Layer moved up');
    }
  };

  const moveLayerDown = (id) => {
    let item = clips.find(c => c.id === id);
    let isText = false;
    if (!item) {
       item = textOverlays.find(t => t.id === id);
       isText = true;
    }
    if (!item) return;
    
    const currentZ = item.zIndex || 0;
    const allItems = [...clips, ...textOverlays].sort((a,b) => (a.zIndex || 0) - (b.zIndex || 0));
    const currentIndex = allItems.findIndex(i => i.id === id);
    
    if (currentIndex > 0) {
       const prevItem = allItems[currentIndex - 1];
       const prevZ = prevItem.zIndex || 0;
       const newCurrentZ = prevZ;
       const newPrevZ = currentZ;
      
       if (isText) {
          setTextOverlays(prev => prev.map(t => t.id === id ? { ...t, zIndex: newCurrentZ } : t));
       } else {
          setClips(prev => prev.map(c => c.id === id ? { ...c, zIndex: newCurrentZ } : c));
       }
       
       if (textOverlays.some(t => t.id === prevItem.id)) {
          setTextOverlays(prev => prev.map(t => t.id === prevItem.id ? { ...t, zIndex: newPrevZ } : t));
       } else {
          setClips(prev => prev.map(c => c.id === prevItem.id ? { ...c, zIndex: newPrevZ } : c));
       }
       showNotification('Layer moved down');
    }
  };

  const handleTimeUpdate = useCallback((newTime) => {
    setCurrentTime(newTime);
    if (newTime >= duration && isPlaying) {
      setIsPlaying(false);
    }
  }, [duration, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'Delete':
          e.preventDefault();
          deleteClip();
          break;
        case 'KeyZ':
          if (e.ctrlKey) {
            e.preventDefault();
            undo();
          }
          break;
        case 'KeyY':
          if (e.ctrlKey) {
            e.preventDefault();
            redo();
          }
          break;
        case 'KeyC':
          e.preventDefault();
          splitClip();
          break;
        case 'KeyD':
          if (e.ctrlKey) {
            e.preventDefault();
            duplicateClip();
          }
          break;
        case 'KeyT':
          e.preventDefault();
          setActiveTool('text');
          addText();
          break;
        case 'KeyV':
          e.preventDefault();
          setActiveTool('selection');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, selectedClip, selectedText, clips, textOverlays]);

  const handleExport = () => {
    setIsExporting(true);
    showNotification('Starting export...', 'info');

    const canvas = document.querySelector('canvas');
    if (!canvas) {
       showNotification('Canvas not found', 'error');
       setIsExporting(false);
       return;
    }

    try {
      const stream = canvas.captureStream(30); 
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
        setShowExportModal(false);
        setIsPlaying(false);
        handleSeek(0);
        showNotification('Export saved!');
      };
      setIsPlaying(true);
      handleSeek(0);
      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
           mediaRecorder.stop();
        }
      }, duration * 1000 + 500);

    } catch (err) {
      console.error('Export failed:', err);
      showNotification('Export failed: ' + err.message, 'error');
      setIsExporting(false);
    }
  };
  useEffect(() => {
    const newLayers = [
      ...clips.map((clip, i) => ({
        id: clip.id,
        type: clip.type,
        name: clip.name,
        visible: clip.visible !== false,
        start: clip.start,
        end: clip.end,
        zIndex: i
      })),
      ...textOverlays.map((text, i) => ({
        id: text.id,
        type: 'text',
        name: text.text.substring(0, 20) + '...',
        visible: text.visible !== false,
        start: text.start,
        end: text.end,
        zIndex: clips.length + i
      }))
    ].sort((a, b) => a.start - b.start);
    
    setLayers(newLayers);
  }, [clips, textOverlays]);

  useEffect(() => {
    if (clips.length === 0 && textOverlays.length === 0) {
       setDuration(0);
       return;
    }

    const maxEnd = Math.max(
      ...clips.map(c => c.end),
      ...textOverlays.map(t => t.end),
      0
    );
    
    setDuration(maxEnd);
  }, [clips, textOverlays]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Video Editor Pro</h1>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500 w-48"
            placeholder="Project name"
          />
        </div>
        
        <div className="text-sm font-mono text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*,audio/*,image/*"
            onChange={handleFileImport}
            className="hidden"
          />
          
          <button onClick={undo} className="p-2 hover:bg-gray-100 rounded" title="Undo (Ctrl+Z)">
            <CornerUpLeft className="w-5 h-5" />
          </button>
          <button onClick={redo} className="p-2 hover:bg-gray-100 rounded" title="Redo (Ctrl+Y)">
            <CornerUpRight className="w-5 h-5" />
          </button>
          
          <button onClick={() => setShowExportModal(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r flex flex-col flex-shrink-0">
          <div className="h-10 border-b flex">
            {['media', 'layers', 'tools'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`flex-1 text-sm font-medium ${
                  activeLeftTab === tab ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeLeftTab === 'media' && (
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center transition-colors"
                >
                  <Upload className="w-10 h-10 mb-2 text-gray-400" />
                  <span className="text-sm font-medium">Import Media</span>
                  <span className="text-xs text-gray-500 mt-1">Videos, Images, Audio</span>
                </button>

                {mediaLibrary.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No media imported yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Media Library</h4>
                    {mediaLibrary.map(media => (
                      <div
                        key={media.id}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer transition-colors border border-gray-200"
                        onClick={() => addToTimeline(media)}
                      >
                        <div className="flex items-center space-x-3">
                          {media.type === 'video' && <Film className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                          {media.type === 'audio' && <Music className="w-5 h-5 text-green-500 flex-shrink-0" />}
                          {media.type === 'image' && <ImageIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{media.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-600">{formatTime(media.duration)}</p>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
                                {media.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeLeftTab === 'layers' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Layers ({layers.length})</h3>
                  <button 
                    onClick={() => {
                      setSelectedClip(null);
                      setSelectedText(null);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear Selection
                  </button>
                </div>
                
                {layers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No layers yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                  {layers.map((layer, index) => (
                    <div 
                      key={layer.id} 
                      draggable="true"
                      onDragStart={(e) => {
                         e.dataTransfer.setData("text/plain", layer.id);
                         e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                         e.preventDefault();
                         e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                         e.preventDefault();
                         const droppedId = e.dataTransfer.getData("text/plain");
                         if (droppedId !== layer.id) {
                            const droppedItem = layers.find(l => l.id == droppedId);
                            const targetItem = layer;
                            const droppedZ = droppedItem.zIndex;
                            const targetZ = targetItem.zIndex;
                            const updateZ = (id, z) => {
                               setClips(prev => prev.map(c => c.id === id ? { ...c, zIndex: z } : c));
                               setTextOverlays(prev => prev.map(t => t.id === id ? { ...t, zIndex: z } : t));
                            };
                            
                            updateZ(droppedId, targetZ);
                            updateZ(targetItem.id, droppedZ);
                            pushHistory();
                         }
                      }}
                      className={`p-3 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        (selectedClip?.id === layer.id || selectedText?.id === layer.id) 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                      onClick={() => {
                        if (layer.type === 'text') {
                          const text = textOverlays.find(t => t.id === layer.id);
                          setSelectedText(text);
                          setSelectedClip(null);
                        } else {
                          const clip = clips.find(c => c.id === layer.id);
                          setSelectedClip(clip);
                          setSelectedText(null);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        {layer.type === 'video' && <Film className="w-4 h-4 text-blue-500" />}
                        {layer.type === 'audio' && <Music className="w-4 h-4 text-green-500" />}
                        {layer.type === 'image' && <ImageIcon className="w-4 h-4 text-yellow-500" />}
                        {layer.type === 'text' && <Type className="w-4 h-4 text-purple-500" />}
                        <div className="flex flex-col">
                          <span className="text-sm truncate max-w-[100px]">{layer.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatTime(layer.start)} - {formatTime(layer.end)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayerVisibility(layer.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title={layer.visible ? "Hide" : "Show"}
                        >
                          {layer.visible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}
            {activeLeftTab === 'tools' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTool('selection')}
                    className={`p-3 rounded-lg flex flex-col items-center space-y-1 transition-all ${
                      activeTool === 'selection' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    title="Selection Tool (V)"
                  >
                    <Move className="w-5 h-5" />
                    <span className="text-xs font-medium">Select</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTool('split');
                      splitClip();
                    }}
                    className="p-3 rounded-lg flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                    title="Split Clip (C)"
                    disabled={!selectedClip}
                  >
                    <Scissors className="w-5 h-5" />
                    <span className="text-xs font-medium">Split</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTool('crop');
                      if (selectedClip) {
                        setShowCropTool(true);
                      } else {
                        showNotification('Select a clip first', 'error');
                      }
                    }}
                    className="p-3 rounded-lg flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                    title="Crop Tool"
                    disabled={!selectedClip}
                  >
                    <Crop className="w-5 h-5" />
                    <span className="text-xs font-medium">Crop</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTool('text');
                      addText();
                    }}
                    className="p-3 rounded-lg flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                    title="Add Text (T)"
                  >
                    <Type className="w-5 h-5" />
                    <span className="text-xs font-medium">Text</span>
                  </button>

                  {/* Rotate Tool */}
                  <button
                    onClick={() => {
                      setActiveTool('rotate');
                      if (selectedClip) {
                        applyRotation(90);
                      } else {
                        showNotification('Select a clip first', 'error');
                      }
                    }}
                    className="p-3 rounded-lg flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                    title="Rotate 90°"
                    disabled={!selectedClip}
                  >
                    <RotateCw className="w-5 h-5" />
                    <span className="text-xs font-medium">Rotate</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTool('flip');
                      if (selectedClip) {
                        applyFlip('horizontal');
                      } else {
                        showNotification('Select a clip first', 'error');
                      }
                    }}
                    className="p-3 rounded-lg flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                    title="Flip Horizontal"
                    disabled={!selectedClip}
                  >
                    <FlipHorizontal className="w-5 h-5" />
                    <span className="text-xs font-medium">Flip</span>
                  </button>
                </div>

                {/* Selected Clip Actions */}
                {(selectedClip || selectedText) && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-medium mb-3">
                      {selectedClip ? 'Clip Actions' : 'Text Actions'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedClip ? (
                        <>
                          <button 
                            onClick={splitClip}
                            className="py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            Split
                          </button>
                          <button 
                            onClick={duplicateClip}
                            className="py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                          >
                            Duplicate
                          </button>
                          <button 
                            onClick={() => applyFlip('horizontal')}
                            className="py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
                          >
                            Flip H
                          </button>
                          <button 
                            onClick={() => applyFlip('vertical')}
                            className="py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
                          >
                            Flip V
                          </button>
                          <button 
                            onClick={() => applyRotation(90)}
                            className="py-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
                          >
                            Rotate 90°
                          </button>
                          <button 
                            onClick={deleteClip}
                            className="py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setShowTextEditor(true);
                            }}
                            className="py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            Edit Text
                          </button>
                          <button 
                            onClick={() => deleteText(selectedText.id)}
                            className="py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium mb-3">Timeline Controls</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs mb-1 block">Zoom: {Math.round(zoom * 100)}%</label>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                        </div>
                        <button 
                          onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs mb-1 block">Playhead: {formatTime(currentTime)}</label>
                      <input
                        type="range"
                        min="0"
                        max={duration || 60}
                        step="0.1"
                        value={currentTime}
                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                        className="w-full accent-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-4 min-h-0">
             <VideoRenderer 
               clips={clips}
               textOverlays={textOverlays}
               currentTime={currentTime}
               isPlaying={isPlaying}
               isMuted={isMuted}
               volume={volume}
               onImportClick={() => fileInputRef.current?.click()}
               onTimeUpdate={handleTimeUpdate}
               duration={duration}
               onCanvasMouseDown={handleCanvasMouseDown}
             />
          </div>

          {/* Transport Controls */}
          <div className="h-16 bg-white border-t flex items-center justify-center px-6 flex-shrink-0">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => handleSeek(currentTime - 5)} 
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Back 5 seconds"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button 
                onClick={togglePlayPause} 
                className={`p-3 rounded-full transition-all ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              
              <button 
                onClick={() => handleSeek(currentTime + 5)} 
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Forward 5 seconds"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2 ml-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-blue-500"
                  title="Volume"
                />
              </div>
              
              <div className="ml-4 flex items-center space-x-2">
                <button 
                  onClick={() => handleSeek(0)}
                  className="p-2 text-sm hover:bg-gray-100 rounded transition-colors"
                >
                  Start
                </button>
                <button 
                  onClick={() => handleSeek(duration)}
                  className="p-2 text-sm hover:bg-gray-100 rounded transition-colors"
                >
                  End
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-white border-l flex flex-col flex-shrink-0">
          <div className="h-10 border-b flex">
            {['filters', 'transform'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                className={`flex-1 text-sm font-medium ${
                  activeRightTab === tab ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Filters Panel - WORKING */}
            {activeRightTab === 'filters' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Video Filters</h3>
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Reset All
                  </button>
                </div>
                
                {[
                  { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
                  { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
                  { key: 'saturation', label: 'Saturation', min: 0, max: 200, unit: '%' },
                  { key: 'hue', label: 'Hue', min: -180, max: 180, unit: '°' },
                  { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
                  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
                  { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' }
                ].map(({ key, label, min, max, unit }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">{label}</span>
                      <span className="text-xs text-gray-600">
                        {filters[key]}{unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={key === 'blur' ? 0.1 : 1}
                      value={filters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{min}{unit}</span>
                      <span>{max}{unit}</span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const vintage = {
                          brightness: 90,
                          contrast: 110,
                          saturation: 80,
                          hue: 10,
                          blur: 0,
                          grayscale: 0,
                          sepia: 30
                        };
                        setFilters(vintage);
                        showNotification('Vintage filter applied');
                      }}
                      className="py-2 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                    >
                      Vintage
                    </button>
                    <button
                      onClick={() => {
                        const bw = {
                          brightness: 100,
                          contrast: 120,
                          saturation: 0,
                          hue: 0,
                          blur: 0,
                          grayscale: 100,
                          sepia: 0
                        };
                        setFilters(bw);
                        showNotification('Black & White filter applied');
                      }}
                      className="py-2 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
                    >
                      B&W
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Transform Panel - WORKING */}
            {activeRightTab === 'transform' && selectedClip && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Transform</h3>
                  <span className="text-xs text-gray-600">{selectedClip.name}</span>
                </div>
                
                <div className="space-y-3">
                  {/* Speed Control */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Speed</span>
                      <span>{selectedClip.speed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.25"
                      max="3"
                      step="0.05"
                      value={selectedClip.speed}
                      onChange={(e) => {
                        const newSpeed = parseFloat(e.target.value);
                        setClips(prev => prev.map(c =>
                          c.id === selectedClip.id ? { ...c, speed: newSpeed } : c
                        ));
                        setSelectedClip(prev => ({ ...prev, speed: newSpeed }));
                        pushHistory();
                      }}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.25x</span>
                      <span>1x</span>
                      <span>3x</span>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Volume</span>
                      <span>{Math.round(selectedClip.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedClip.volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setClips(prev => prev.map(c =>
                          c.id === selectedClip.id ? { ...c, volume: newVolume } : c
                        ));
                        setSelectedClip(prev => ({ ...prev, volume: newVolume }));
                        pushHistory();
                      }}
                      className="w-full accent-green-500"
                    />
                  </div>

                  {/* Rotation Controls */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-medium">Rotation</span>
                      <span>{selectedClip.transform.rotation}°</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        onClick={() => applyRotation(-90)}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        -90°
                      </button>
                      <button 
                        onClick={() => applyRotation(-45)}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        -45°
                      </button>
                      <button 
                        onClick={() => applyRotation(45)}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        +45°
                      </button>
                      <button 
                        onClick={() => applyRotation(90)}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        +90°
                      </button>
                    </div>
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={selectedClip.transform.rotation}
                        onChange={(e) => {
                          const newRotation = parseInt(e.target.value);
                          setClips(prev => prev.map(c =>
                            c.id === selectedClip.id ? { 
                              ...c, 
                              transform: { ...c.transform, rotation: newRotation } 
                            } : c
                          ));
                          setSelectedClip(prev => ({ 
                            ...prev, 
                            transform: { ...prev.transform, rotation: newRotation } 
                          }));
                          pushHistory();
                        }}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* Flip Controls */}
                  <div>
                    <div className="text-xs font-medium mb-2">Flip</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => applyFlip('horizontal')}
                        className={`py-2 rounded text-sm transition-colors ${
                          selectedClip.transform.flipH 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Flip Horizontal
                      </button>
                      <button 
                        onClick={() => applyFlip('vertical')}
                        className={`py-2 rounded text-sm transition-colors ${
                          selectedClip.transform.flipV 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        Flip Vertical
                      </button>
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div>
                    <div className="text-xs font-medium mb-2">Position</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => {
                          setClips(prev => prev.map(c =>
                            c.id === selectedClip.id ? { 
                              ...c, 
                              transform: { ...c.transform, x: c.transform.x - 5 } 
                            } : c
                          ));
                          pushHistory();
                        }}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => {
                          setClips(prev => prev.map(c =>
                            c.id === selectedClip.id ? { 
                              ...c, 
                              transform: { ...c.transform, x: 0, y: 0 } 
                            } : c
                          ));
                          pushHistory();
                        }}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        Center
                      </button>
                      <button 
                        onClick={() => {
                          setClips(prev => prev.map(c =>
                            c.id === selectedClip.id ? { 
                              ...c, 
                              transform: { ...c.transform, x: c.transform.x + 5 } 
                            } : c
                          ));
                          pushHistory();
                        }}
                        className="py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Text Properties Panel */}
            {activeRightTab === 'transform' && selectedText && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Text Properties</h3>
                  <button 
                    onClick={() => setShowTextEditor(true)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit Full
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium mb-1">Text</div>
                    <input
                      type="text"
                      value={selectedText.text}
                      onChange={(e) => {
                        setTextOverlays(prev => prev.map(t =>
                          t.id === selectedText.id ? { ...t, text: e.target.value } : t
                        ));
                        setSelectedText(prev => ({ ...prev, text: e.target.value }));
                        pushHistory();
                      }}
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Font Size</span>
                      <span>{selectedText.fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={selectedText.fontSize}
                      onChange={(e) => {
                        const newSize = parseInt(e.target.value);
                        setTextOverlays(prev => prev.map(t =>
                          t.id === selectedText.id ? { ...t, fontSize: newSize } : t
                        ));
                        setSelectedText(prev => ({ ...prev, fontSize: newSize }));
                        pushHistory();
                      }}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium mb-1">Color</div>
                    <input
                      type="color"
                      value={selectedText.color}
                      onChange={(e) => {
                        setTextOverlays(prev => prev.map(t =>
                          t.id === selectedText.id ? { ...t, color: e.target.value } : t
                        ));
                        setSelectedText(prev => ({ ...prev, color: e.target.value }));
                        pushHistory();
                      }}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">Opacity</span>
                      <span>{Math.round(selectedText.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedText.opacity}
                      onChange={(e) => {
                        const newOpacity = parseFloat(e.target.value);
                        setTextOverlays(prev => prev.map(t =>
                          t.id === selectedText.id ? { ...t, opacity: newOpacity } : t
                        ));
                        setSelectedText(prev => ({ ...prev, opacity: newOpacity }));
                        pushHistory();
                      }}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline - FIXED AND WORKING */}
      <div className="h-64 bg-white border-t flex flex-col shadow-lg z-10 flex-shrink-0">
        <div className="h-12 bg-gray-50 border-b flex items-center justify-between px-4">
          <span className="text-sm font-medium">Timeline</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
                className="p-1 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                className="p-1 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={addText}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Add Text
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Ruler - FIXED */}
        <div className="flex h-8 bg-gray-50 border-b">
           {/* Spacer for Logos */}
           <div className="w-20 border-r border-gray-200 flex-shrink-0 bg-gray-100"></div>
           
           {/* Actual Ruler */}
           <div 
             className="flex-1 relative cursor-pointer overflow-hidden" 
             ref={timelineRef}
             onMouseDown={handleTimelineMouseDown}
           >
             <div className="absolute inset-0">
               {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute top-0 h-full border-l border-gray-300" 
                   style={{ 
                     left: `${i * PIXEL_PER_SECOND * zoom}px`,
                     width: '1px'
                   }}
                 >
                   <span className="text-xs text-gray-600 ml-1 absolute top-1">{i}s</span>
                 </div>
               ))}
             </div>
             
             {/* Playhead */}
             <div 
               className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 cursor-ew-resize" 
               style={{ left: `${currentTime * PIXEL_PER_SECOND * zoom}px` }}
               onMouseDown={(e) => {
                 e.stopPropagation();
                 setIsTimelineDragging(true);
                 setDragType('playhead');
               }}
             >
               <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
             </div>
           </div>
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 overflow-auto">
          {/* Video Track */}
          <div className="flex h-16 border-b">
            <div className="w-20 bg-gray-50 border-r flex items-center justify-center flex-shrink-0">
              <Film className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 relative min-w-0" style={{ minWidth: `${duration * PIXEL_PER_SECOND * zoom}px` }}>
              {clips.filter(c => c.type === 'video' || c.type === 'image').map(clip => (
                <div
                  key={clip.id}
                  className={`absolute top-2 h-12 rounded cursor-move transition-all ${
                    selectedClip?.id === clip.id 
                      ? 'ring-2 ring-blue-400 bg-blue-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } ${clip.visible === false ? 'opacity-50' : ''}`}
                  style={{
                    left: `${clip.start * PIXEL_PER_SECOND * zoom}px`,
                    width: `${Math.max(20, (clip.end - clip.start) * PIXEL_PER_SECOND * zoom)}px`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClipSelect(clip);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      e.stopPropagation();
                      setDragType('clip');
                      setDragClipId(clip.id);
                      
                      const rect = timelineRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const clickTime = x / (PIXEL_PER_SECOND * zoom);
                      setDragOffset(clickTime - clip.start);
                      
                      const rect2 = timelineRef.current?.getBoundingClientRect();
                      if (rect2) {
                        setDragStartX(e.clientX - rect2.left);
                      }
                      handleClipSelect(clip);
                    }
                  }}
                >
                  <div className="p-2 text-white text-xs truncate flex items-center justify-between h-full">
                    <span>{clip.name}</span>
                    <div className="flex items-center space-x-1">
                      <GripVertical className="w-3 h-3 opacity-50 flex-shrink-0" />
                    </div>
                  </div>
                  
                  {/* Left resize handle */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize z-10 hover:bg-blue-300/50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragType('edge');
                      setDragClipId(clip.id);
                      setDragEdge('left');
                      setDragStartTime(clip.start);
                      handleClipSelect(clip);
                    }}
                  />
                  
                  {/* Right resize handle */}
                  <div
                    className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize z-10 hover:bg-blue-300/50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragType('edge');
                      setDragClipId(clip.id);
                      setDragEdge('right');
                      setDragStartTime(clip.end);
                      handleClipSelect(clip);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Audio Track */}
          <div className="flex h-16 border-b">
            <div className="w-20 bg-gray-50 border-r flex items-center justify-center flex-shrink-0">
              <Music className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1 relative min-w-0" style={{ minWidth: `${duration * PIXEL_PER_SECOND * zoom}px` }}>
              {clips.filter(c => c.type === 'audio').map(clip => (
                <div
                  key={clip.id}
                  className={`absolute top-2 h-12 rounded cursor-move transition-all ${
                    selectedClip?.id === clip.id 
                      ? 'ring-2 ring-green-400 bg-green-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } ${clip.visible === false ? 'opacity-50' : ''}`}
                  style={{
                    left: `${clip.start * PIXEL_PER_SECOND * zoom}px`,
                    width: `${Math.max(20, (clip.end - clip.start) * PIXEL_PER_SECOND * zoom)}px`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClipSelect(clip);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      e.stopPropagation();
                      setDragType('clip');
                      setDragClipId(clip.id);
                      
                      const rect = timelineRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const clickTime = x / (PIXEL_PER_SECOND * zoom);
                      setDragOffset(clickTime - clip.start);
                      
                      const rect2 = timelineRef.current?.getBoundingClientRect();
                      if (rect2) {
                        setDragStartX(e.clientX - rect2.left);
                      }
                      handleClipSelect(clip);
                    }
                  }}
                >
                  <div className="p-2 text-white text-xs truncate flex items-center justify-between h-full">
                    <span>{clip.name}</span>
                    <GripVertical className="w-3 h-3 opacity-50 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Text Track */}
          <div className="flex h-16">
            <div className="w-20 bg-gray-50 border-r flex items-center justify-center flex-shrink-0">
              <Type className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1 relative min-w-0" style={{ minWidth: `${duration * PIXEL_PER_SECOND * zoom}px` }}>
              {textOverlays.map(text => (
                <div
                  key={text.id}
                  className={`absolute top-2 h-12 rounded cursor-move transition-all ${
                    selectedText?.id === text.id 
                      ? 'ring-2 ring-purple-400 bg-purple-600' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  } ${text.visible === false ? 'opacity-50' : ''}`}
                  style={{
                    left: `${text.start * PIXEL_PER_SECOND * zoom}px`,
                    width: `${Math.max(20, (text.end - text.start) * PIXEL_PER_SECOND * zoom)}px`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedText(text);
                    setSelectedClip(null);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      e.stopPropagation();
                      setDragType('clip'); // Reusing 'clip' type for text dragging logic
                      setDragClipId(text.id);
                      
                      const rect = timelineRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const clickTime = x / (PIXEL_PER_SECOND * zoom);
                      setDragOffset(clickTime - text.start);
                      
                      const rect2 = timelineRef.current?.getBoundingClientRect();
                      if (rect2) {
                        setDragStartX(e.clientX - rect2.left);
                      }
                      setSelectedText(text);
                      setSelectedClip(null);
                    }
                  }}
                  onDoubleClick={() => {
                    setSelectedText(text);
                    setShowTextEditor(true);
                  }}
                >
                  <div className="p-2 text-white text-xs truncate flex items-center justify-between h-full">
                    <span>{text.text.substring(0, 20)}</span>
                    <GripVertical className="w-3 h-3 opacity-50 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTextEditor && selectedText && (
        <TextEditor
          text={selectedText}
          onUpdate={updateText}
          onDelete={deleteText}
          onClose={() => setShowTextEditor(false)}
        />
      )}

      {showCropTool && selectedClip && (
        <CropTool
          clip={selectedClip}
          onApply={(crop) => {
            setClips(prev => prev.map(c =>
              c.id === selectedClip.id ? { ...c, crop } : c
            ));
            setSelectedClip(prev => ({ ...prev, crop }));
            pushHistory();
            showNotification('Crop applied');
          }}
          onClose={() => setShowCropTool(false)}
        />
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Export Video</h2>
              <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option>MP4 (H.264)</option>
                  <option>WebM (VP9)</option>
                  <option>MOV (ProRes)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Resolution</label>
                <select className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option>1080p (1920×1080)</option>
                  <option>720p (1280×720)</option>
                  <option>4K (3840×2160)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quality</label>
                <select className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              
              <button
                onClick={handleExport}
                disabled={isExporting || clips.length === 0}
                className={`w-full py-3 text-white rounded font-medium transition-colors ${
                  isExporting || clips.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isExporting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Exporting...
                  </span>
                ) : clips.length === 0 ? (
                  'Add clips to export'
                ) : (
                  'Export Video'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
          notification.type === 'info' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
          'bg-green-100 text-green-700 border border-green-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'error' && <X className="w-4 h-4 mr-2" />}
            {notification.type === 'info' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {notification.type === 'success' && <Check className="w-4 h-4 mr-2" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoEditor;