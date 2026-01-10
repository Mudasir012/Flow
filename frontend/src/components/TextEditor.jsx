import React, { useState, useRef, useEffect } from 'react';
import { Type, X, Check, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';

const TextEditor = ({ text, onUpdate, onClose, onDelete }) => {
    const [editedText, setEditedText] = useState(text);
    const [fontSize, setFontSize] = useState(text.fontSize || 48);
    const [color, setColor] = useState(text.color || '#ffffff');
    const [fontFamily, setFontFamily] = useState(text.fontFamily || 'Arial');
    const [fontWeight, setFontWeight] = useState(text.fontWeight || 'normal');
    const [textAlign, setTextAlign] = useState(text.textAlign || 'center');
    const [x, setX] = useState(text.x || 50);
    const [y, setY] = useState(text.y || 50);
    const [backgroundColor, setBackgroundColor] = useState(text.backgroundColor || 'transparent');
    const [opacity, setOpacity] = useState(text.opacity || 1);
    const [animation, setAnimation] = useState(text.animation || 'none');
    const [duration, setDuration] = useState((text.end && text.start) ? Math.max(0.1, text.end - text.start) : 3);

    const fonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
        'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact',
        'Trebuchet MS', 'Arial Black', 'Lucida Console'
    ];

    const animations = [
        { id: 'none', name: 'None' },
        { id: 'fadeIn', name: 'Fade In' },
        { id: 'fadeOut', name: 'Fade Out' },
        { id: 'slideLeft', name: 'Slide from Left' },
        { id: 'slideRight', name: 'Slide from Right' },
        { id: 'slideUp', name: 'Slide from Bottom' },
        { id: 'slideDown', name: 'Slide from Top' },
        { id: 'zoom', name: 'Zoom In' },
        { id: 'bounce', name: 'Bounce' },
        { id: 'typewriter', name: 'Typewriter' }
    ];

    const handleSave = () => {
        onUpdate({
            ...text,
            text: editedText.text,
            fontSize,
            color,
            fontFamily,
            fontWeight,
            textAlign,
            x,
            y,
            backgroundColor,
            opacity,
            animation,
            start: editedText.start || 0,
            end: (editedText.start || 0) + duration
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <Type className="w-6 h-6" />
                        <span>Edit Text</span>
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Check className="w-5 h-5" />
                            <span>Save</span>
                        </button>
                        {onDelete && (
                            <button
                                onClick={() => { onDelete(text.id); onClose(); }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="bg-black rounded-xl p-8 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                        <div
                            style={{
                                fontSize: `${fontSize}px`,
                                color,
                                fontFamily,
                                fontWeight,
                                textAlign,
                                backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined,
                                opacity,
                                padding: backgroundColor !== 'transparent' ? '10px 20px' : 0,
                                borderRadius: backgroundColor !== 'transparent' ? '8px' : 0,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                            }}
                        >
                            {editedText.text || 'Your text here'}
                        </div>
                    </div>

                    {/* Text Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Text Content</label>
                        <textarea
                            value={editedText.text}
                            onChange={(e) => setEditedText({ ...editedText, text: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                            rows={3}
                            placeholder="Enter your text..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Start Time (s)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={editedText.start}
                                onChange={(e) => setEditedText({ ...editedText, start: Math.max(0, parseFloat(e.target.value) || 0) })}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (s)</label>
                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={duration}
                                onChange={(e) => setDuration(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Font Family */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Font</label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                {fonts.map(font => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Font Size: {fontSize}px
                            </label>
                            <input
                                type="range"
                                min="12"
                                max="200"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Text Color */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Text Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-16 h-12 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Background Color */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Background</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={backgroundColor !== 'transparent' ? backgroundColor : '#000000'}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-16 h-12 rounded cursor-pointer"
                                />
                                <select
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="transparent">Transparent</option>
                                    <option value="#000000">Black</option>
                                    <option value="#ffffff">White</option>
                                    <option value="#ff0000">Red</option>
                                    <option value="#00ff00">Green</option>
                                    <option value="#0000ff">Blue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Font Style */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Font Style</label>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${fontWeight === 'bold' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                                    }`}
                            >
                                <Bold className="w-5 h-5" />
                                <span>Bold</span>
                            </button>
                        </div>
                    </div>

                    {/* Text Alignment */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Alignment</label>
                        <div className="flex items-center space-x-2">
                            {[
                                { value: 'left', icon: AlignLeft },
                                { value: 'center', icon: AlignCenter },
                                { value: 'right', icon: AlignRight }
                            ].map(({ value, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => setTextAlign(value)}
                                    className={`px-4 py-2 rounded-lg flex items-center transition-colors ${textAlign === value ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Horizontal Position: {x}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={x}
                                onChange={(e) => setX(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Vertical Position: {y}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={y}
                                onChange={(e) => setY(parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Opacity */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Opacity: {(opacity * 100).toFixed(0)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Animation */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Animation</label>
                        <select
                            value={animation}
                            onChange={(e) => setAnimation(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                            {animations.map(anim => (
                                <option key={anim.id} value={anim.id}>
                                    {anim.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextEditor;
