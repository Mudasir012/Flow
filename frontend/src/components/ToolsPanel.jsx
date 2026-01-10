import React from 'react';
import { Scissors, Copy, Trash2, Move, ChevronRight, ChevronLeft, Repeat, RotateCw, Activity, GripVertical, Pen, Type, Settings } from 'lucide-react';

const ToolsPanel = ({
  selectedClip,
  trimStartValue,
  trimEndValue,
  setTrimStartValue,
  setTrimEndValue,
  onTrimApply,
  onTrimReset,
  onSplit,
  onDuplicate,
  onRippleDelete,
  activeTool,
  onToolSelect
}) => {
  const tools = [
    { key: 'selection', name: 'Selection', icon: Move, shortcut: 'V', description: 'Selects clips, move and resize clips on timeline. Default tool.' },
    { key: 'trackSelectForward', name: 'Track Select Forward', icon: ChevronRight, shortcut: 'A', description: 'Selects all clips to the right on the same track.' },
    { key: 'trackSelectBackward', name: 'Track Select Backward', icon: ChevronLeft, shortcut: 'Shift + A', description: 'Selects all clips to the left on the same track.' },
    { key: 'rippleEdit', name: 'Ripple Edit', icon: Repeat, shortcut: 'B', description: 'Trims a clip and automatically closes gaps.' },
    { key: 'rollingEdit', name: 'Rolling Edit', icon: RotateCw, shortcut: 'N', description: 'Adjusts the cut point between two clips without changing timeline length.' },
    { key: 'rateStretch', name: 'Rate Stretch', icon: Activity, shortcut: 'R', description: 'Changes playback speed of a clip by stretching/compressing duration.' },
    // Razor (split) is already implemented as Split
    { key: 'slip', name: 'Slip', icon: GripVertical, shortcut: 'Y', description: 'Changes the content inside a clip without moving it.' },
    { key: 'slide', name: 'Slide', icon: GripVertical, shortcut: 'U', description: 'Moves a clip while adjusting neighboring clips; keeps timeline length unchanged.' },
    { key: 'pen', name: 'Pen', icon: Pen, shortcut: 'P', description: 'Creates keyframes for audio, opacity and effects.' },
    { key: 'text', name: 'Text', icon: Type, shortcut: 'T', description: 'Add text overlays and position them on the preview. Click the preview to add text.' }
  ];
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white">Tools</h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {tools.map(t => {
          const Icon = t.icon;
          const isActive = activeTool === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onToolSelect && onToolSelect(t.key)}
              title={`${t.name} (${t.shortcut})`}
              className={`w-full p-2 ${isActive ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'} rounded-lg flex items-center justify-center space-x-2`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{t.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-400">{tools.find(t => t.key === activeTool)?.description || 'Select a tool'}</div>
        <button
          onClick={() => onToolSelect && onToolSelect(activeTool, true)}
          title="Tool Options"
          className="p-1 hover:bg-gray-800 rounded"
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onSplit}
          className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center space-x-2"
          disabled={!selectedClip}
        >
          <Scissors className="w-4 h-4" />
          <span className="text-sm">Split</span>
        </button>

        <button
          onClick={onDuplicate}
          className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center space-x-2"
          disabled={!selectedClip}
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm">Duplicate</span>
        </button>

        <button
          onClick={onRippleDelete}
          className="w-full p-3 bg-red-700 hover:bg-red-600 rounded-lg flex items-center justify-center space-x-2 col-span-2"
          disabled={!selectedClip}
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Ripple Delete</span>
        </button>
      </div>

      <div className="pt-2 border-t border-gray-700">
        <p className="text-xs text-gray-400">Trim Selected Clip (seconds)</p>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="number"
            min="0"
            step="0.1"
            value={trimStartValue || 0}
            onChange={(e) => setTrimStartValue(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 bg-gray-800 rounded text-sm"
            disabled={!selectedClip}
          />

          <span className="text-xs text-gray-400">to</span>

          <input
            type="number"
            min="0"
            step="0.1"
            value={trimEndValue || 0}
            onChange={(e) => setTrimEndValue(parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 bg-gray-800 rounded text-sm"
            disabled={!selectedClip}
          />

          <button
            onClick={onTrimApply}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            disabled={!selectedClip}
          >
            Apply
          </button>
        </div>

        <div className="mt-2">
          <button
            onClick={onTrimReset}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            disabled={!selectedClip}
          >
            Reset Trim
          </button>
        </div>

        {!selectedClip && <p className="text-xs text-gray-500 mt-2">Select a clip to use trim and split tools.</p>}
      </div>
    </div>
  );
};

export default ToolsPanel;
