export default function Head() {
  return (
    <>
      <title>My Portfolio</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="Gil Sasi's Portfolio – Explore my projects and skills."
      />

      {/* Favicon */}
      <link rel="icon" href="/icon/favicon.ico" type="image/png" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* Open Graph (OG) for social sharing */}
      <meta property="og:title" content="My Portfolio" />
      <meta
        property="og:description"
        content="This is Gil Sasi's portfolio. Enjoy your stay!"
      />
      <meta property="og:image" content="/favicon.ico" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://my-portfolio.com" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="My Portfolio" />
      <meta
        name="twitter:description"
        content="This is Gil Sasi's portfolio. Enjoy your stay!"
      />
      <meta name="twitter:image" content="/favicon.ico" />
    </>
  );
}
