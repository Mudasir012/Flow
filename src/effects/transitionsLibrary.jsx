// Transitions implementation with CSS animations
export const TRANSITIONS = {
  FADE: {
    id: "fade",
    name: "Fade",
    category: "Basic",
    duration: 0.5, // seconds
    easing: "ease-in-out",
    keyframes: `
      @keyframes fade-transition {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 0; }
      }
      @keyframes fade-transition-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `,
    cssOut: (duration) => ({
      animation: `fade-transition ${duration}s ease-in-out forwards`,
    }),
    cssIn: (duration) => ({
      animation: `fade-transition-in ${duration}s ease-in-out forwards`,
    }),
  },

  DISSOLVE: {
    id: "dissolve",
    name: "Dissolve",
    category: "Basic",
    duration: 0.5,
    easing: "linear",
    keyframes: `
      @keyframes dissolve {
        0% { opacity: 1; filter: blur(0px); }
        50% { opacity: 0.5; filter: blur(2px); }
        100% { opacity: 0; filter: blur(5px); }
      }
    `,
    cssOut: (duration) => ({
      animation: `dissolve ${duration}s linear forwards`,
    }),
    cssIn: (duration) => ({
      animation: `dissolve ${duration}s linear reverse forwards`,
    }),
  },

  SLIDE_LEFT: {
    id: "slide-left",
    name: "Slide Left",
    category: "Direction",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes slide-left-out {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(-100%); opacity: 0; }
      }
      @keyframes slide-left-in {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
    `,
    cssOut: (duration) => ({
      animation: `slide-left-out ${duration}s ease-in-out forwards`,
    }),
    cssIn: (duration) => ({
      animation: `slide-left-in ${duration}s ease-in-out forwards`,
    }),
  },

  SLIDE_RIGHT: {
    id: "slide-right",
    name: "Slide Right",
    category: "Direction",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes slide-right-out {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      @keyframes slide-right-in {
        0% { transform: translateX(-100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
    `,
    cssOut: (duration) => ({
      animation: `slide-right-out ${duration}s ease-in-out forwards`,
    }),
    cssIn: (duration) => ({
      animation: `slide-right-in ${duration}s ease-in-out forwards`,
    }),
  },

  SLIDE_UP: {
    id: "slide-up",
    name: "Slide Up",
    category: "Direction",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes slide-up-out {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-100%); opacity: 0; }
      }
      @keyframes slide-up-in {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `,
    cssOut: (duration) => ({
      animation: `slide-up-out ${duration}s ease-in-out forwards`,
    }),
    cssIn: (duration) => ({
      animation: `slide-up-in ${duration}s ease-in-out forwards`,
    }),
  },

  SLIDE_DOWN: {
    id: "slide-down",
    name: "Slide Down",
    category: "Direction",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes slide-down-out {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(100%); opacity: 0; }
      }
      @keyframes slide-down-in {
        0% { transform: translateY(-100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `,
    cssOut: (duration) => ({
      animation: `slide-down-out ${duration}s ease-in-out forwards`,
    }),
    cssIn: (duration) => ({
      animation: `slide-down-in ${duration}s ease-in-out forwards`,
    }),
  },

  WIPE_RIGHT: {
    id: "wipe-right",
    name: "Wipe Right",
    category: "Wipe",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes wipe-right {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `,
    cssOut: (duration) => ({
      animation: `wipe-right ${duration}s ease-in-out reverse forwards`,
    }),
    cssIn: (duration) => ({
      animation: `wipe-right ${duration}s ease-in-out forwards`,
    }),
  },

  ZOOM_IN: {
    id: "zoom-in",
    name: "Zoom In",
    category: "Zoom",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes zoom-in {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `,
    cssOut: (duration) => ({
      animation: `zoom-in ${duration}s ease-in-out reverse forwards`,
    }),
    cssIn: (duration) => ({
      animation: `zoom-in ${duration}s ease-in-out forwards`,
    }),
  },

  ZOOM_OUT: {
    id: "zoom-out",
    name: "Zoom Out",
    category: "Zoom",
    duration: 0.5,
    easing: "ease-in-out",
    keyframes: `
      @keyframes zoom-out {
        0% { transform: scale(2); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
    `,
    cssOut: (duration) => ({
      animation: `zoom-out ${duration}s ease-in-out forwards`,
    }),
    cssIn: (duration) => ({
      animation: `zoom-out ${duration}s ease-in-out reverse forwards`,
    }),
  },
};

export const getTransitionsByCategory = (category) => {
  if (category === "All") return Object.values(TRANSITIONS);
  return Object.values(TRANSITIONS).filter((t) => t.category === category);
};

export const getTransition = (transitionId) => {
  return Object.values(TRANSITIONS).find((t) => t.id === transitionId);
};

export const applyTransition = (transitionId, direction = "in", duration = 0.5) => {
  try {
    const transition = getTransition(transitionId);
    if (!transition) throw new Error(`Transition ${transitionId} not found`);

    const cssFunc = direction === "in" ? transition.cssIn : transition.cssOut;
    return cssFunc(duration);
  } catch (error) {
    console.error("Error applying transition:", error);
    return {};
  }
};
