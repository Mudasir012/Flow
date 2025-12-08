const lightStyles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f6f8fb",
    color: "#202124",
    fontFamily: 'Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
    overflow: "hidden",
    fontSize: "14px",
  },
  appHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    height: "48px",
    flexShrink: 0,
    boxShadow: "0 1px 0 rgba(60,64,67,0.08)",
  },
  appLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    fontSize: "16px",
    letterSpacing: "0.2px",
    color: "#202124",
  },
  logoIcon: {
    width: "34px",
    height: "34px",
    background: "#1a73e8",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
  },
  playbackControls: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnIcon: {
    background: "transparent",
    border: "none",
    color: "#5f6368",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.12s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "14px",
    height: "36px",
  },
  btnPrimary: {
    background: "#1a73e8",
    border: "none",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "box-shadow 0.12s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    height: "40px",
    fontWeight: "600",
    boxShadow: "0 1px 2px rgba(26,115,232,0.2)",
  },
  btnExport: {
    background: "#018786",
    border: "none",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    height: "40px",
  },
  appMain: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    minHeight: 0,
  },
  leftPanel: {
    width: "280px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e6e6e6",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    boxShadow: "inset -1px 0 0 rgba(60,64,67,0.08)",
  },
  rightPanel: {
    width: "280px",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #e6e6e6",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    boxShadow: "inset 1px 0 0 rgba(60,64,67,0.04)",
  },
  centerPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  panelTabs: {
    display: "flex",
    borderBottom: "1px solid #e6e6e6",
    backgroundColor: "transparent",
  },
  tab: {
    flex: 1,
    padding: "12px 14px",
    background: "none",
    border: "none",
    color: "#5f6368",
    cursor: "pointer",
    transition: "color 0.12s ease",
    fontSize: "13px",
    fontWeight: "500",
    letterSpacing: "0.2px",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    color: "#1a73e8",
    backgroundColor: "transparent",
    borderBottom: "2px solid #1a73e8",
  },
  panelContent: {
    flex: 1,
    padding: "14px",
    overflowY: "auto",
    minHeight: 0,
  },
  panelHeader: {
    padding: "12px 14px",
    backgroundColor: "transparent",
    borderBottom: "1px solid #f1f3f4",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: "#5f6368",
  },
  timelineContainer: {
    backgroundColor: "#0f0f10",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    display: "flex",
    flexDirection: "column",
    height: "260px",
    flexShrink: 0,
    boxShadow: "0 -1px 0 rgba(60,64,67,0.04)",
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: "1px solid #e9eef6",
    backgroundColor: "transparent",
    height: "44px",
  },
  timeline: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fbfdff",
    cursor: "crosshair",
    overflow: "auto",
  },
  playhead: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "2px",
    background: "#1a73e8",
    cursor: "ew-resize",
    zIndex: 100,
    boxShadow: "0 0 8px rgba(26,115,232,0.18)",
  },
  playheadHandle: {
    position: "absolute",
    top: "0",
    left: "-6px",
    width: "14px",
    height: "14px",
    backgroundColor: "#5a8fff",
    clipPath: "polygon(50% 100%, 0 0, 100% 0)",
    cursor: "ew-resize",
  },
  tracksContainer: {
    paddingTop: "32px",
    minWidth: "100%",
  },
  track: {
    borderBottom: "1px solid #eef3fb",
    height: "64px",
    display: "flex",
    backgroundColor: "#ffffff",
  },
  trackHeader: {
    width: "160px",
    backgroundColor: "#fbfdff",
    padding: "10px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRight: "1px solid #eef3fb",
    flexShrink: 0,
    fontSize: "13px",
    color: "#3c4043",
  },
  trackControls: {
    display: "flex",
    gap: "6px",
  },
  trackContent: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fbfdff",
    minWidth: 0,
  },
  clip: {
    position: "absolute",
    height: "76%",
    top: "12%",
    background: "#1a73e8",
    borderRadius: "6px",
    cursor: "move",
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    minWidth: "48px",
    border: "none",
    boxShadow: "0 2px 6px rgba(60,64,67,0.08)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  clipSelected: {
    boxShadow: "0 4px 12px rgba(26,115,232,0.18)",
    zIndex: 10,
  },
  clipVideo: {
    background: "linear-gradient(90deg, #1a73e8 0%, #1558c0 100%)",
  },
  clipAudio: {
    background: "linear-gradient(90deg, #018786 0%, #016d66 100%)",
    height: "60%",
  },
  timelineRuler: {
    position: "absolute",
    top: 0,
    left: "140px",
    right: 0,
    height: "36px",
    background: "transparent",
    display: "flex",
    borderBottom: "1px solid #eef3fb",
    zIndex: 50,
  },
  previewContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "transparent",
    minHeight: 0,
  },
  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "1px solid #eef3fb",
    backgroundColor: "transparent",
    height: "56px",
  },
  previewContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(10,10,12,0.55)",
    position: "relative",
    minHeight: 0,
  },
  previewCanvas: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    boxShadow: "0 6px 18px rgba(60,64,67,0.08)",
    borderRadius: "6px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #e6e6e6",
    height: "56px",
    flexShrink: 0,
  },
  toolbarSection: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  toolBtn: {
    background: "transparent",
    border: "none",
    color: "#5f6368",
    padding: "8px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.12s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "36px",
    width: "36px",
  },
  toolBtnActive: {
    backgroundColor: "rgba(26,115,232,0.08)",
    color: "#1a73e8",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "8px",
    backgroundColor: "transparent",
  },
  mediaItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    transition: "background 0.12s ease",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(60,64,67,0.06)",
  },
  mediaThumbnail: {
    width: "72px",
    height: "54px",
    backgroundColor: "#f1f3f4",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    position: "relative",
    marginRight: "12px",
    flexShrink: 0,
    border: "1px solid #eef3fb",
  },
  mediaInfo: {
    flex: 1,
    minWidth: 0,
  },
  mediaName: {
    fontSize: "13px",
    color: "#202124",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "600",
  },
  mediaDetails: {
    fontSize: "12px",
    color: "#5f6368",
    display: "flex",
    gap: "8px",
  },
  timecode: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    background: "rgba(0,0,0,0.6)",
    color: "#ffffff",
    fontSize: "11px",
    padding: "4px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontWeight: "600",
  },
  propertiesPanel: {
    height: "100%",
    overflowY: "auto",
  },
  panelPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#555555",
  },
  propertiesSection: {
    marginBottom: "20px",
    padding: "0 12px",
  },
  sectionTitle: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#888888",
    marginBottom: "10px",
    fontWeight: "600",
  },
  propertyGroup: {
    display: "grid",
    gap: "10px",
  },
  property: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  propertyLabel: {
    fontSize: "12px",
    color: "#999999",
    minWidth: "80px",
  },
  input: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#d4d4d4",
    padding: "5px 8px",
    borderRadius: "3px",
    fontSize: "12px",
    width: "70px",
    outline: "none",
  },
  slider: {
    flex: 1,
    height: "3px",
    borderRadius: "3px",
    background: "#3a3a3a",
    outline: "none",
    cursor: "pointer",
  },
  select: {
    background: "#323232",
    border: "1px solid #2a2a2a",
    color: "#d4d4d4",
    padding: "5px 8px",
    borderRadius: "3px",
    fontSize: "12px",
    cursor: "pointer",
    outline: "none",
  },
  effectItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderRadius: "4px",
    cursor: "grab",
    marginBottom: "2px",
    transition: "background 0.15s ease",
    backgroundColor: "#252525",
    border: "1px solid transparent",
  },
  effectIcon: {
    width: "36px",
    height: "36px",
    backgroundColor: "#1a1a1a",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
    flexShrink: 0,
    border: "1px solid #2a2a2a",
  },
  categoryBtn: {
    background: "#323232",
    border: "1px solid #2a2a2a",
    color: "#888888",
    padding: "5px 12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "11px",
    transition: "all 0.15s ease",
    fontWeight: "500",
  },
  categoryBtnActive: {
    background: "#5a8fff",
    color: "#ffffff",
    borderColor: "#4a7fef",
  },
};

