import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3000',
          pathname: '/uploads/**',
        },
      ],
    },
    async headers() {
      return [
        {
          source: '/:path*',
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
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requiere unsafe-eval en dev
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: http://localhost:3000", // Para imágenes del backend
                "font-src 'self'",
                "connect-src 'self' " + process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
              ].join('; '),
          },
          // HSTS (solo aplica con HTTPS en producción)
          // Descomentar al desplegar con HTTPS:
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=31536000; includeSubDomains',
          // },
          ],
        },
      ];
    },
};

export default nextConfig;
