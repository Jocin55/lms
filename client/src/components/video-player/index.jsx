// src/components/video-player.jsx

export default function VideoPlayer({
  url,
  width = "100%",
  height = "260px"
}) {
  if (!url) return <p>No video available</p>;

  return (
    <video
      src={url}
      width={width}
      height={height}
      controls
      style={{
        background: "#000",
        borderRadius: "8px",
        objectFit: "cover",
      }}
    />
  );
}
