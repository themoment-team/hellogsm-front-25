import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactCompiler: true,
  // kordoc(OCR)과 그 하위 의존성(@napi-rs/canvas, onnxruntime-node, sharp 등)은 플랫폼별
  // 네이티브 바이너리를 포함한 패키지다. serverExternalPackages만으로는 부족했다 — 실제
  // Vercel 배포 로그로 확인해보니 "Cannot find module '@napi-rs/canvas'"였다. pdfjs-dist가
  // 이 패키지를 try/catch로 감싸 선택적으로 require하다 보니, Next.js의 자동 파일 트레이싱이
  // "없어도 되는 optional require"로 보고 배포 번들에 아예 안 넣어버린 것 — @napi-rs/canvas가
  // apps/client의 직접 의존성이 아니라 pdfjs-dist의 선택적 하위 의존성이라 더 그렇다. 그
  // 결과 DOMMatrix/ImageData/Path2D 폴리필이 전부 실패해 PDF 페이지를 이미지로 렌더링하지
  // 못하고, OCR이 읽을 이미지 자체가 없어 rawText가 항상 빈 문자열이었다.
  // outputFileTracingIncludes로 이 라우트에 필요한 파일을 명시적으로 강제 포함시킨다.
  serverExternalPackages: [
    'kordoc',
    '@napi-rs/canvas',
    'onnxruntime-node',
    'sharp',
    '@huggingface/transformers',
    '@hyzyla/pdfium',
  ],
  outputFileTracingIncludes: {
    '/api/school-record-ocr': [
      '../../node_modules/.pnpm/@napi-rs+canvas*/**/*',
      '../../node_modules/.pnpm/onnxruntime-node*/**/*',
      '../../node_modules/.pnpm/@img+sharp*/**/*',
      '../../node_modules/.pnpm/kordoc*/**/*',
    ],
  },
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
