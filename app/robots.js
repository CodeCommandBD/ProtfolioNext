export default function robots() {
  const baseUrl = "https://your-domain.com"; // Update this with your actual domain when deploying

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
