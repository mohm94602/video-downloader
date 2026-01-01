// TODO: After deploying to Vercel, add this import:
// import ytdl from 'ytdl-core';

export async function GET(request) {
  /*
  TODO: After deploying to Vercel, replace this entire function with:
  
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const quality = searchParams.get('quality') || 'highest';

    if (!url) {
      return Response.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(url);

    if (!ytdl.validateURL(decodedUrl)) {
      return Response.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get video info to determine filename
    const info = await ytdl.getInfo(decodedUrl);
    const videoDetails = info.videoDetails;
    const safeTitle = videoDetails.title.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
    const filename = `${safeTitle}.mp4`;

    // Determine quality filter
    let qualityFilter;
    if (quality === 'highest') {
      qualityFilter = 'highestvideo';
    } else if (quality === 'audio') {
      qualityFilter = 'audioonly';
    } else {
      qualityFilter = { quality: quality };
    }

    // Create ytdl stream
    const videoStream = ytdl(decodedUrl, {
      quality: qualityFilter,
      filter: quality === 'audio' ? 'audioonly' : 'videoandaudio'
    });

    // Create headers for download
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Cache-Control', 'no-cache');

    // Stream the video to the client
    return new Response(videoStream, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error('YouTube download error:', error);

    if (error.message.includes('Video unavailable')) {
      return Response.json(
        { error: 'Video is unavailable or private' },
        { status: 404 }
      );
    }

    return Response.json(
      { error: error.message || 'Failed to download YouTube video' },
      { status: 500 }
    );
  }
  */

  // TEMPORARY: Return error message until ytdl-core is added
  return Response.json(
    {
      error:
        "YouTube download requires ytdl-core package. Please add it after deploying to Vercel.",
      instructions: [
        "1. Run: npm install ytdl-core",
        "2. Uncomment the import at the top of this file",
        "3. Replace this function with the commented implementation above",
      ],
    },
    { status: 501 },
  );
}
