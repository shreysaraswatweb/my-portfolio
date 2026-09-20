import { useState, useEffect } from "react";
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

export default function MediaPlayer() {
  const [viewMode, setViewMode] = useState("player"); // "player" | "spotify"
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [prevVolume, setPrevVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);

  const currentTrack = tracks[trackIndex] || tracks[0];
  const totalDuration = parseDuration(currentTrack.duration);

  // Playback timer simulation
  useEffect(() => {
    let timer;
    if (isPlaying && viewMode === "player") {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            if (isLoop) return 0;
            if (isShuffle) {
              const nextIdx = Math.floor(Math.random() * tracks.length);
              setTrackIndex(nextIdx);
            } else {
              setTrackIndex((idx) => (idx + 1) % tracks.length);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration, isLoop, isShuffle, viewMode]);

  // Global drag release listener
  useEffect(() => {
    if (!isDragging && !isVolumeDragging) return;
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsVolumeDragging(false);
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, isVolumeDragging]);

  const handleNext = () => {
    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * tracks.length);
      setTrackIndex(nextIdx);
    } else {
      setTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setCurrentTime(0);
  };

  const handlePrev = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setCurrentTime(0);
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

  const seekProgress = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  return (
    <div className="spotify-music-card w-full">
      <div className="app-container">
        {/* Top-Right: Smooth Inertial Player to Spotify Mode Switcher */}
        <div className="mode-switcher-top">
          <button
            type="button"
            onClick={() => setViewMode("player")}
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
            onClick={() => setViewMode("spotify")}
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
        </div>

        {/* View Switching with Smooth Inertial Crossfade */}
        <AnimatePresence mode="wait" initial={false}>
          {viewMode === "player" ? (
            <motion.div
              key="player-view"
              initial={{ opacity: 0, scale: 0.98, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="player-view-wrap"
            >
              {/* Top-Left: Volume Overlay directly over Artwork (Dedicated ONLY to Player) */}
              <div className={`volume-widget-top ${isVolumeDragging ? "is-dragging" : ""}`}>
                <motion.button
                  id="muteBtn"
                  type="button"
                  onClick={toggleMute}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                  aria-label={volume === 0 ? "Unmute" : "Mute"}
                  className="volume-widget-btn"
                  title={volume === 0 ? "Unmute" : "Mute"}
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-rose-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-white" />
                  )}
                </motion.button>
                <div className="volume-widget-slider-box">
                  <input
                    type="range"
                    id="volumeSlider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    onMouseDown={() => setIsVolumeDragging(true)}
                    onTouchStart={() => setIsVolumeDragging(true)}
                    aria-label="Volume slider"
                  />
                  <div className="volume-line-bg" />
                  <div
                    id="volumeIndicator"
                    className="volume-line-fill"
                    style={{ width: `calc(${volume} * (100% - 8px))` }}
                  />
                  <div
                    className="volume-line-dot"
                    style={{ left: `calc(4px + ${volume} * (100% - 8px))` }}
                  />
                </div>
              </div>

              {/* Artwork (Extends fully to top of card) */}
              <div className="album-art-wrap">
                <img
                  id="albumArt"
                  src={currentTrack.coverMedium || currentTrack.cover}
                  alt={currentTrack.title}
                  loading="lazy"
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
                      step="1"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
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
                    onClick={() => setIsPlaying(!isPlaying)}
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
              initial={{ opacity: 0, scale: 0.98, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -6 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="spotify-embed-wrap"
            >
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
              <div className="mt-2.5 flex items-center justify-between px-2 pb-1">
                <span className="text-micro text-white/50 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
                  Playlist on Spotify
                </span>
                <a
                  href="https://open.spotify.com/playlist/1jfLDmuldcs3bbQ0ofeUSu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-micro font-medium text-[#1DB954] hover:text-[#1ed760] transition-colors"
                >
                  Open in App ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
