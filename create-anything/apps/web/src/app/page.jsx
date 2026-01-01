"use client";

import { useState } from "react";
import {
  Download,
  Loader2,
  Video,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function VideoDownloaderPage() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [videoData, setVideoData] = useState(null);

  const downloadMutation = useMutation({
    mutationFn: async ({ platform, url }) => {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch video");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setVideoData(data);
    },
    onError: (error) => {
      console.error("Download error:", error);
      setVideoData(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setVideoData(null);
    downloadMutation.mutate({ platform, url: url.trim() });
  };

  const handleDownload = (downloadUrl, title) => {
    // Generate safe filename from title or use default
    const safeTitle = title
      ? title.replace(/[^a-zA-Z0-9._-]/g, "_").substring(0, 100)
      : "video";
    const filename = `${safeTitle}.mp4`;

    // Encode the video URL and filename for the streaming API
    const encodedUrl = encodeURIComponent(downloadUrl);
    const encodedFilename = encodeURIComponent(filename);

    // Use the streaming API to force download
    const downloadLink = `/api/download/file?url=${encodedUrl}&filename=${encodedFilename}`;

    // Open the download link
    window.location.href = downloadLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl">
              <Video className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Video Downloader
          </h1>
          <p className="text-lg text-gray-600">
            Download videos from YouTube, TikTok, Instagram, and Facebook
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "youtube", label: "YouTube", color: "red" },
                  { value: "tiktok", label: "TikTok", color: "gray" },
                  { value: "instagram", label: "Instagram", color: "pink" },
                  { value: "facebook", label: "Facebook", color: "blue" },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlatform(p.value)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      platform === p.value
                        ? `bg-${p.color}-600 text-white shadow-lg scale-105`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={
                      platform === p.value
                        ? {
                            backgroundColor:
                              p.color === "red"
                                ? "#dc2626"
                                : p.color === "pink"
                                  ? "#ec4899"
                                  : p.color === "blue"
                                    ? "#2563eb"
                                    : "#4b5563",
                          }
                        : {}
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input */}
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Video URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video URL here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                disabled={downloadMutation.isPending}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={downloadMutation.isPending || !url.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {downloadMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Video
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {downloadMutation.isError && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">
                {downloadMutation.error?.message ||
                  "Failed to fetch video. Please check the URL and try again."}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {videoData && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Video Information
            </h2>

            <div className="space-y-6">
              {/* Thumbnail */}
              {videoData.thumbnail && (
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={videoData.thumbnail}
                    alt={videoData.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Title */}
              <div className="flex items-start gap-3">
                <Video className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Title
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {videoData.title}
                  </p>
                </div>
              </div>

              {/* Duration */}
              {videoData.duration && (
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Duration
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {videoData.duration}
                    </p>
                  </div>
                </div>
              )}

              {/* Download Links */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                  <p className="text-sm font-semibold text-gray-500">
                    Available Downloads
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {videoData.downloadLinks &&
                  videoData.downloadLinks.length > 0 ? (
                    videoData.downloadLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleDownload(link.url, videoData.title)
                        }
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all group"
                      >
                        <div className="text-left">
                          <p className="font-bold text-gray-900">
                            {link.quality}
                          </p>
                          <p className="text-sm text-gray-600">{link.format}</p>
                        </div>
                        <Download className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">
                      No download links available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">How to Use</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Select the platform where your video is hosted</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Paste the video URL into the input field</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Click "Download Video" to fetch available formats</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Choose your preferred quality and format to download</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
