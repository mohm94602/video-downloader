export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "video.mp4";

    // Validate input
    if (!url) {
      return Response.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    // Validate URL format
    let videoUrl;
    try {
      videoUrl = new URL(decodeURIComponent(url));
    } catch (error) {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch the video as a stream
    const videoResponse = await fetch(videoUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!videoResponse.ok) {
      console.error(
        `Failed to fetch video: ${videoResponse.status} ${videoResponse.statusText}`,
      );
      return Response.json(
        { error: "Failed to fetch video from source" },
        { status: videoResponse.status },
      );
    }

    // Get content type from source or default to octet-stream
    const contentType =
      videoResponse.headers.get("content-type") || "application/octet-stream";
    const contentLength = videoResponse.headers.get("content-length");

    // Sanitize filename to prevent directory traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Create headers to force download
    const headers = new Headers();
    headers.set("Content-Type", "application/octet-stream");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"`,
    );
    headers.set("Cache-Control", "no-cache");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Stream the video to the client
    return new Response(videoResponse.body, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Download file API error:", error);

    if (error.message.includes("fetch")) {
      return Response.json(
        { error: "Failed to download video from source" },
        { status: 502 },
      );
    }

    return Response.json(
      { error: error.message || "Failed to process download request" },
      { status: 500 },
    );
  }
}
