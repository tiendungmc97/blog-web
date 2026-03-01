/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://yourdomain.com",
  generateRobotsTxt: true, // (optional)
  exclude: ["/api/*", "/admin/*", "*/private/*"],
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
    additionalSitemaps: ["https://yourdomain.com/sitemap.xml"],
  },
  // Optional: Custom transform function for sitemap entries
  transform: async (config, path) => {
    // Custom transform logic
    return {
      loc: path, // The URL
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  // Additional paths to include
  additionalPaths: async (config) => {
    return [
      // Add any additional static paths here
      // await config.transform(config, '/additional-page'),
    ];
  },
};
