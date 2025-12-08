// import React, { useState } from "react";
import React, { useState, useEffect, useRef } from "react";
import { FolderIcon, VideoIcon, AudioIcon, ImageIcon, DeleteIcon } from "../icons/index.jsx";
import { styles } from "../styles/constants";

export const MediaBrowser = ({ mediaItems, setMediaItems, onSelectMedia }) => {

  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    setImporting(true);
    const el = document.getElementById("mediaImporter");
    if (el) {
      el.click();
      setImporting(false);
    } else {
      setImporting(false);
    }
  };

  const handleFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setImporting(false);
      return;
    }
    if (
      !file.type.startsWith("video/") &&
      !file.type.startsWith("audio/") &&
      !file.type.startsWith("image/")
    ) {
      alert("File not supported!");
      event.target.value = "";
      setImporting(false);
      return;
    }

    const type = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("audio/")
      ? "audio"
      : "video";

    const url = URL.createObjectURL(file);

    const newItem = {
      id: Date.now(),
      name: file.name,
      type,
      duration: null,
      size: `${Math.round(file.size / 1024)} KB`,
      src: url,
    };

    // read duration for audio/video locally
    if (type === "video" || type === "audio") {
      const mediaEl = document.createElement(type === "video" ? "video" : "audio");
      mediaEl.preload = "metadata";
      mediaEl.src = url;

      const clear = () => {
        try {
          mediaEl.removeAttribute("src");
          mediaEl.load();
        } catch (e) {}
      };

      const onLoaded = () => {
        const dur = isNaN(mediaEl.duration) ? null : Math.round(mediaEl.duration);
        setMediaItems((prev) => [...prev, { ...newItem, duration: dur }]);
        clear();
      };

      mediaEl.addEventListener("loadedmetadata", onLoaded, { once: true });
      // fallback
      setTimeout(() => {
        setMediaItems((prev) => [...prev, newItem]);
        clear();
      }, 1500);
    } else {
      setMediaItems((prev) => [...prev, newItem]);
    }

    event.target.value = "";
    setImporting(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoIcon />;
      case "audio":
        return <AudioIcon />;
      case "image":
        return <ImageIcon />;
      default:
        return <VideoIcon />;
    }
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    try {
      if (item.src && item.src.startsWith && item.src.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(item.src);
        } catch (err) {}
      }
    } catch (err) {}
    setMediaItems((prev) => prev.filter((m) => m.id !== item.id));
  };

  // local-only: mediaItems are managed in parent state; no backend fetch
    const prevMapRef = useRef(new Map());

    useEffect(() => {
      // keep previous mapping of id->src so we can revoke object URLs when items are removed
      // (this effect manages revocation on unmount as well)
      const prevMap = prevMapRef.current || new Map();
      const currentMap = new Map(mediaItems.map((m) => [m.id, m.src]));

      for (const [id, src] of prevMap.entries()) {
        if (!currentMap.has(id) && src && src.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(src);
          } catch (e) {}
        }
      }

      prevMapRef.current = currentMap;
    }, [mediaItems]);

    useEffect(() => {
      // when mediaItems change, revoke object URLs for items removed
      const prev = prevMapRef.current;
      const current = new Map(mediaItems.map((m) => [m.id, m.src]));
      for (const [id, src] of prev.entries()) {
        if (!current.has(id) && src && src.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(src);
          } catch (e) {}
        }
      }
      prevMapRef.current = current;
      return () => {
        // on unmount, revoke any remaining blob URLs
        for (const [, src] of current.entries()) {
          if (src && src.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(src);
            } catch (e) {}
          }
        }
      };
    }, [mediaItems]);

  return (
    <div>
      <div style={{ padding: "8px 0", marginBottom: "8px" }}>
        <button
          style={{
            ...styles.btnPrimary,
            width: "100%",
            justifyContent: "center",
          }}
          onClick={handleImport}
          disabled={importing}
        >
          <FolderIcon />
          {"Import Media"}
        </button>
        <input
          type="file"
          style={{ display: "none" }}
          id="mediaImporter"
          onChange={handleFile}
        />
      </div>

      <div style={styles.mediaGrid}>
        {mediaItems.map((item) => (
          <div
            key={item.id}
            style={styles.mediaItem}
            onClick={() => onSelectMedia && onSelectMedia(item)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2d2d2d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#252525")
            }
          >
            <div style={styles.mediaThumbnail}>
              <button
                onClick={(e) => handleDelete(e, item)}
                title="Remove"
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "none",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <DeleteIcon size={14} />
              </button>
              {getIcon(item.type)}
              {item.duration && <div style={styles.timecode}>{item.duration}</div>}
              {!item.duration && item.size && (
                <div style={styles.timecode}>{item.size}</div>
              )}
            </div>
            <div style={styles.mediaInfo}>
              <div style={styles.mediaName}>{item.name}</div>
              <div style={styles.mediaDetails}>
                <span>{(item.type || "").toUpperCase()}</span>
                {item.size && <span>• {item.size}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};