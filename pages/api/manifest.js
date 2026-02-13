
export default function handler(req, res) {
  try {
    const host = req.headers.host || "";
    const subdomain = host.split(".")[0] || "default";

    const manifest = {
      name: `${subdomain}.customwaitlist.com App`,
      short_name: subdomain,
      start_url: "/",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        {
          src: "https://www.customwaitlist.com/assets/2x/icon.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "https://www.customwaitlist.com/assets/2x/icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    };

    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(manifest);
  } catch (err) {
    console.error("Manifest error:", err);
    res.status(500).json({ error: "Failed to generate manifest" });
  }
}
