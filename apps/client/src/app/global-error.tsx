'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            height: '100vh',
          }}
        >
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>문제가 발생했습니다</p>
          <p style={{ color: '#64748b' }}>
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '3rem',
              border: '1px solid #64748b',
              color: '#64748b',
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
