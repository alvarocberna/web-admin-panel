import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Deshabilitar source maps en producción para evitar exposición de código fuente
  productionBrowserSourceMaps: false,
  
  images: {
    remotePatterns: [ //de donde se puede aceptar imagenes
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'web-core-storage.s3.us-east-1.amazonaws.com',
      },
    ],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const s3Bucket = 'https://web-core-storage.s3.us-east-1.amazonaws.com';

    const csp = (isProd
      ? [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          `img-src 'self' data: blob: ${backendUrl} ${s3Bucket}`,
          "font-src 'self'",
          `connect-src 'self' ${backendUrl}`,
          "object-src 'none'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          'upgrade-insecure-requests',
        ]
      : [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          `img-src 'self' data: blob: ${backendUrl} ${s3Bucket}`,
          "font-src 'self'",
          `connect-src 'self' ${backendUrl}`,
        ]
    ).join('; ');

    const securityHeaders = [
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
        value: csp,
      },
    ];

    if (isProd) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      });
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
