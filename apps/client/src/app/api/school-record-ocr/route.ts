import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parse } from 'kordoc';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { memberUrl } from '@repo/api/lib';

import { convertKordocBlocks } from '@/lib/kordoc/achievementTextConverter';

// kordoc은 Node 전용 라이브러리(파일 시스템, sharp 네이티브 모듈 등)라 Edge 런타임에서 못 돈다.
export const runtime = 'nodejs';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

// 파일은 브라우저에서 S3로 직접 PUT 업로드되고 이 라우트는 objectKey만 받는다 — Vercel
// Function 요청 본문은 4.5MB 하드 캡이라 PDF를 이 라우트로 직접 흘려보낼 수 없다.
const s3Client = new S3Client({ region: process.env.AWS_REGION });

// axiosInstance의 응답 인터셉터가 백엔드(Java) 응답 형식({code, data, message, status})을
// 가정하고 response.data.data를 꺼내 쓴다. 이 라우트도 같은 형식으로 감싸야 클라이언트의
// 공용 post() 훅이 그대로 통한다.
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ code: status, message, status: `${status}` }, { status });

/**
 * 이 라우트는 인증·요청 제한 없이 그대로 두면 로그인 없이도 누구나 S3에서 파일을 내려받아
 * 20MB짜리 OCR을 돌릴 수 있어 리소스 남용에 노출된다(리뷰 지적). kordoc을 실행하기 전에
 * 로그인 페이지들이 쓰는 것과 같은 SESSION 쿠키를 백엔드 인증 확인 엔드포인트로 검증해
 * 비로그인 요청을 걷어낸다. 요청 빈도 제한(rate limit)은 이 라우트 코드가 아니라
 * 인프라(Vercel/백엔드) 쪽에서 적용하기로 했다.
 */
const isAuthenticated = async (): Promise<boolean> => {
  const session = (await cookies()).get('SESSION')?.value;
  if (!session) return false;

  try {
    const response = await fetch(
      new URL(memberUrl.getMyAuthInfo(), process.env.NEXT_PUBLIC_API_BASE_URL),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SESSION=${session}`,
        },
      },
    );
    return response.ok;
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return errorResponse('로그인이 필요합니다.', 401);
  }

  const { objectKey } = (await request.json().catch(() => ({}))) as { objectKey?: string };

  if (!objectKey) {
    return errorResponse('objectKey가 없습니다.', 400);
  }

  let buffer: Buffer;
  try {
    const object = await s3Client.send(
      new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: objectKey }),
    );
    const byteArray = await object.Body?.transformToByteArray();
    if (!byteArray) {
      throw new Error('empty S3 object body');
    }
    buffer = Buffer.from(byteArray);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] S3에서 파일을 내려받지 못함', error);
    return errorResponse('업로드된 파일을 찾지 못했어요. 다시 업로드해주세요.', 404);
  }

  if (buffer.byteLength > MAX_FILE_SIZE) {
    return errorResponse('파일 용량은 20MB 이하만 지원합니다.', 400);
  }

  // 손상되거나 암호화된 PDF는 kordoc이 ParseFailure로 감싸 돌려주지 않고 그냥 throw할 수
  // 있다 — 감싸지 않으면 이 요청이 처리되지 않은 예외로 500이 되어, 사용자에게 "파일을
  // 다시 시도해달라" 안내 대신 알 수 없는 서버 오류로 보인다.
  let result;
  try {
    result = await parse(buffer, { ocr: true, tables: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] kordoc 파싱 중 예외 발생', error);
    return errorResponse('생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.', 422);
  }

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
