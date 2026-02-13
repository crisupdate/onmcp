import Head from "next/head";
// import { useRouter } from "next/router";
// import Script from "next/script";
// import React from "react";


const SEO = ({ title, description, keywords, image, host, jsonLd }) => {
  const siteUrl = `https://${host}`;
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="https://awbbusiness.com" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:image:alt" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@awb_business" />
      <meta name="twitter:creator" content="@cris_update" />
      <meta property="twitter:image:alt" content={title} />

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Head>
  );
};

export default SEO;
