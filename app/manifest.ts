import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXUS-7 Autonomous Operations Lab",
    short_name: "NEXUS-7",
    description: "A resilient synthetic operations command center.",
    start_url: "/",
    display: "standalone",
    background_color: "#090b10",
    theme_color: "#9b7cff",
    orientation: "any",
    categories: ["productivity", "business", "developer"],
    icons: [
      {
        src: "/nexus-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
