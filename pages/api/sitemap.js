import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    const host = req.headers.host;

    // 1. Fetch all domains/subdomains from Firestore
    const snapshot = await getDocs(collection(db, "sites"));
    const websites = snapshot.docs.map((doc) => {
      const data = doc.data();
      return data.domain || `${data.subdomain}.customwaitlist.com`;
    });

    // Always make sure main domain is first
    if (!websites.includes("customwaitlist.com")) {
      websites.unshift("customwaitlist.com");
    }

    let xml;

    if (host === "www.customwaitlist.com") {
      // ✅ Case 1: Main domain → Sitemap Index
      xml = `<?xml version="1.0" encoding="UTF-8"?>
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${websites
            .map(
              (site) => `
            <sitemap>
              <loc>https://${site}/sitemap.xml</loc>
            </sitemap>`
            )
            .join("")}
        </sitemapindex>`;
    } else {
      // ✅ Case 2: Subdomain/domain → Only its own sitemap
      xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
            <loc>https://${host}/</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        </urlset>`;
    }

    // Set headers for XML and caching
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.write(xml);
    res.end();
    // res.status(200).send(sitemap);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating sitemap");
  }
}
