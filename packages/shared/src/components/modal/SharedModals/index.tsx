'use client';

import { useRouter } from 'next/navigation';

import { InspectionIcon } from 'shared/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'shared/components';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

const SharedModals = () => {
  const {
    systemInspectionModal,
    applicationSubmitModal,
    setApplicationSubmitModal,
    imageUploadSizeLimitModal,
    setImageUploadSizeLimitModal,
  } = useModalStore();

  const { push } = useRouter();

  return (
    <>
      <AlertDialog open={systemInspectionModal}>
        <AlertDialogContent className={cn('w-[400px]', 'rounded-[1.125rem]', 'gap-6')}>
          <div className={cn('flex', 'justify-center', 'items-center')}>
            <InspectionIcon />
          </div>
          <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
            <p className={cn('text-gray-900', 'text-[1.5rem]/[2rem]', 'font-semibold')}>
              서비스 점검 중
            </p>
            <p
              className={cn(
                'text-gray-500',
                'text-[1.25rem]/[1.75rem]',
                'font-normal',
                'text-center',
              )}
            >
              현재 문자인증 오류로 잠시 시스템 점검 중입니다.
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={applicationSubmitModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {applicationSubmitModal.type === 'client' ? (
                <>
                  원서가 제출되었습니다.
                  <br />
                  문제가 있다면
                  <br />
                  062-949-6800(교무실)로 연락주세요.
                </>
              ) : (
                <>원서가 수정되었습니다.</>
              )}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                push(applicationSubmitModal.type === 'client' ? '/mypage' : '/');
                setApplicationSubmitModal(false);
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={imageUploadSizeLimitModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>이미지는 5MB 이하만 가능합니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setImageUploadSizeLimitModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SharedModals;
