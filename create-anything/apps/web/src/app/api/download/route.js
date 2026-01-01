// TODO: After deploying to Vercel, add these imports:
// import ytdl from 'ytdl-core';
// import { spawn } from 'child_process';

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, url } = body;

    // Validate input
    if (!platform || !url) {
      return Response.json(
        { error: "Platform and URL are required" },
        { status: 400 },
      );
    }

    // Validate platform
    const validPlatforms = ["youtube", "tiktok", "instagram", "facebook"];
    if (!validPlatforms.includes(platform)) {
      return Response.json(
        {
          error:
            "Invalid platform. Must be one of: youtube, tiktok, instagram, facebook",
        },
        { status: 400 },
      );
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Platform-specific URL validation
    if (!isValidPlatformUrl(platform, url)) {
      return Response.json(
        { error: `URL does not match ${platform} format` },
        { status: 400 },
      );
    }

    // Process based on platform
    let videoData;

    switch (platform) {
      case "youtube":
        videoData = await processYouTube(url);
        break;
      case "tiktok":
        videoData = await processTikTok(url);
        break;
      case "instagram":
        videoData = await processInstagram(url);
        break;
      case "facebook":
        videoData = await processFacebook(url);
        break;
      default:
        return Response.json(
          { error: "Platform not supported" },
          { status: 400 },
        );
    }

    return Response.json(videoData);
  } catch (error) {
    console.error("Download API error:", error);

    if (error.message.includes("not found") || error.message.includes("404")) {
      return Response.json(
        { error: "Video not found or is private" },
        { status: 404 },
      );
    }

    if (error.message.includes("restricted") || error.message.includes("403")) {
      return Response.json(
        { error: "Video is restricted or unavailable in your region" },
        { status: 403 },
      );
    }

    return Response.json(
      { error: error.message || "Failed to process video" },
      { status: 500 },
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidPlatformUrl(platform, url) {
  const patterns = {
    youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    tiktok: /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+/i,
    instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
    facebook: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i,
  };

  return patterns[platform]?.test(url) || false;
}

function formatDuration(seconds) {
  if (!seconds) return "Unknown";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// ============================================================================
// YOUTUBE PROCESSING (using ytdl-core)
// ============================================================================

async function processYouTube(url) {
  /* 
  TODO: After deploying to Vercel, replace this function with:
  
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    
    const downloadLinks = [];
    
    // Get highest quality
    const highestQuality = formats.reduce((prev, current) => {
      const prevHeight = prev.height || 0;
      const currentHeight = current.height || 0;
      return currentHeight > prevHeight ? current : prev;
    }, formats[0]);

    if (highestQuality) {
      downloadLinks.push({
        quality: `${highestQuality.height}p (${highestQuality.qualityLabel || 'Best'})`,
        format: highestQuality.container?.toUpperCase() || 'MP4',
        url: `/api/download/youtube?url=${encodeURIComponent(url)}&quality=highest`,
        fileSize: highestQuality.contentLength ? `${(parseInt(highestQuality.contentLength) / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'
      });
    }

    // Add other quality options
    const qualities = ['720p', '480p', '360p'];
    for (const quality of qualities) {
      const format = formats.find(f => f.qualityLabel === quality);
      if (format) {
        downloadLinks.push({
          quality: quality,
          format: format.container?.toUpperCase() || 'MP4',
          url: `/api/download/youtube?url=${encodeURIComponent(url)}&quality=${quality}`,
          fileSize: format.contentLength ? `${(parseInt(format.contentLength) / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'
        });
      }
    }

    return {
      title: videoDetails.title,
      thumbnail: videoDetails.thumbnails?.[videoDetails.thumbnails.length - 1]?.url || 
                 `https://img.youtube.com/vi/${videoDetails.videoId}/maxresdefault.jpg`,
      duration: formatDuration(parseInt(videoDetails.lengthSeconds)),
      author: videoDetails.author?.name || 'Unknown',
      views: parseInt(videoDetails.viewCount)?.toLocaleString() || 'Unknown',
      downloadLinks: downloadLinks
    };
  } catch (error) {
    console.error('YouTube processing error:', error);
    throw new Error(`Failed to process YouTube video: ${error.message}`);
  }
  */

  // TEMPORARY: Return demo data until ytdl-core is added
  const videoId = extractYouTubeId(url);
  return {
    title: "YouTube Video (Requires ytdl-core)",
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: "Unknown",
    author: "Unknown",
    views: "Unknown",
    downloadLinks: [
      {
        quality: "Best Quality",
        format: "MP4",
        url: `/api/download/youtube?url=${encodeURIComponent(url)}&quality=highest`,
        fileSize: "Unknown",
      },
    ],
    message:
      "Add ytdl-core package and implementation after deploying to Vercel",
  };
}

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// ============================================================================
// TIKTOK, INSTAGRAM, FACEBOOK PROCESSING (using yt-dlp)
// ============================================================================

async function processWithYtDlp(url, platform) {
  /*
  TODO: After deploying to Vercel, replace this function with:
  
  return new Promise((resolve, reject) => {
    const ytdlp = spawn('yt-dlp', [
      '--dump-json',
      '--no-playlist',
      url
    ]);

    let data = '';
    let errorData = '';

    ytdlp.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    ytdlp.stderr.on('data', (chunk) => {
      errorData += chunk.toString();
    });

    ytdlp.on('close', (code) => {
      if (code !== 0) {
        console.error('yt-dlp error:', errorData);
        reject(new Error(`Failed to fetch ${platform} video: ${errorData || 'Unknown error'}`));
        return;
      }

      try {
        const info = JSON.parse(data);
        
        const downloadLinks = [];

        downloadLinks.push({
          quality: 'Best Quality',
          format: info.ext?.toUpperCase() || 'MP4',
          url: `/api/download/ytdlp?url=${encodeURIComponent(url)}&quality=best`,
          fileSize: info.filesize ? `${(info.filesize / (1024 * 1024)).toFixed(2)} MB` : 'Unknown'
        });

        if (info.formats?.some(f => f.acodec !== 'none' && f.vcodec === 'none')) {
          downloadLinks.push({
            quality: 'Audio Only',
            format: 'M4A',
            url: `/api/download/ytdlp?url=${encodeURIComponent(url)}&quality=audio`,
            fileSize: 'Unknown'
          });
        }

        resolve({
          title: info.title || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
          thumbnail: info.thumbnail || '',
          duration: formatDuration(info.duration || 0),
          author: info.uploader || info.channel || 'Unknown',
          views: info.view_count?.toLocaleString() || 'Unknown',
          downloadLinks: downloadLinks
        });
      } catch (parseError) {
        reject(new Error(`Failed to parse ${platform} video info: ${parseError.message}`));
      }
    });

    ytdlp.on('error', (error) => {
      reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
    });
  });
  */

  // TEMPORARY: Return demo data until yt-dlp is added
  return {
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video (Requires yt-dlp)`,
    thumbnail: "",
    duration: "Unknown",
    author: "Unknown",
    views: "Unknown",
    downloadLinks: [
      {
        quality: "Best Quality",
        format: "MP4",
        url: `/api/download/ytdlp?url=${encodeURIComponent(url)}&quality=best`,
        fileSize: "Unknown",
      },
    ],
    message: "Install yt-dlp and add implementation after deploying to Vercel",
  };
}

async function processTikTok(url) {
  return processWithYtDlp(url, "tiktok");
}

async function processInstagram(url) {
  return processWithYtDlp(url, "instagram");
}

async function processFacebook(url) {
  return processWithYtDlp(url, "facebook");
}