// dark theme overrides - Apple-style glassmorphism
const darkStyles = JSON.parse(JSON.stringify(lightStyles));

// Apple glass effect background
darkStyles.app.backgroundColor = "#1c1c1e";
darkStyles.app.color = "#f5f5f7";
darkStyles.app.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

// Frosted glass header
darkStyles.appHeader.backgroundColor = "rgba(28, 28, 30, 0.7)";
darkStyles.appHeader.backdropFilter = "blur(40px) saturate(180%)";
darkStyles.appHeader.WebkitBackdropFilter = "blur(40px) saturate(180%)";
darkStyles.appHeader.borderBottom = "1px solid rgba(255,255,255,0.1)";
darkStyles.appHeader.boxShadow = "0 1px 0 rgba(255,255,255,0.05)";

darkStyles.btnIcon.color = "#e5e5e7";
darkStyles.btnIcon.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";

// Apple blue accent
darkStyles.btnPrimary.background = "linear-gradient(180deg, #0a84ff 0%, #0070e0 100%)";
darkStyles.btnPrimary.boxShadow = "0 2px 8px rgba(10, 132, 255, 0.3)";
darkStyles.btnPrimary.border = "1px solid rgba(255,255,255,0.1)";

darkStyles.btnExport.background = "linear-gradient(180deg, #32d74b 0%, #2bc940 100%)";
darkStyles.btnExport.boxShadow = "0 2px 8px rgba(50, 215, 75, 0.3)";
darkStyles.btnExport.border = "1px solid rgba(255,255,255,0.1)";

