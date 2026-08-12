import redirects from './redirects.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // WordPress served everything with a trailing slash. We do not.
  trailingSlash: false,

  // Next's own trailing-slash redirect runs BEFORE middleware, which would
  // make every legacy link a two-hop chain (`/about-us/` -> `/about-us` ->
  // `/about`). We take it over in src/middleware.ts so legacy URLs resolve in
  // a single 301, and non-legacy URLs still get their slash normalised.
  skipTrailingSlashRedirect: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    // No remotePatterns. Every asset the site renders now lives in
    // public/images and is listed in src/content/images.ts — the last
    // references to the live WordPress uploads directory went with the
    // equipment photographs. Anything reintroducing a remote host needs an
    // entry here, which is the point of leaving the key visible and empty.
  },

  async redirects() {
    return redirects
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
