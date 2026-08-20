'use client';

import Script from 'next/script';

import { flushGAEventQueue } from '@repo/utils';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js
				?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        onReady={flushGAEventQueue}
        dangerouslySetInnerHTML={{
          __html: `
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', '${gaId}');
		`,
        }}
      />
    </>
  );
}
