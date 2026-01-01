// TODO: After deploying to Vercel, add this import:
// import { spawn } from 'child_process';

export async function GET(request) {
  /*
  TODO: After deploying to Vercel, replace this entire function with:
  
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const quality = searchParams.get('quality') || 'best';

    if (!url) {
      return Response.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(url);

    // Validate URL format
    let videoUrl;
    try {
      videoUrl = new URL(decodedUrl);
    } catch (error) {
      return Response.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Determine format based on quality
    let formatOption;
    if (quality === 'audio') {
      formatOption = 'bestaudio[ext=m4a]/bestaudio';
    } else {
      formatOption = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    }

    // First, get video info for filename
    const infoPromise = new Promise((resolve, reject) => {
      const infoProcess = spawn('yt-dlp', [
        '--dump-json',
        '--no-playlist',
        decodedUrl
      ]);

      let data = '';
      let errorData = '';

      infoProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
      });

      infoProcess.stderr.on('data', (chunk) => {
        errorData += chunk.toString();
      });

      infoProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Failed to get video info: ${errorData}`));
          return;
        }

        try {
          const info = JSON.parse(data);
          resolve(info);
        } catch (parseError) {
          reject(new Error(`Failed to parse video info: ${parseError.message}`));
        }
      });

      infoProcess.on('error', (error) => {
        reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
      });
    });

    const info = await infoPromise;
    const safeTitle = (info.title || 'video').replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
    const extension = quality === 'audio' ? 'm4a' : 'mp4';
    const filename = `${safeTitle}.${extension}`;

    // Now download the video
    const ytdlpProcess = spawn('yt-dlp', [
      '-f', formatOption,
      '--no-playlist',
      '-o', '-',  // Output to stdout
      decodedUrl
    ]);

    // Create headers for download
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Cache-Control', 'no-cache');

    // Create a readable stream from the process stdout
    const stream = new ReadableStream({
      start(controller) {
        ytdlpProcess.stdout.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        ytdlpProcess.stdout.on('end', () => {
          controller.close();
        });

        ytdlpProcess.stderr.on('data', (chunk) => {
          console.error('yt-dlp stderr:', chunk.toString());
        });

        ytdlpProcess.on('error', (error) => {
          console.error('yt-dlp process error:', error);
          controller.error(error);
        });

        ytdlpProcess.on('close', (code) => {
          if (code !== 0 && code !== null) {
            console.error('yt-dlp exited with code:', code);
            controller.error(new Error(`yt-dlp exited with code ${code}`));
          }
        });
      },
      cancel() {
        ytdlpProcess.kill();
      }
    });

    // Return the stream
    return new Response(stream, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error('yt-dlp download error:', error);

    if (error.message.includes('not found') || error.message.includes('404')) {
      return Response.json(
        { error: 'Video not found or is private' },
        { status: 404 }
      );
    }

    if (error.message.includes('restricted') || error.message.includes('geo')) {
      return Response.json(
        { error: 'Video is restricted or unavailable in your region' },
        { status: 403 }
      );
    }

    return Response.json(
      { error: error.message || 'Failed to download video' },
      { status: 500 }
    );
  }
  */

  // TEMPORARY: Return error message until yt-dlp is added
  return Response.json(
    {
      error:
        "Video download requires yt-dlp to be installed. Please add it after deploying to Vercel.",
      instructions: [
        "1. Install yt-dlp on your Vercel instance (add to package.json or use a custom build)",
        "2. Uncomment the import at the top of this file",
        "3. Replace this function with the commented implementation above",
        "Note: Vercel supports yt-dlp when added as a dependency or binary",
      ],
    },
    { status: 501 },
  );
}
