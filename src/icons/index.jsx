import React from "react";

const Icon = ({ children, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

// Playback Controls
export const PlayIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
  </Icon>
);

export const PauseIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <rect x="9" y="8" width="2" height="8" rx="1" fill="currentColor" />
    <rect x="13" y="8" width="2" height="8" rx="1" fill="currentColor" />
  </Icon>
);

export const StopIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />
  </Icon>
);

export const PrevIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <rect x="8" y="8" width="2" height="8" rx="1" fill="currentColor" />
    <path d="M16 8.5v7l-5-3.5 5-3.5z" fill="currentColor" />
  </Icon>
);

export const NextIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <rect x="14" y="8" width="2" height="8" rx="1" fill="currentColor" />
    <path d="M8 8.5v7l5-3.5-5-3.5z" fill="currentColor" />
  </Icon>
);

export const RewindIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M14 8.5v7l-4-3.5 4-3.5z" fill="currentColor" />
    <path d="M10 8.5v7l-4-3.5 4-3.5z" fill="currentColor" />
  </Icon>
);

export const FastForwardIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M10 8.5v7l4-3.5-4-3.5z" fill="currentColor" />
    <path d="M14 8.5v7l4-3.5-4-3.5z" fill="currentColor" />
  </Icon>
);

export const RepeatIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M17 2l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 5H9a4 4 0 0 0 0 8h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 22l-3-3 3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 19h11a4 4 0 0 0 0-8h-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const ShuffleIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M16 3h5v5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 20L21 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 16v5h-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 15l6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 4l5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Export & View Controls
export const ExportIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M12 3v10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8l4-4 4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const ImportIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M12 3v10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 9l-4 4-4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const FitIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M4 8V6a2 2 0 0 1 2-2h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 16v2a2 2 0 0 1-2 2h-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const FullScreenIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M8 3H5a2 2 0 0 0-2 2v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 21h3a2 2 0 0 0 2-2v-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Tools
export const SelectIcon = ({ size = 16 }) => (
  <Icon size={size}>
    {/* Cursor arrow */}
    <path
      d="M6 4L16 12L11 13L13 19L10.5 20L8.5 14.5L6 17V4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const RazorIcon = ({ size = 16 }) => (
  <Icon size={size}>
    {/* Razor blade outer shape */}
    <rect
      x="5"
      y="6"
      width="14"
      height="12"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />

    {/* Side notches */}
    <path
      d="M5 11H3.5M19 11H20.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Inner slot */}
    <rect
      x="9"
      y="10"
      width="6"
      height="4"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />

    {/* Center dot */}
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </Icon>
);

export const HandIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M12 2v8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 10a6 6 0 0 1 6 6v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2a6 6 0 0 1 6-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const TextIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M6 6h12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 6v12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 18h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const CropIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M6 2v14a2 2 0 0 0 2 2h14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 6H8a2 2 0 0 0-2 2v10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const BrushIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="9"
      cy="9"
      r="5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M13 13l8 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="21" cy="21" r="2" fill="currentColor" />
  </Icon>
);

// Edit Actions
export const UndoIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M9 7L5 11l4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 11h10a4 4 0 0 1 0 8h-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const RedoIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M15 7l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 11H9a4 4 0 0 0 0 8h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const CopyIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect
      x="9"
      y="9"
      width="12"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const PasteIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect
      x="8"
      y="6"
      width="13"
      height="15"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 6h8V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const DeleteIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M3 6h18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M19 6v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const SaveIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M7 3v5h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="8" y="13" width="8" height="7" rx="1" fill="currentColor" />
  </Icon>
);

// Settings & Interface
export const SettingsIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.36-6.36l-2.12 2.12M8.76 15.24l-2.12 2.12m12.72 0l-2.12-2.12M8.76 8.76L6.64 6.64"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const MenuIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M4 6h16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4 12h16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4 18h16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const CloseIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const CheckIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 12l3 3 5-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const InfoIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M12 16v-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </Icon>
);

export const WarningIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 9v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </Icon>
);

// File Types
export const FolderIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const VideoIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect
      x="3"
      y="6"
      width="12"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M15 10l5.5-3v10l-5.5-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const AudioIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M3 12h4l3-4v10l3-4h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const ImageIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
    <path
      d="M21 15l-4-4-6 6-4-4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const FileIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M14 2v6h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Additional Controls
export const PlusIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M12 8v8M8 12h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const MinusIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 12h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const ZoomInIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 8v6M8 11h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const ZoomOutIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 11h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const EyeIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </Icon>
);

export const EyeOffIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 2l20 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const VolumeIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M11 5L6 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 4V5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M15.54 8.46a5 5 0 0 1 0 7.07"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const VolumeOffIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M11 5L6 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 4V5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M23 9l-6 6M17 9l6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const LockIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 11V7a4 4 0 0 1 8 0v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </Icon>
);

export const UnlockIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 11V7a4 4 0 0 1 7.5-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Icon>
);

export const DownloadIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M12 3v12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 11l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const UploadIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M12 15V3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M16 7l-4-4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const ShareIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <circle
      cx="18"
      cy="5"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="6"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="18"
      cy="19"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </Icon>
);

export const LinkIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const HeartIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export const StarIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </Icon>
);

export default {
  PlayIcon,
  PauseIcon,
  StopIcon,
  PrevIcon,
  NextIcon,
  RewindIcon,
  FastForwardIcon,
  RepeatIcon,
  ShuffleIcon,
  ExportIcon,
  ImportIcon,
  FitIcon,
  FullScreenIcon,
  SelectIcon,
  RazorIcon,
  HandIcon,
  TextIcon,
  CropIcon,
  BrushIcon,
  UndoIcon,
  RedoIcon,
  CopyIcon,
  PasteIcon,
  DeleteIcon,
  SaveIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  CheckIcon,
  InfoIcon,
  WarningIcon,
  FolderIcon,
  VideoIcon,
  AudioIcon,
  ImageIcon,
  FileIcon,
  PlusIcon,
  MinusIcon,
  ZoomInIcon,
  ZoomOutIcon,
  EyeIcon,
  EyeOffIcon,
  VolumeIcon,
  VolumeOffIcon,
  LockIcon,
  UnlockIcon,
  DownloadIcon,
  UploadIcon,
  ShareIcon,
  LinkIcon,
  HeartIcon,
  StarIcon,
};
