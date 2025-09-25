import React, { useRef, useEffect, useState, useCallback } from 'react';
import { isM3U8Url } from '../utils/videoPlayer';
import { WebsiteProtection } from '../utils/protection';

// Import SVG icons as React components
import PlayIcon from '../utils/play.svg?react';
import PauseIcon from '../utils/pause.svg?react';
import ForwardIcon from '../utils/10 sec-forward.svg?react';
import BackwardIcon from '../utils/10sec-backward.svg?react';
import SoundIcon from '../utils/sound.svg?react';
import NoSoundIcon from '../utils/no sound.svg?react';
import FullScreenIcon from '../utils/full screen.svg?react';
import ExitFullScreenIcon from '../utils/exit full screen.svg?react';
import SettingIcon from '../utils/setting.svg?react';
import ChatIcon from '../utils/chat.svg?react';
import NoteIcon from '../utils/note.svg?react';
import DoubtIcon from '../utils/Doubt.svg?react';
import PollIcon from '../utils/Poll.svg?react';
import ReportIcon from '../utils/Report player.svg?react';
import ThreeDotIcon from '../utils/three dot.svg?react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoplay = false,
  muted = false,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize protection for video player
  useEffect(() => {
    WebsiteProtection.getInstance();
  }, []);

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const initializePlayer = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isM3U8Url(src)) {
          // Additional URL obfuscation for HLS streams
          const obfuscatedSrc = src + (src.includes('?') ? '&' : '?') + 
                               't=' + Date.now() + '&r=' + Math.random().toString(36).substring(2);
          
          // Check if HLS.js is supported
          if (typeof window !== 'undefined' && 'Hls' in window) {
            const Hls = (window as any).Hls;
            if (Hls.isSupported()) {
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
              });

              hls.loadSource(obfuscatedSrc);
              hls.attachMedia(video);

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                if (autoplay) {
                  video.play().catch(console.error);
                }
              });

              hls.on(Hls.Events.ERROR, (event: any, data: any) => {
                if (data.fatal) {
                  console.error('HLS Error:', data);
                } else {
                  console.warn('HLS Warning:', data);
                }
                if (data.fatal) {
                  setError('Failed to load video stream');
                  setIsLoading(false);
                }
              });

              return () => {
                hls.destroy();
              };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              // Native HLS support (Safari)
              video.src = obfuscatedSrc;
              setIsLoading(false);
            } else {
              setError('HLS not supported in this browser');
              setIsLoading(false);
            }
          } else {
            // Load HLS.js dynamically
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.onload = () => initializePlayer();
            document.head.appendChild(script);
            return;
          }
        } else {
          // Regular video file
          video.src = src;
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Video initialization error:', err);
        setError('Failed to initialize video player');
        setIsLoading(false);
      }
    };

    initializePlayer();
  }, [src, autoplay]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide
  const hideControlsAfterDelay = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    hideControlsAfterDelay();
  }, [hideControlsAfterDelay]);

  // Control functions
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) {
      video.muted = true;
    } else if (video.muted) {
      video.muted = false;
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const placeholderAction = (action: string) => {
    console.log(`Button clicked: ${action}`);
  };

  if (error) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="flex items-center justify-center h-64 text-white">
          <div className="text-center">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        muted={muted}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => placeholderAction('settings')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="Settings"
          >
            <SettingIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => placeholderAction('chat')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="Chat"
          >
            <ChatIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => placeholderAction('notes')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="Notes"
          >
            <NoteIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => placeholderAction('doubt')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="Raise Doubt"
          >
            <DoubtIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => placeholderAction('poll')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="Poll"
          >
            <PollIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => placeholderAction('report')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="Report Issue"
          >
            <ReportIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => placeholderAction('more options')}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            title="More Options"
          >
            <ThreeDotIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4 group/progress"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full relative transition-all group-hover/progress:h-3"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-white" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-white" />
                )}
              </button>

              <button
                onClick={skipBackward}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Skip backward 10s"
              >
                <BackwardIcon className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={skipForward}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Skip forward 10s"
              >
                <ForwardIcon className="w-5 h-5 text-white" />
              </button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <NoSoundIcon className="w-5 h-5 text-white" />
                  ) : (
                    <SoundIcon className="w-5 h-5 text-white" />
                  )}
                </button>
                <input
                  ref={volumeRef}
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity slider"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <ExitFullScreenIcon className="w-5 h-5 text-white" />
                ) : (
                  <FullScreenIcon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;