import { useState, useRef, useEffect } from "react";

// mediaRef (optional) - if provided, hook will sync state to the HTMLMediaElement
export const useVideoPlayer = (initialDuration = 60, mediaRef = null) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekVersion, setSeekVersion] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const el = mediaRef && mediaRef.current;
    if (el) {
      const onTime = () => setCurrentTime(el.currentTime || 0);
      const onLoaded = () => {
        console.log("loadedmetadata event fired, duration:", el.duration);
        setDuration(el.duration || initialDuration);
      };
      const onPlay = () => {
        console.log("play event fired");
        setIsPlaying(true);
      };
      const onPause = () => {
        console.log("pause event fired");
        setIsPlaying(false);
      };
      const onEnded = () => {
        console.log("ended event fired");
        setIsPlaying(false);
      };

      el.addEventListener("timeupdate", onTime);
      el.addEventListener("loadedmetadata", onLoaded);
      el.addEventListener("play", onPlay);
      el.addEventListener("pause", onPause);
      el.addEventListener("ended", onEnded);

      // initialize values if element already has metadata
      if (el.readyState >= 1) {
        console.log("Video already has metadata, readyState:", el.readyState, "duration:", el.duration);
        setDuration(el.duration || initialDuration);
        setCurrentTime(el.currentTime || 0);
        setIsPlaying(!el.paused);
      }

      return () => {
        el.removeEventListener("timeupdate", onTime);
        el.removeEventListener("loadedmetadata", onLoaded);
        el.removeEventListener("play", onPlay);
        el.removeEventListener("pause", onPause);
        el.removeEventListener("ended", onEnded);
      };
    }

    // fallback: internal animation when no mediaRef provided
    if (isPlaying && !el) {
      const animate = () => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.033;
          return newTime > duration ? 0 : newTime;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, duration, mediaRef]);

  const play = async () => {
    const el = mediaRef && mediaRef.current;
    console.log("play() called, mediaRef element:", el, "paused:", el?.paused);
    if (el) {
      try {
        await el.play();
        console.log("el.play() succeeded, paused now:", el.paused);
        setIsPlaying(true);
      } catch (e) {
        console.error("el.play() failed:", e);
        // autoplay might be blocked; still update state
        setIsPlaying(true);
      }
    } else {
      console.log("No mediaRef, setting isPlaying to true (fallback mode)");
      setIsPlaying(true);
    }
  };

  const pause = () => {
    const el = mediaRef && mediaRef.current;
    console.log("pause() called, mediaRef element:", el, "paused:", el?.paused);
    if (el) {
      el.pause();
      console.log("el.pause() executed, paused now:", el.paused);
      setIsPlaying(false);
    } else {
      console.log("No mediaRef, setting isPlaying to false (fallback mode)");
      setIsPlaying(false);
    }
  };

  const stop = () => {
    const el = mediaRef && mediaRef.current;
    if (el) {
      el.pause();
      try { el.currentTime = 0; } catch (e) {}
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const seek = (time) => {
    const el = mediaRef && mediaRef.current;
    const t = Math.max(0, Math.min(duration, time));
    if (el) {
      try { el.currentTime = t; } catch (e) {}
    }
    setCurrentTime(t);
    // bump seekVersion so consumers (Preview) can tell this was an explicit seek
    setSeekVersion((v) => v + 1);
  };

  return {
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
  };
};

export const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};