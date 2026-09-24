import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Heart,
  Music2,
} from "lucide-react";
import { tracks } from "../data/profile";
import "../assets/styles/MediaPlayer.css";
import spotifyDoodleDark from "../assets/webp/spotify-doodle-dark.webp";
import spotifyDoodleLight from "../assets/webp/spotify-doodle-light.webp";
import { useTheme } from "../theme/ThemeProvider";
import { Particles } from "@/registry/magicui/particles";
import WakeSlider from "./WakeSlider";
import RippleDistortion from "./RippleDistortion";

// Helper to convert "3:09" -> seconds
function parseDuration(timeStr) {
  if (!timeStr) return 189;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 189;
}

// Helper to format seconds -> "M:SS"
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Exponential Inertial 3D Card FLIP Variants
const cardFlipVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 36 : -36,
    rotateY: direction > 0 ? 12 : -12,
    scale: 0.95,
    opacity: 0,
    filter: "blur(4px)",
    transformPerspective: 1200,
    zIndex: 2,
  }),
  center: {
    x: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transformPerspective: 1200,
    zIndex: 1,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 25,
      mass: 0.85,
      restSpeed: 0.05,
      restDelta: 0.001,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -32 : 32,
    rotateY: direction > 0 ? -12 : 12,
    scale: 0.95,
    opacity: 0,
    filter: "blur(4px)",
    transformPerspective: 1200,
    zIndex: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1], // Exponential deceleration curve
    },
  }),
};

