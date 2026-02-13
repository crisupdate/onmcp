
export default function handler(req, res) {
  res.setHeader("Content-Type", "application/javascript");

  // Optional: vary service worker per subdomain
  const host = req.headers.host || "";
  const subdomain = host.split(".")[0];

  res.send(`
    self.addEventListener("install", event => {
      console.log("Service Worker installed for ${subdomain}");
      self.skipWaiting();
    });

    self.addEventListener("activate", event => {
      console.log("Service Worker activated for ${subdomain}");
    });

    self.addEventListener("fetch", event => {
      event.respondWith(fetch(event.request));
    });
  `);
}
