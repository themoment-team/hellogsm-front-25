import { redirect } from 'next/navigation';

import { oauthLogin } from 'client/app/apis';

export default async function Callback({
  searchParams,
}: {
  searchParams: { code: string; state: string };
}) {
  const { code, state: provider } = searchParams;

  if (!code || !provider) {
    redirect('/?error=invalid_params');
  }

  if (provider === 'google' || provider === 'admin') {
    await oauthLogin('google', code, '/?error=oauth_failed');
  } else if (provider === 'kakao') {
    await oauthLogin('kakao', code, '/?error=oauth_failed');
  } else {
    redirect('/?error=invalid_provider');
  }

  // 콜백에서는 항상 클라이언트 메인으로 이동하고, 어드민 로그인 시도 여부를 쿼리로 전달
  const isStage = process.env.NEXT_PUBLIC_API_BASE_URL?.includes('stage');
  const clientBaseUrl = isStage ? 'https://www.stage.hellogsm.kr' : 'https://www.hellogsm.kr';
  const nextUrl = provider === 'admin' ? `${clientBaseUrl}/?isAdmin=true` : clientBaseUrl;

  redirect(nextUrl);
}
