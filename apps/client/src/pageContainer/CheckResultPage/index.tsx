'use client';

import { useState } from 'react';

import { MyMemberInfoType, MyTotalTestResultType } from 'types';

import { PassResultDialog } from 'client/components';

import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

const divStyle = [
  'text-gray-900',
  'text-[1rem]/[1.5rem]',
  'font-semibold',
  'w-[12.3125rem]',
  'h-[6.5rem]',
  'bg-white',
  'rounded-xl',
  'p-5',
  'flex',
  'relative',
  'shadow-md',
  'cursor-pointer',
] as const;

const imgStyle = ['absolute', 'top-[2.75rem]', 'right-[1.12rem]'] as const;

const containerStyle = ['flex', 'flex-col', 'gap-10', 'items-center'] as const;

const h1Style = ['text-gray-900', 'text-[1.5rem]/[2rem]', 'font-semibold'] as const;

interface CheckResultPageProps {
  memberInfo: MyMemberInfoType | undefined;
  resultInfo: MyTotalTestResultType | undefined;
  isCheckFirstResult: boolean;
  isCheckFinalResult: boolean;
}

const CheckResultPage = ({
  memberInfo,
  resultInfo,
  isCheckFirstResult,
  isCheckFinalResult,
}: CheckResultPageProps) => {
  const { setResultAnnouncementPeriodModal, setNonSubmitterModal } = useModalStore();
  const [isFirstTest, setIsFirstTest] = useState<boolean>(true);
  const [isDialog, setIsDialog] = useState(false);

  const handleDialog = (resultStatus: boolean) => {
    if (resultInfo && resultInfo.firstTestPassYn === null && isCheckFinalResult)
      return setNonSubmitterModal(true);

    const isChecked = resultStatus ? isCheckFirstResult : isCheckFinalResult;
    if (isChecked) {
      setIsDialog(true);
    } else {
      setResultAnnouncementPeriodModal(true, isFirstTest);
    }
  };

  const handleCheckTest = (resultStatus: boolean) => {
    setIsFirstTest(resultStatus);
    handleDialog(resultStatus);
  };

  const handleDialogClick = () => {
    setIsDialog(false);
  };

  return (
    <>
      <div className={cn([containerStyle, 'mt-48'])}>
        <h1 className={cn([h1Style])}>합격 유형을 선택해주세요.</h1>
        <div className={cn('flex', 'gap-5', 'xs:flex-row', 'flex-col')}>
          <div onClick={() => handleCheckTest(true)} className={cn([divStyle])}>
            1차 합격 조회
            <img src="/images/🍀.png" className={cn([imgStyle, 'w-[3.75rem]', 'h-[3.75rem]'])} />
          </div>
          <div onClick={() => handleCheckTest(false)} className={cn([divStyle])}>
            최종 합격 조회
            <img src="/images/🏆.png" className={cn([imgStyle, 'w-[3.75rem]', 'h-[3.125rem]'])} />
          </div>
        </div>
      </div>

      <PassResultDialog
        isPassOpen={isDialog}
        setIsPassOpen={setIsDialog}
        isFinishFirstTest={isFirstTest}
        resultInfo={
          isFirstTest
            ? ({
                firstTestPassYn: resultInfo?.firstTestPassYn,
              } as MyTotalTestResultType)
            : resultInfo
        }
        memberInfo={{ name: memberInfo?.name } as MyMemberInfoType}
        onClick={handleDialogClick}
      />
    </>
  );
};

export default CheckResultPage;
