import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactCompiler: true,
  // kordoc(OCR)과 그 하위 의존성(@napi-rs/canvas, onnxruntime-node, sharp 등)은 플랫폼별
  // 네이티브 바이너리를 포함한 패키지다. Next.js가 이런 패키지를 서버리스 함수용으로 직접
  // 번들링하려고 하면 네이티브 바이너리 파일이 트레이싱에서 빠지는 경우가 흔하다 — 실제로
  // Vercel 배포에서 "Cannot polyfill `Path2D`"(@napi-rs/canvas 로드 실패) 경고와 함께
  // PDF 렌더링이 깨져 OCR 결과가 빈 문자열로 나오는 문제가 있었다. serverExternalPackages로
  // 지정하면 번들링하지 않고 런타임에 node_modules에서 그대로 require하게 되어, pnpm이
  // 설치해 둔 실제 플랫폼(Linux)용 바이너리를 정상적으로 찾는다.
  serverExternalPackages: [
    'kordoc',
    '@napi-rs/canvas',
    'onnxruntime-node',
    'sharp',
    '@huggingface/transformers',
    '@hyzyla/pdfium',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL || '',
        port: '',
        pathname: '/**',
      },
    ],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
    },
  ],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
});
