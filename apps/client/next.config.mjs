import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactCompiler: true,
  // kordoc(OCR)과 그 하위 의존성(@napi-rs/canvas, onnxruntime-node, sharp 등)은 플랫폼별
  // 네이티브 바이너리를 포함한 패키지다. serverExternalPackages만으로는 부족했다 — 실제
  // Vercel 배포 로그로 확인해보니 "Cannot find module '@napi-rs/canvas'"였다. pdfjs-dist가
  // 이 패키지를 try/catch로 감싸 선택적으로 require하다 보니, Next.js의 자동 파일 트레이싱이
  // "없어도 되는 optional require"로 보고 배포 번들에 아예 안 넣어버린 것 — @napi-rs/canvas가
  // apps/client의 직접 의존성이 아니라 pdfjs-dist/kordoc의 선택적 하위 의존성이라 더 그렇다.
  //
  // outputFileTracingIncludes의 glob 패턴으로 필요한 파일을 강제 포함시키는 방식을 시도했으나
  // (961MB → 599MB → 621MB → 176MB로 크기는 정확히 맞췄음에도) 크기와 무관하게 Vercel
  // 배포가 "Deploying outputs..." 단계에서 에러 메시지 하나 없이 매번 실패했다 — 반면
  // outputFileTracingIncludes를 아예 안 쓴 빌드는 정상 배포됐다. 즉 문제는 파일 크기가 아니라
  // outputFileTracingIncludes라는 메커니즘 자체가 이 프로젝트의 Vercel 배포 파이프라인과
  // 충돌한 것으로 보인다.
  //
  // 대신 @napi-rs/canvas, onnxruntime-node, sharp를 apps/client의 직접 의존성으로 선언했다.
  // 로컬 `next build`가 생성한 .nft.json으로 직접 확인한 결과, onnxruntime-node(17개 파일)와
  // sharp(324개 파일)는 직접 의존성으로 선언하는 것만으로 Next.js 자동 트레이싱이 정확히
  // 찾아냈다 — 이 둘은 outputFileTracingIncludes가 더 이상 필요 없다.
  //
  // 반면 @napi-rs/canvas는 직접 의존성으로 선언해도 0개 파일만 트레이싱됐다. pdfjs-dist가
  // 이 패키지를 자신의 package.json에 전혀 선언하지 않고 런타임에 optional로만 찾다 보니,
  // Next.js의 정적 분석이 원천적으로 이 require를 발견하지 못하는 것으로 보인다. 이 패키지
  // 하나에 한해서만 outputFileTracingIncludes로 명시 포함시킨다 — 이전에 시도했던 10개짜리
  // 광범위한 패턴 세트(onnxruntime-node/sharp/kordoc까지 전부 포함)는 크기를 176MB까지
  // 정확히 맞췄음에도 매번 "Deploying outputs..." 단계에서 원인 불명으로 배포가 실패했다.
  // 이번엔 @napi-rs/canvas 전용 2개 패턴(약 32MB)만 최소로 남겨 그 문제를 피했다.
  //
  // 그런데도 배포 후 런타임 로그에 여전히 동일한 "Cannot find module '@napi-rs/canvas'"가
  // 남아 있었다. 로컬 node_modules를 직접 열어 확인한 결과: pnpm은
  // `.pnpm/pdfjs-dist@.../node_modules/@napi-rs/canvas`에 실제 패키지를 가리키는 심볼릭
  // 링크를 별도로 만들어 두는데, 이게 있어야 pdfjs-dist 내부의 `require('@napi-rs/canvas')`가
  // Node의 상위 디렉터리 탐색으로 실제 파일을 찾는다. 위 두 패턴은 canvas 패키지의 "실제 파일
  // 내용"만 복사했을 뿐 이 심볼릭 링크 자체는 포함한 적이 없었다 — 파일은 배포판 어딘가에
  // 있어도 require 탐색 경로상에 연결 고리가 없어 계속 실패했던 것.
  //
  // 이 심볼릭 링크 경로를 그대로(디렉터리 자체로) 추가했더니 Vercel이 배포 자체를 거부했다 —
  // "The framework produced an invalid deployment package... files in symlinked directories."
  // 지금까지 outputFileTracingIncludes를 쓴 모든 시도가 크기와 무관하게 "Deploying outputs..."
  // 단계에서 원인 불명으로 실패했던 진짜 이유가 바로 이것이었다 — 이전의 넓은 와일드카드
  // 패턴들은 `**/*`로 심볼릭 링크를 따라가 실제 파일만 복사했기 때문에 우연히 이 문제를
  // 피했을 뿐, 정작 필요한 pdfjs-dist 쪽 연결 심볼릭 링크는 없어서 별도로 실패했던 것.
  // 심볼릭 링크 경로 뒤에도 `/**/*`를 붙여, 링크를 따라간 실제 파일을 그 위치에 그대로
  // 복사하도록 했다 — 배포판에는 심볼릭 링크가 아니라 진짜 파일이 놓이므로 Vercel도
  // 받아들이고, Node의 require 탐색도 정상적으로 성공한다.
  //
  // @napi-rs/canvas의 js-binding.js는 플랫폼 바이너리를 두 단계로 찾는다: ① 같은 폴더의
  // 로컬 파일(`./skia.linux-x64-gnu.node`, 우리가 만들 수 없는 경로라 항상 실패) →
  // ② 실패하면 별도 패키지명 `require('@napi-rs/canvas-linux-x64-gnu')`. ②는 Node가 상위
  // 디렉터리를 타고 올라가며 찾는데, pnpm이 `.pnpm/node_modules/`라는 공용 hoist 폴더에
  // 이 패키지의 심볼릭 링크를 만들어 두어 `.pnpm/` 아래 어디서 호출되든 이 경로를 통해
  // 찾을 수 있다. 이 hoist 심볼릭 링크도 같은 이유로 `/**/*`를 붙여 실제 파일로 풀어
  // 포함시킨다.
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
      '../../node_modules/.pnpm/pdfjs-dist@*/node_modules/@napi-rs/canvas/**/*',
      '../../node_modules/.pnpm/node_modules/@napi-rs/canvas-linux-x64-gnu/**/*',
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
