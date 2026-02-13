export default function handler(req, res) {
  const host = req.headers.host || "customwaitlist.com";

  const content = `
User-agent: *
Allow: /

Sitemap: https://${host}/sitemap.xml
  `.trim();

  res.setHeader("Content-Type", "text/plain");
  res.write(content);
  res.end();
}