// Translucent glass panels
darkStyles.leftPanel.backgroundColor = "rgba(28, 28, 30, 0.6)";
darkStyles.leftPanel.backdropFilter = "blur(60px) saturate(180%)";
darkStyles.leftPanel.WebkitBackdropFilter = "blur(60px) saturate(180%)";
darkStyles.leftPanel.borderRight = "1px solid rgba(255,255,255,0.08)";
darkStyles.leftPanel.boxShadow = "inset -1px 0 0 rgba(255,255,255,0.03)";

darkStyles.rightPanel.backgroundColor = "rgba(28, 28, 30, 0.6)";
darkStyles.rightPanel.backdropFilter = "blur(60px) saturate(180%)";
darkStyles.rightPanel.WebkitBackdropFilter = "blur(60px) saturate(180%)";
darkStyles.rightPanel.borderLeft = "1px solid rgba(255,255,255,0.08)";
darkStyles.rightPanel.boxShadow = "inset 1px 0 0 rgba(255,255,255,0.03)";

// Timeline glass effect
darkStyles.timeline.backgroundColor = "rgba(20, 20, 22, 0.5)";
darkStyles.timeline.backdropFilter = "blur(40px) saturate(150%)";
darkStyles.timeline.WebkitBackdropFilter = "blur(40px) saturate(150%)";

darkStyles.timelineContainer.backgroundColor = "rgba(28, 28, 30, 0.7)";
darkStyles.timelineContainer.backdropFilter = "blur(40px) saturate(180%)";
darkStyles.timelineContainer.WebkitBackdropFilter = "blur(40px) saturate(180%)";
darkStyles.timelineContainer.borderTop = "1px solid rgba(255,255,255,0.1)";
darkStyles.timelineContainer.boxShadow = "0 -1px 0 rgba(255,255,255,0.05)";

darkStyles.trackHeader.backgroundColor = "rgba(30, 30, 32, 0.6)";
darkStyles.trackHeader.backdropFilter = "blur(20px)";
darkStyles.trackHeader.WebkitBackdropFilter = "blur(20px)";
darkStyles.trackHeader.borderRight = "1px solid rgba(255,255,255,0.06)";

darkStyles.trackContent.backgroundColor = "rgba(20, 20, 22, 0.3)";

// Frosted glass media items
darkStyles.mediaItem.backgroundColor = "rgba(44, 44, 46, 0.6)";
darkStyles.mediaItem.backdropFilter = "blur(30px) saturate(160%)";
darkStyles.mediaItem.WebkitBackdropFilter = "blur(30px) saturate(160%)";
darkStyles.mediaItem.boxShadow = "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
darkStyles.mediaItem.border = "1px solid rgba(255,255,255,0.08)";

