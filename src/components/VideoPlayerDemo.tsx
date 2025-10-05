import React, { useState } from 'react';
import { getVideoPlayerURL } from '../utils/videoPlayer';
import { isUserAuthenticated } from '../utils/auth';
import { Link } from 'react-router-dom';
import { Shield, Play } from 'lucide-react';

const VideoPlayerDemo: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  
  const isAuthenticated = isUserAuthenticated();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-8 border border-secondary text-center">
          <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Access Required</h2>
          <p className="text-text-secondary mb-6">
            You need to verify your access token to use the video player demo.
          </p>
          <Link
            to="/verify-token"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Get Access Now
          </Link>
        </div>
      </div>
    );
  }

  const sampleUrls = [
    {
      name: 'Sample HLS Stream',
      url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    },
    {
      name: 'Apple Sample HLS',
      url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8'
    },
    {
      name: 'Regular MP4 Video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ];

  const handlePlayVideo = () => {
    if (videoUrl.trim()) {
      setShowPlayer(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-text-primary mb-8">HLS Video Player Demo</h1>
      
      <div className="bg-surface rounded-lg p-6 mb-8 border border-secondary">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Test the Video Player</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Video URL (supports .m3u8 HLS streams and regular video files)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL here..."
              className="w-full px-4 py-3 bg-background border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-text-primary"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-secondary">Quick test URLs:</span>
            {sampleUrls.map((sample, index) => (
              <button
                key={index}
                onClick={() => setVideoUrl(sample.url)}
                className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full hover:bg-primary/30 transition-colors"
              >
                {sample.name}
              </button>
            ))}
          </div>
          
          <button
            onClick={handlePlayVideo}
            disabled={!videoUrl.trim()}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Play Video
          </button>
        </div>
      </div>

      {showPlayer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Now Playing</h3>
            <button
              onClick={() => setShowPlayer(false)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Close Player
            </button>
          </div>
          
          <div className="bg-surface rounded-lg p-4 border border-secondary">
            <iframe
              src={getVideoPlayerURL(videoUrl, false)}
              title="Video Player Demo"
              className="w-full aspect-video"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          
          <div className="text-sm text-text-tertiary">
            <p><strong>URL:</strong> {videoUrl}</p>
            <p><strong>Player URL:</strong> {getVideoPlayerURL(videoUrl, false)}</p>
          </div>
        </div>
      )}

      <div className="mt-12 bg-surface rounded-lg p-6 border border-secondary">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
          <div>
            <h3 className="font-medium text-text-primary mb-2">Playback Controls</h3>
            <ul className="space-y-1">
              <li>• Play/Pause</li>
              <li>• Skip forward/backward (10s)</li>
              <li>• Volume control with mute</li>
              <li>• Fullscreen toggle</li>
              <li>• Progress bar with seeking</li>
              <li>• Time display</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-2">Additional Features</h3>
            <ul className="space-y-1">
              <li>• External video player integration</li>
              <li>• Embedded player in modal</li>
              <li>• HLS and regular video support</li>
              <li>• URL encoding for security</li>
              <li>• Responsive design</li>
              <li>• Fullscreen support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerDemo;