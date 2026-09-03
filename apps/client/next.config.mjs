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
  // (DirectML.dll 포함) 바이너리가 전부 들어 있어 버전당 200MB 이상이었다. linux-x64-gnu로
  // 좁혔더니 599MB로 줄었지만 여전히 초과했다 — kordoc*/**/* 글롭이 kordoc 옆의 의존성
  // 심볼릭 링크를 따라 들어가 onnxruntime-node를 다시 통째로 포함시켰다.
  //
  // kordoc 패턴을 kordoc 자체 폴더로 좁히고 @huggingface/transformers·@hyzyla/pdfium을 명시
  // 포함시켰는데도 621MB(VERCEL_ANALYZE_BUILD_OUTPUT=1 리포트 기준)였다. 리포트로 확인한
  // 실제 원인: @huggingface/transformers@4.2.0 하나가 348MB — 그 패키지 옆에도 심볼릭 링크로
  // onnxruntime-web(웹용 WASM 런타임), 별도 버전의 onnxruntime-node(1.24.3)·sharp(0.34.5)가
  // 딸려 있었다. kordoc 소스(dist/formula-*.cjs)를 직접 읽어 확인한 결과 @huggingface/
  // transformers와 @hyzyla/pdfium은 kordoc의 `formulaOcr` 옵션(수식 인식 전용, 기본 false)에서만
  // tryImport로 로드되고, 우리 라우트는 `parse(buffer, { ocr: true, tables: true })`만 호출해
  // formulaOcr을 켜지 않으므로 애초에 불필요했다 — 완전히 제외했다. 실제 이미지 OCR 경로
  // (dist/image-ocr-*.cjs가 require하는 내부 청크)가 쓰는 건 sharp와 onnxruntime-node뿐이며,
  // kordoc 옆 심볼릭 링크가 실제로 가리키는 버전은 onnxruntime-node@1.27.0·sharp@0.35.3라
  // (1.24.3/0.34.5는 transformers 전용) 그 버전만 남기도록 고정했다.
  serverExternalPackages: [
    'kordoc',
    '@napi-rs/canvas',
    'onnxruntime-node',
    'sharp',
  ],
  outputFileTracingIncludes: {
    '/api/school-record-ocr': [
      '../../node_modules/.pnpm/@napi-rs+canvas@*/node_modules/@napi-rs/canvas/**/*',
      '../../node_modules/.pnpm/@napi-rs+canvas-linux-x64-gnu@*/**/*',
      '../../node_modules/.pnpm/onnxruntime-node@1.27.0/node_modules/onnxruntime-node/package.json',
      '../../node_modules/.pnpm/onnxruntime-node@1.27.0/node_modules/onnxruntime-node/dist/**/*',
      '../../node_modules/.pnpm/onnxruntime-node@1.27.0/node_modules/onnxruntime-node/lib/**/*',
      '../../node_modules/.pnpm/onnxruntime-node@1.27.0/node_modules/onnxruntime-node/bin/napi-v6/linux/x64/**/*',
      '../../node_modules/.pnpm/sharp@0.35.3*/**/*',
      '../../node_modules/.pnpm/@img+sharp-linux-x64@0.35.3/**/*',
      '../../node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.3.2/**/*',
      '../../node_modules/.pnpm/kordoc@*/node_modules/kordoc/**/*',
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
