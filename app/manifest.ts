import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bingo ao Vivo",
    short_name: "Bingo ao Vivo",
    description: "Sua sorte, nosso bingo.",
    start_url: "/",
    display: "standalone",
    background_color: "#020716",
    theme_color: "#061b54",
    orientation: "any",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ]
  };
}