darkStyles.mediaThumbnail.backgroundColor = "rgba(30, 30, 32, 0.8)";
darkStyles.mediaThumbnail.backdropFilter = "blur(20px)";
darkStyles.mediaThumbnail.WebkitBackdropFilter = "blur(20px)";
darkStyles.mediaThumbnail.border = "1px solid rgba(255,255,255,0.1)";

darkStyles.timecode.background = "rgba(10, 10, 12, 0.8)";
darkStyles.timecode.backdropFilter = "blur(20px)";
darkStyles.timecode.WebkitBackdropFilter = "blur(20px)";
darkStyles.timecode.border = "1px solid rgba(255,255,255,0.15)";

// Apple-style clips with glass effect
darkStyles.clip.background = "linear-gradient(135deg, rgba(10, 132, 255, 0.9) 0%, rgba(0, 112, 224, 0.9) 100%)";
darkStyles.clip.backdropFilter = "blur(20px) saturate(180%)";
darkStyles.clip.WebkitBackdropFilter = "blur(20px) saturate(180%)";
darkStyles.clip.boxShadow = "0 4px 16px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
darkStyles.clip.border = "1px solid rgba(255,255,255,0.15)";

darkStyles.clipVideo.background = "linear-gradient(135deg, rgba(10, 132, 255, 0.85) 0%, rgba(0, 92, 195, 0.85) 100%)";
darkStyles.clipVideo.backdropFilter = "blur(30px) saturate(180%)";
darkStyles.clipVideo.WebkitBackdropFilter = "blur(30px) saturate(180%)";

darkStyles.clipAudio.background = "linear-gradient(135deg, rgba(50, 215, 75, 0.85) 0%, rgba(43, 201, 64, 0.85) 100%)";
darkStyles.clipAudio.backdropFilter = "blur(30px) saturate(180%)";
darkStyles.clipAudio.WebkitBackdropFilter = "blur(30px) saturate(180%)";

// Playhead with glow
darkStyles.playhead.background = "#0a84ff";
darkStyles.playhead.boxShadow = "0 0 20px rgba(10, 132, 255, 0.6), 0 0 40px rgba(10, 132, 255, 0.3)";

darkStyles.playheadHandle.backgroundColor = "#0a84ff";
darkStyles.playheadHandle.boxShadow = "0 0 10px rgba(10, 132, 255, 0.8)";

darkStyles.previewContainer.backgroundColor = "rgba(28, 28, 30, 0.5)";
darkStyles.previewContainer.backdropFilter = "blur(40px)";
darkStyles.previewContainer.WebkitBackdropFilter = "blur(40px)";

darkStyles.previewContent.background = "rgba(15, 15, 17, 0.6)";
darkStyles.previewContent.backdropFilter = "blur(30px)";
darkStyles.previewContent.WebkitBackdropFilter = "blur(30px)";

darkStyles.previewCanvas.boxShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)";

// Toolbar glass effect
darkStyles.toolbar.backgroundColor = "rgba(28, 28, 30, 0.7)";
darkStyles.toolbar.backdropFilter = "blur(40px) saturate(180%)";
darkStyles.toolbar.WebkitBackdropFilter = "blur(40px) saturate(180%)";
darkStyles.toolbar.borderTop = "1px solid rgba(255,255,255,0.1)";

darkStyles.toolBtn.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
darkStyles.toolBtnActive.backgroundColor = "rgba(10, 132, 255, 0.2)";
darkStyles.toolBtnActive.color = "#0a84ff";
darkStyles.toolBtnActive.boxShadow = "inset 0 0 0 1px rgba(10, 132, 255, 0.4)";

// Panel headers with subtle glass
darkStyles.panelHeader.backgroundColor = "rgba(28, 28, 30, 0.4)";
darkStyles.panelHeader.backdropFilter = "blur(20px)";
darkStyles.panelHeader.WebkitBackdropFilter = "blur(20px)";
darkStyles.panelHeader.borderBottom = "1px solid rgba(255,255,255,0.06)";

darkStyles.tab.color = "#98989d";
darkStyles.tabActive.color = "#0a84ff";
darkStyles.tabActive.backgroundColor = "rgba(10, 132, 255, 0.1)";
darkStyles.tabActive.borderBottom = "2px solid #0a84ff";
export const styles = JSON.parse(JSON.stringify(darkStyles));

export default styles;