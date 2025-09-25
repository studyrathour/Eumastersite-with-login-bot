export const getVideoPlayerURL = (videoUrl: string, isLive: boolean = false): string => {
  // If the videoUrl is empty or just whitespace, return a non-functional link.
  if (!videoUrl || !videoUrl.trim()) {
    return '#';
  }

  // Check if it's an HLS stream (.m3u8)
  if (isM3U8Url(videoUrl)) {
    // For HLS streams, use external player with prefix
    const prefix = isLive ? 'https://edumastervideoplarerwatch.netlify.app/live/' : 'https://edumastervideoplarerwatch.netlify.app/rec/';
    return `${prefix}${encodeURIComponent(videoUrl)}`;
  }

  // For non-HLS videos, use external player
  const livePrefix = 'https://edumastervideoplarerwatch.netlify.app/live/';
  const recPrefix = 'https://edumastervideoplarerwatch.netlify.app/rec/';

  // If the URL already has a valid prefix, return it as is to prevent double-prefixing.
  if (videoUrl.startsWith(livePrefix) || videoUrl.startsWith(recPrefix)) {
    return videoUrl;
  }
  
  const prefix = isLive ? livePrefix : recPrefix;
  
  return `${prefix}${encodeURIComponent(videoUrl)}`;
};

export const isM3U8Url = (url: string): boolean => {
  return url.includes('.m3u8') || url.includes('m3u8');
};
