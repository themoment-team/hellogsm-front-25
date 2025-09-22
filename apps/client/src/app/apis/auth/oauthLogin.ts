import { redirect } from 'next/navigation';

import { authUrl } from 'api/libs';

interface ReturnDataType {
  status: string;
  code: number;
  message: string;
}

/**
 * 서버사이드에서 OAuth 로그인을 처리합니다.
 *
 * @param provider - OAuth 제공자 ('google' | 'kakao')
 * @param code - OAuth authorization code
 * @param redirectUrl - 실패 시 리다이렉트할 URL
 * @returns 로그인 결과
 */
export const oauthLogin = async (
  provider: 'google' | 'kakao',
  code: string,
  redirectUrl: string,
): Promise<ReturnDataType | undefined> => {
  try {
    const response = await fetch(
      new URL(authUrl.postLogin(provider), process.env.NEXT_PUBLIC_API_BASE_URL),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      },
    );

    if (!response.ok) {
      return redirect(redirectUrl);
    }

    const result = await response.json();

    return result;
  } catch {
    return redirect(redirectUrl);
  }
};
