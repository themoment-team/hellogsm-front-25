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
  //
  // 와일드카드(`@napi-rs+canvas*`, `onnxruntime-node*`, `@img+sharp*`)로 처음 포함시켰더니
  // 함수 크기가 961MB까지 부풀어 Vercel의 250MB 제한을 넘겼다. 원인: @napi-rs/canvas는
  // darwin/android/windows 등 10개 플랫폼 패키지가 전부 매칭됐고, onnxruntime-node는
  // (@huggingface/transformers가 1.24.3을 dependencies로, 1.27.0을 optionalDependencies로
  // 동시에 선언해) 두 버전이 pnpm 스토어에 공존하는데 각 버전의 bin/ 안에 linux/darwin/win32
  // (DirectML.dll 포함) 바이너리가 전부 들어 있어 버전당 200MB 이상이었다. Vercel 서버리스
  // 런타임은 glibc 기반 Linux x64뿐이므로, 실제 실행에 필요한 linux-x64-gnu 바이너리만
  // 남기고 나머지 플랫폼은 제외하도록 패턴을 좁혔더니 599MB로 줄었지만 여전히 초과했다.
  // 남은 원인은 `kordoc*/**/*` 패턴 — pnpm은 kordoc 패키지 디렉터리 옆에 그 직접/옵셔널
  // 의존성(onnxruntime-node, sharp, @huggingface/transformers, @hyzyla/pdfium 등)을 가리키는
  // 심볼릭 링크를 함께 두는데, `**/*` 글롭이 이 심볼릭 링크를 그대로 따라 들어가면서 이미
  // 좁혀둔 onnxruntime-node를 플랫폼 제한 없이(258MB) 통째로 다시 포함시키고 있었다. kordoc
  // 자체 코드만 남기고, kordoc이 필요로 하는 나머지 옵셔널 의존성(@huggingface/transformers,
  // @hyzyla/pdfium — 둘 다 순수 JS/WASM이라 플랫폼 분기가 없다)은 별도 패턴으로 명시했다.
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
      '../../node_modules/.pnpm/@napi-rs+canvas@*/**/*',
      '../../node_modules/.pnpm/@napi-rs+canvas-linux-x64-gnu@*/**/*',
      '../../node_modules/.pnpm/onnxruntime-node@*/node_modules/onnxruntime-node/package.json',
      '../../node_modules/.pnpm/onnxruntime-node@*/node_modules/onnxruntime-node/dist/**/*',
      '../../node_modules/.pnpm/onnxruntime-node@*/node_modules/onnxruntime-node/lib/**/*',
      '../../node_modules/.pnpm/onnxruntime-node@*/node_modules/onnxruntime-node/bin/napi-v6/linux/x64/**/*',
      '../../node_modules/.pnpm/sharp@*/**/*',
      '../../node_modules/.pnpm/@img+sharp-linux-x64@*/**/*',
      '../../node_modules/.pnpm/@img+sharp-libvips-linux-x64@*/**/*',
      '../../node_modules/.pnpm/kordoc@*/node_modules/kordoc/**/*',
      '../../node_modules/.pnpm/@huggingface+transformers@*/**/*',
      '../../node_modules/.pnpm/@hyzyla+pdfium@*/**/*',
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
