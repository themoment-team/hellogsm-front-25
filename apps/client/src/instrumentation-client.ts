import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});

// eslint-disable-next-line import/namespace -- eslint-plugin-import는 @sentry/nextjs의 client 전용 export를 못 찾지만, 타입체크/런타임에서는 정상 동작함
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
