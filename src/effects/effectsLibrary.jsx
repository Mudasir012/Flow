// Functional effects implementation with real CSS/Canvas filters
export const EFFECTS = {
  // Blur & Sharpen
  GAUSSIAN_BLUR: {
    id: "gaussian-blur",
    name: "Gaussian Blur",
    category: "Blur & Sharpen",
    params: [{ name: "amount", label: "Blur Amount", min: 0, max: 20, default: 5, unit: "px" }],
    apply: (canvas, params) => {
      // CSS filter approach
      return `blur(${params.amount}px)`;
    },
  },
  MOTION_BLUR: {
    id: "motion-blur",
    name: "Motion Blur",
    category: "Blur & Sharpen",
    params: [{ name: "amount", label: "Motion Amount", min: 0, max: 30, default: 10, unit: "px" }],
    apply: (canvas, params) => {
      return `blur(${params.amount}px)`;
    },
  },

  // Color Correction
  LUMETRI_COLOR: {
    id: "lumetri-color",
    name: "Lumetri Color",
    category: "Color Correction",
    params: [
      { name: "brightness", label: "Brightness", min: -100, max: 100, default: 0, unit: "%" },
      { name: "contrast", label: "Contrast", min: -100, max: 100, default: 0, unit: "%" },
      { name: "saturation", label: "Saturation", min: -100, max: 100, default: 0, unit: "%" },
    ],
    apply: (canvas, params) => {
      const brightness = 1 + params.brightness / 100;
      const contrast = 1 + params.contrast / 100;
      const saturation = 1 + params.saturation / 100;
      return `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
    },
  },

  COLOR_CORRECTION: {
    id: "color-correction",
    name: "Color Correction",
    category: "Color Correction",
    params: [
      { name: "hue", label: "Hue", min: -180, max: 180, default: 0, unit: "°" },
      { name: "saturation", label: "Saturation", min: -100, max: 100, default: 0, unit: "%" },
    ],
    apply: (canvas, params) => {
      const saturation = 1 + params.saturation / 100;
      return `hue-rotate(${params.hue}deg) saturate(${saturation})`;
    },
  },

  // Distortion
  WARP_STABILIZER: {
    id: "warp-stabilizer",
    name: "Warp Stabilizer",
    category: "Distort",
    params: [{ name: "intensity", label: "Intensity", min: 0, max: 100, default: 50, unit: "%" }],
    apply: (canvas, params) => {
      // Simulate with slight blur and scale
      return `blur(${params.intensity / 10}px)`;
    },
  },

  SCALE: {
    id: "scale",
    name: "Scale",
    category: "Distort",
    params: [{ name: "scale", label: "Scale", min: 0.5, max: 3, default: 1, unit: "x" }],
    apply: (canvas, params) => {
      return `scale(${params.scale})`;
    },
  },

  // Perspective
  DROP_SHADOW: {
    id: "drop-shadow",
    name: "Drop Shadow",
    category: "Perspective",
    params: [
      { name: "offsetX", label: "Offset X", min: -20, max: 20, default: 5, unit: "px" },
      { name: "offsetY", label: "Offset Y", min: -20, max: 20, default: 5, unit: "px" },
      { name: "blur", label: "Blur", min: 0, max: 20, default: 5, unit: "px" },
      { name: "spread", label: "Spread", min: -10, max: 10, default: 0, unit: "px" },
      { name: "opacity", label: "Opacity", min: 0, max: 1, default: 0.5, unit: "opacity" },
    ],
    apply: (canvas, params) => {
      return `drop-shadow(${params.offsetX}px ${params.offsetY}px ${params.blur}px rgba(0,0,0,${params.opacity}))`;
    },
  },

  // Opacity/Transparency
  OPACITY: {
    id: "opacity",
    name: "Opacity",
    category: "Transform",
    params: [{ name: "opacity", label: "Opacity", min: 0, max: 1, default: 1, unit: "opacity" }],
    apply: (canvas, params) => {
      return `opacity(${params.opacity})`;
    },
  },

  // Vintage/Style
  SEPIA: {
    id: "sepia",
    name: "Sepia",
    category: "Style",
    params: [{ name: "amount", label: "Sepia Amount", min: 0, max: 1, default: 0.5, unit: "amount" }],
    apply: (canvas, params) => {
      return `sepia(${params.amount})`;
    },
  },

  GRAYSCALE: {
    id: "grayscale",
    name: "Grayscale",
    category: "Style",
    params: [{ name: "amount", label: "Grayscale Amount", min: 0, max: 1, default: 1, unit: "amount" }],
    apply: (canvas, params) => {
      return `grayscale(${params.amount})`;
    },
  },

  INVERT: {
    id: "invert",
    name: "Invert",
    category: "Style",
    params: [{ name: "amount", label: "Invert Amount", min: 0, max: 1, default: 1, unit: "amount" }],
    apply: (canvas, params) => {
      return `invert(${params.amount})`;
    },
  },
};

export const getEffectsByCategory = (category) => {
  if (category === "All") return Object.values(EFFECTS);
  return Object.values(EFFECTS).filter((e) => e.category === category);
};

export const getEffect = (effectId) => {
  return Object.values(EFFECTS).find((e) => e.id === effectId);
};

export const applyEffectFilter = (effectId, params = {}) => {
  try {
    const effect = getEffect(effectId);
    if (!effect) throw new Error(`Effect ${effectId} not found`);
    
    // Merge with defaults
    const effectParams = effect.params.reduce((acc, p) => {
      acc[p.name] = params[p.name] !== undefined ? params[p.name] : p.default;
      return acc;
    }, {});

    return effect.apply(null, effectParams);
  } catch (error) {
    console.error("Error applying effect:", error);
    return "";
  }
};
