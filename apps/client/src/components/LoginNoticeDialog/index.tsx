'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  LoginDialog,
} from 'shared';

import { cn } from 'shared/lib/utils';

import { useGetMyAuthInfo } from 'api/hooks';

interface LoginNoticeDialogProps {
  userName: string | undefined;
  usedPath: 'main' | 'check-result';
}

const LoginNoticeDialog = ({ userName, usedPath }: LoginNoticeDialogProps) => {
  const { data: authInfo, isLoading } = useGetMyAuthInfo();
  const [isDialog, setIsDialog] = useState(false);

  const isMain = usedPath === 'main' ? true : false;

  const { back } = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isShowModalFF = process.env.NEXT_PUBLIC_SHOW_LOGIN_MODAL_FF === 'true' && isMain;

    const isNotLoggedIn = !authInfo?.authReferrerType || !userName;

    if (isNotLoggedIn && (isShowModalFF || !isMain)) {
      setIsDialog(true);
    }
  }, [isLoading]);

  return (
    <AlertDialog open={isDialog} onOpenChange={setIsDialog}>
      <AlertDialogContent className={cn('w-[400px]')}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <strong>
              {isMain ? '성적 조회를 하시려면 로그인을 진행해주세요' : '로그인을 먼저 진행해주세요'}
            </strong>
            <br />
            <br />
            학부모/담임교사 합격 확인 시, 보안상의 문제로 <br />
            본인 확인을 위해 회원가입 후 학부모/담임교사의 <br />
            본인 로그인이 필요합니다. <br />
            <br /> 빠른 확인을 원하시는 경우, 062-949-6843로 전화 주시면 친절히 안내해 드리겠습니다.{' '}
            <br /> 번거롭게 해드려 죄송합니다.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <LoginDialog />
          <AlertDialogAction onClick={!isMain ? () => back() : undefined}>다음에</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginNoticeDialog;
