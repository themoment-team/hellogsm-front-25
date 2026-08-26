import { parse } from 'kordoc';
import { NextRequest, NextResponse } from 'next/server';

import { convertKordocBlocks } from '@/lib/kordoc/achievementTextConverter';

// kordoc은 Node 전용 라이브러리(파일 시스템, sharp 네이티브 모듈 등)라 Edge 런타임에서 못 돈다.
export const runtime = 'nodejs';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

// axiosInstance의 응답 인터셉터가 백엔드(Java) 응답 형식({code, data, message, status})을
// 가정하고 response.data.data를 꺼내 쓴다. 이 라우트도 같은 형식으로 감싸야 클라이언트의
// 공용 post() 훅이 그대로 통한다.
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ code: status, message, status: `${status}` }, { status });

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return errorResponse('파일이 없습니다.', 400);
  }

  if (file.type !== 'application/pdf') {
    return errorResponse('PDF 파일만 지원합니다.', 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return errorResponse('파일 용량은 20MB 이하만 지원합니다.', 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await parse(buffer, { ocr: true, tables: true });

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] kordoc 파싱 실패', result.error, result.code);
    return errorResponse('생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.', 422);
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug(
      '[KORDOC-DEBUG] qualitySummary',
      JSON.stringify(result.qualitySummary),
      'warnings',
      JSON.stringify(result.warnings),
    );
  }

  const { rawText, unrecognizedSubjectBlobs } = convertKordocBlocks(result.blocks);

  const totalPages = result.qualitySummary?.totalPages ?? result.pageCount ?? 0;
  const lowTextPageCount = result.qualitySummary?.lowTextPageCount ?? 0;
  const usedOcr = lowTextPageCount > 0;
  const hasTextLayer = lowTextPageCount < totalPages;

  return NextResponse.json({
    code: 200,
    data: {
      rawText,
      unrecognizedSubjectBlobs,
      hasTextLayer,
      source: usedOcr ? 'OCR' : 'TEXT_LAYER',
      pageCount: result.pageCount ?? totalPages,
    },
    message: 'OK',
    status: '200 OK',
  });
}
