/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://*.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://callai-backend-243277014955.us-central1.run.app https://maps.googleapis.com; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
