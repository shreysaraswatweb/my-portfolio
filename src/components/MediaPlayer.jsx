import { useState, useEffect } from "react";
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

// Helper to convert "2:48" -> 168 seconds
function parseDuration(timeStr) {
  if (!timeStr) return 180;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 180;
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
  const [currentTime, setCurrentTime] = useState(24);

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
        {/* Top Header Bar / Mode Switcher */}
        <div className="relative z-10 flex items-center justify-between px-3 pt-3">
          {/* Left: Volume Widget (in player mode) or Spotify Logo (in spotify mode) */}
          {viewMode === "player" ? (
            <div id="volume" title="Volume">
              <button
                id="muteBtn"
                type="button"
                onClick={toggleMute}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <div id="volume-bar">
                <input
                  type="range"
                  id="volumeSlider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume slider"
                />
                <div
                  id="volumeIndicator"
                  className="volume-indicator"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-1 text-micro font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Spotify Live</span>
            </div>
          )}

          {/* Right: Switcher Tabs (Player vs Spotify) */}
          <div className="ml-auto flex items-center gap-1 rounded-full border border-border-hairline bg-surface-pill/80 p-0.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("player")}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-micro font-medium transition-all ${
                viewMode === "player"
                  ? "bg-text-primary text-text-on-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Music2 className="h-3 w-3" />
              <span>Player</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("spotify")}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-micro font-medium transition-all ${
                viewMode === "spotify"
                  ? "bg-[#1DB954] text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span>Spotify</span>
            </button>
          </div>
        </div>

        {/* View 1: Custom Neumorphic Player with Provided Design */}
        {viewMode === "player" && (
          <>
            <img
              id="albumArt"
              src={currentTrack.coverMedium || currentTrack.cover}
              alt={currentTrack.title}
              loading="lazy"
            />
            <div id="fade" />
            <div id="uiWrap">
              <div className="audio-info">
                <div className="track-info relative">
                  <div id="trackTitle" className="truncate px-2">
                    {currentTrack.title}
                  </div>
                  <div id="bandName" className="truncate">
                    {currentTrack.artist}
                  </div>
                  <button
                    id="likeBtn"
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    aria-label={isLiked ? "Unlike track" : "Like track"}
                    className={isLiked ? "text-rose-500" : "text-text-secondary hover:text-rose-400"}
                  >
                    <Heart
                      className={`h-5 w-5 transition-transform ${isLiked ? "fill-rose-500 scale-110" : ""}`}
                    />
                  </button>
                </div>

                <div className="seek-bar">
                  <input
                    type="range"
                    id="seekSlider"
                    min="0"
                    max={totalDuration}
                    step="1"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    aria-label="Seek track position"
                  />
                  {/* Full-width continuous track line across 100% */}
                  <div className="seek-track-bg" />
                  {/* Active playing progress bar */}
                  <div
                    id="seekIndicator"
                    className="seek-indicator"
                    style={{ width: `${seekProgress}%` }}
                  />
                  <div id="currentTime">{formatTime(currentTime)}</div>
                  <div id="trackTime">{formatTime(totalDuration)}</div>
                </div>
              </div>

              <div className="audio-controls mt-2">
                <div className="playSkip flex items-center justify-center">
                  <button
                    id="loopBtn"
                    type="button"
                    onClick={() => setIsLoop(!isLoop)}
                    className={isLoop ? "active" : ""}
                    title={isLoop ? "Loop active" : "Loop off"}
                    aria-label="Toggle repeat"
                  >
                    <Repeat className="h-4 w-4" />
                  </button>

                  <button
                    id="prevBtn"
                    type="button"
                    className="neumorph-btn"
                    onClick={handlePrev}
                    aria-label="Previous track"
                  >
                    <SkipBack className="h-4 w-4 fill-current" />
                  </button>

                  <button
                    id="playPauseBtn"
                    type="button"
                    className="neumorph-btn"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-6 w-6 fill-current translate-x-0.5" />
                    )}
                  </button>

                  <button
                    id="nextBtn"
                    type="button"
                    className="neumorph-btn"
                    onClick={handleNext}
                    aria-label="Next track"
                  >
                    <SkipForward className="h-4 w-4 fill-current" />
                  </button>

                  <button
                    id="shuffleBtn"
                    type="button"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={isShuffle ? "active" : ""}
                    title={isShuffle ? "Shuffle active" : "Shuffle off"}
                    aria-label="Toggle shuffle"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Seamless Spotify Prompt Button */}
              <div className="mt-3 pt-2 border-t border-border-hairline/60">
                <button
                  type="button"
                  onClick={() => setViewMode("spotify")}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border-hairline bg-surface-pill/50 px-3 py-1.5 text-micro font-medium text-text-secondary transition-all hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10 hover:text-white"
                >
                  <svg className="h-3.5 w-3.5 fill-[#1DB954]" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <span>Open Spotify Playlist</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* View 2: Spotify Official Embedded Playlist */}
        {viewMode === "spotify" && (
          <div className="p-3 pt-2">
            <div className="overflow-hidden rounded-2xl border border-border-hairline shadow-inner">
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: "14px", display: "block" }}
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
            <div className="mt-2.5 flex items-center justify-between px-1">
              <span className="text-micro text-text-tertiary">Playlist on Spotify</span>
              <a
                href="https://open.spotify.com/playlist/1jfLDmuldcs3bbQ0ofeUSu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-micro font-medium text-[#1DB954] hover:underline"
              >
                Open in App ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
