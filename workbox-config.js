module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{json,ico,png,html,js,css,svg}"
  ],
  "swDest": "build/sw.js",
  "runtimeCaching": [{
      urlPattern: /.*pbf/,

      // Apply a cache-first strategy.
      handler: 'cacheFirst',

      options: {
        // Use a custom cache name.
        cacheName: 'pbf',

        // Only cache 10k images.*
        expiration: {
          // maxEntries: 10000,
          maxAgeSeconds: 60*60*24*180 // 180 days
        },
      },
    }, {
      urlPattern: /.*/,

      // Apply a cache-first strategy.
      handler: 'staleWhileRevalidate',

      options: {
        // Use a custom cache name.
        cacheName: 'all',

        // // Only cache 10k images.*
        // expiration: {
        //   maxEntries: 10000,
        // },
      },
    },

  ]
};