export default function MediaPlayer({ className = "", id = "music-player" }) {
  const { resolved } = useTheme();
  const color = resolved === "dark" ? "#ffffff" : "#000000";

  const [viewMode, setViewMode] = useState("player"); // "player" | "spotify"
  const [direction, setDirection] = useState(1); // 1 = forward (to spotify), -1 = backward (to player)
  const audioRef = useRef(null);
  const volumeWidgetRef = useRef(null);

  const switchViewMode = (newMode) => {
    if (newMode === viewMode) return;
    setDirection(newMode === "spotify" ? 1 : -1);
    setViewMode(newMode);
    if (newMode === "spotify" && audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [prevVolume, setPrevVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [realDuration, setRealDuration] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  // Auto-close volume slider on touch devices after 3.5s of inactivity
  useEffect(() => {
    if (!isVolumeOpen || isVolumeDragging) return;
    const timer = setTimeout(() => {
      setIsVolumeOpen(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isVolumeOpen, isVolumeDragging, volume]);

  // Tap/click outside to hide volume capsule
  useEffect(() => {
    if (!isVolumeOpen) return;
    const handleOutsidePointer = (e) => {
      if (volumeWidgetRef.current && !volumeWidgetRef.current.contains(e.target)) {
        if (!isVolumeDragging) {
          setIsVolumeOpen(false);
        }
      }
    };
    window.addEventListener("pointerdown", handleOutsidePointer);
    return () => window.removeEventListener("pointerdown", handleOutsidePointer);
  }, [isVolumeOpen, isVolumeDragging]);

  const currentTrack = tracks[trackIndex] || tracks[0];
  const totalDuration = realDuration || parseDuration(currentTrack.duration);

  const isInitialMount = useRef(true);

  // Sync audio source when track changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.audio || currentTrack.src;
    setCurrentTime(0);
    setRealDuration(null);
    if (isPlaying && viewMode === "player") {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked on track switch:", err);
        setIsPlaying(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  // Volume & mute control
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = volume === 0;
  }, [volume]);

  // Loop control
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = isLoop;
  }, [isLoop]);

  // Stop audio on unmount
  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
        audioEl.src = "";
      }
    };
  }, []);

  // Global drag release listener
  useEffect(() => {
    if (!isDragging && !isVolumeDragging) return;
    const handleMouseUp = () => {
      if (isDragging && audioRef.current) {
        audioRef.current.currentTime = currentTime;
      }
      setIsDragging(false);
      setIsVolumeDragging(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, isVolumeDragging, currentTime]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Playback prevented:", err);
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * tracks.length);
      if (nextIdx === trackIndex && tracks.length > 1) {
        nextIdx = (trackIndex + 1) % tracks.length;
      }
    } else {
      nextIdx = (trackIndex + 1) % tracks.length;
    }
    setTrackIndex(nextIdx);
    setCurrentTime(0);
    setRealDuration(null);
  };

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setCurrentTime(0);
      setRealDuration(null);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.85);
    }
  };

  const handleVolumeClick = (e) => {
    e?.stopPropagation?.();
    if (volume === 0) {
      setVolume(prevVolume || 0.85);
      setIsVolumeOpen(true);
      return;
    }
    if (!isVolumeOpen) {
      setIsVolumeOpen(true);
      return;
    }
    toggleMute();
  };

  const handleSeekChange = (e) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current && !isDragging) {
      audioRef.current.currentTime = val;
    }
  };

  const seekProgress = Math.min(100, Math.max(0, (currentTime / (totalDuration || 1)) * 100));

  return (
    <div id={id} className={`spotify-music-card w-full ${className}`}>
      {/* Native HTML5 Audio Element for Real Music Streaming */}
      <audio
        ref={audioRef}
        src={currentTrack.audio || currentTrack.src}
        preload="metadata"
        onTimeUpdate={() => {
          if (!isDragging && audioRef.current) {
            setCurrentTime(Math.floor(audioRef.current.currentTime));
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration && !isNaN(audioRef.current.duration)) {
            setRealDuration(Math.round(audioRef.current.duration));
          }
        }}
        onEnded={() => {
          if (!isLoop) {
            handleNext();
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <motion.div
        layout
        className="app-container"
        transition={{
          layout: {
            type: "spring",
            stiffness: 250,
            damping: 28,
            mass: 0.85,
          },
        }}
      >
        {/* Specular Light Sweep Effect during Flip */}
        <AnimatePresence>
          <motion.div
            key={`sheen-${viewMode}`}
            initial={{ opacity: 0.7, x: direction > 0 ? "-120%" : "120%", skewX: -20 }}
            animate={{ opacity: 0, x: direction > 0 ? "120%" : "-120%", skewX: -20 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="card-flip-sheen"
            aria-hidden="true"
          />
        </AnimatePresence>

        {/* Top-Right: Smooth Inertial Player to Spotify Mode Switcher */}
        <motion.div layout="position" className="mode-switcher-top">
          <button
            type="button"
            onClick={() => switchViewMode("player")}
            className={`mode-tab-btn ${viewMode === "player" ? "is-active" : ""}`}
          >
            {viewMode === "player" && (
              <motion.div
                layoutId="activeTabBadge"
                className="active-pill-bg"
                transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.7 }}
              />
            )}
            <Music2 className="h-3 w-3 relative z-10" />
            <span className="relative z-10">Player</span>
          </button>
          <button
            type="button"
            onClick={() => switchViewMode("spotify")}
            className={`mode-tab-btn ${viewMode === "spotify" ? "is-active" : ""}`}
          >
            {viewMode === "spotify" && (
              <motion.div
                layoutId="activeTabBadge"
                className="active-pill-bg spotify-active"
                transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.7 }}
              />
            )}
            <svg className="h-3 w-3 fill-current relative z-10" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span className="relative z-10">Spotify</span>
          </button>
        </motion.div>

        {/* Exponential Shared Layout & 3D Card FLIP Transition */}
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          {viewMode === "player" ? (
            <motion.div
              key="player-view"
              custom={direction}
              variants={cardFlipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="player-view-wrap"
            >
              {/* Top-Left: Volume Overlay directly over Artwork (Dedicated ONLY to Player) */}
              <div
                ref={volumeWidgetRef}
                className={`volume-widget-top ${isVolumeDragging ? "is-dragging" : ""} ${isVolumeOpen ? "is-open" : ""}`}
                onMouseEnter={() => setIsVolumeOpen(true)}
                onMouseLeave={() => {
                  if (!isVolumeDragging) setIsVolumeOpen(false);
                }}
                onClick={(e) => {
                  if (!isVolumeOpen) {
                    e.stopPropagation();
                    setIsVolumeOpen(true);
                  }
                }}
              >
                <motion.button
                  id="muteBtn"
                  type="button"
                  onClick={handleVolumeClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.88, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                  aria-label={volume === 0 ? "Unmute" : "Mute"}
                  className="volume-widget-btn"
                >
                  {volume === 0 ? (
                    <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-current" />
                  )}
                </motion.button>
                <div className="volume-widget-slider-box">
                  <WakeSlider
                    value={Math.round(volume * 100)}
                    onChange={(val) => setVolume(val / 100)}
                    onDragStart={() => setIsVolumeDragging(true)}
                    onDragEnd={() => setIsVolumeDragging(false)}
                    min={0}
                    max={100}
                    step={1}
                    bars={12}
                    height={18}
                    restHeight={5}
                    gap={2.2}
                    fillColor={resolved === "light" ? "#16181f" : "#f5f5f5"}
                    trackColor={
                      resolved === "light"
                        ? "rgba(22, 24, 31, 0.2)"
                        : "rgba(255, 255, 255, 0.22)"
                    }
                    crestColor={resolved === "light" ? "#0d9488" : "#14b8a6"}
                    sensitivity={2}
                    reach={3.5}
                    skew={1}
                    glide={0.6}
                    smoothing={100}
                    showValue={false}
                    ariaLabel="Volume slider"
                  />
                </div>
              </div>

              {/* Artwork (Extends fully to top of card) */}
              <div className="album-art-wrap">
                <RippleDistortion
                  key={currentTrack.id || currentTrack.title}
                  src={currentTrack.coverMedium || currentTrack.cover}
                  brushSize={40}
                  strength={0.185}
                  swirl={0.5}
                  rings={0}
                  grayscale={false}
                  spread={3}
                  fade={3}
                  spacing={1}
                  dispersion={0}
                  glint={0}
                  tint="#a855f7"
                  tintAmount={0}
                  highlightColor="#ffffff"
                  trigger="hover"
                  clickStrength={2}
                  quality="high"
                  enabled
                  className="w-full h-full"
                />
                <div id="fade" />
              </div>

              {/* Main Controls Deck */}
              <div id="uiWrap">
                {/* Track Info */}
                <div className="track-info">
                  <div id="trackTitle" className="truncate px-2">
                    {currentTrack.title}
                  </div>
                  <div id="bandName" className="truncate">
                    {currentTrack.artist}
                  </div>
                  <motion.button
                    id="likeBtn"
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.82, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                    aria-label={isLiked ? "Unlike track" : "Like track"}
                    className="like-btn"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        isLiked
                          ? "fill-[#14b8a6] text-[#14b8a6] drop-shadow-[0_0_8px_rgba(20,184,166,0.7)]"
                          : "text-white/60 hover:text-white"
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Seek Bar with Timestamps (0:00 on left, 3:09 on right above bar) */}
                <div className="seek-section">
                  <div className="seek-timestamps">
                    <span id="currentTime">{formatTime(currentTime)}</span>
                    <span id="trackTime">{formatTime(totalDuration)}</span>
                  </div>

                  <div className={`seek-bar-track-wrap ${isDragging ? "is-dragging" : ""}`}>
                    <input
                      type="range"
                      id="seekSlider"
                      min="0"
                      max={totalDuration}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeekChange}
                      onMouseDown={() => setIsDragging(true)}
                      onTouchStart={() => setIsDragging(true)}
                      aria-label="Seek track position"
                    />
                    <div className="seek-bar-bg" />
                    <div
                      id="seekIndicator"
                      className="seek-bar-fill"
                      style={{ width: `${seekProgress}%` }}
                    />
                    <div
                      className="seek-bar-thumb"
                      style={{ left: `${seekProgress}%` }}
                    />
                  </div>
                </div>

                {/* Controls Row with Inertial Button Pressing */}
                <div className="playSkip">
                  <motion.button
                    id="loopBtn"
                    type="button"
                    onClick={() => setIsLoop(!isLoop)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.82, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                    className={isLoop ? "active" : ""}
                    title={isLoop ? "Loop active" : "Loop off"}
                    aria-label="Toggle repeat"
                  >
                    <Repeat className="h-4 w-4" />
                  </motion.button>

                  <motion.button
                    id="prevBtn"
                    type="button"
                    className="neumorph-btn"
                    onClick={handlePrev}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.88, transition: { type: "spring", stiffness: 500, damping: 18 } }}
                    aria-label="Previous track"
                  >
                    <SkipBack className="h-4 w-4 fill-current" />
                  </motion.button>

                  <motion.button
                    id="playPauseBtn"
                    type="button"
                    className="neumorph-btn play-pause-large"
                    onClick={togglePlay}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.90, transition: { type: "spring", stiffness: 500, damping: 18 } }}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-6 w-6 fill-current translate-x-0.5" />
                    )}
                  </motion.button>

                  <motion.button
                    id="nextBtn"
                    type="button"
                    className="neumorph-btn"
                    onClick={handleNext}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.88, transition: { type: "spring", stiffness: 500, damping: 18 } }}
                    aria-label="Next track"
                  >
                    <SkipForward className="h-4 w-4 fill-current" />
                  </motion.button>

                  <motion.button
                    id="shuffleBtn"
                    type="button"
                    onClick={() => setIsShuffle(!isShuffle)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.82, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                    className={isShuffle ? "active" : ""}
                    title={isShuffle ? "Shuffle active" : "Shuffle off"}
                    aria-label="Toggle shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="spotify-view"
              custom={direction}
              variants={cardFlipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="spotify-embed-wrap"
            >
              {/* Spotify Live Status: Clean format matching bottom style (blinking green dot + text, no pill container) */}
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                className="spotify-live-status-top"
              >
                <span className="live-beacon">
                  <span className="live-beacon-ping" />
                  <span className="live-beacon-core" />
                </span>
                <span className="live-status-label">Spotify is live</span>
              </motion.div>

              <div className="spotify-embed-card">
                <iframe
                  data-testid="embed-iframe"
                  className="spotify-embed-iframe"
                  src="https://open.spotify.com/embed/playlist/1jfLDmuldcs3bbQ0ofeUSu?utm_source=generator&theme=0&si=aeac99348de44698"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Playlist Embed"
                />
              </div>
              {/* Lower Section Illustration: High-res doodle displayed only in Spotify view, theme-aware */}
              <div className="spotify-lower-illustration-wrap">
                <Particles
                  className="spotify-doodle-particles absolute inset-0 z-0 pointer-events-none"
                  quantity={80}
                  ease={80}
                  color={color}
                  refresh={resolved}
                />
                <img
                  src={spotifyDoodleDark}
                  alt="Good music, good code, good food, same playlist, different day"
                  className="spotify-lower-illustration-img dark-theme-only"
                  loading="lazy"
                  width="1024"
                  height="600"
                />
                <img
                  src={spotifyDoodleLight}
                  alt="Good music, good code, good food, same playlist, different day"
                  className="spotify-lower-illustration-img light-theme-only"
                  loading="lazy"
                  width="1024"
                  height="600"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
