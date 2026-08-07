import type { NextConfig } from "next";
import path from "path";

/**
 * CSP (Content Security Policy) = "lista de convidados" do navegador.
 * Começamos permissiva o suficiente para Next.js, Vercel Analytics,
 * Google Maps (iframe) e imagens do Vercel Blob — depois dá para apertar.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js + Analytics + AdSense (quando ativo em produção)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://www.googletagservices.com https://www.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.supabase.co https://www.google.com https://maps.gstatic.com https://*.googleapis.com https://pagead2.googlesyndication.com https://*.googlesyndication.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://vercel.live wss://*.supabase.co https://pagead2.googlesyndication.com https://*.google.com",
  "frame-src 'self' https://www.google.com https://maps.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Esconde o header X-Powered-By: Next.js (reduz vazamento de stack)
  poweredByHeader: false,
  // Em produção, não expor source maps no browser
  productionBrowserSourceMaps: false,
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  // Permite fotos enviadas pelo admin (Vercel Blob) no componente next/image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
