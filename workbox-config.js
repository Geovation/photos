module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{json,ico,png,html,js,css,svg}"
  ],
  "swDest": "build/sw.js",
  "runtimeCaching": [{
    urlPattern: /.*/,

    // Apply a cache-first strategy.
    handler: 'staleWhileRevalidate',

    options: {
      // Use a custom cache name.
      cacheName: 'all',

      // Only cache 10 images.*
      expiration: {
        maxEntries: 10000,
      },
    },
  }]
};
