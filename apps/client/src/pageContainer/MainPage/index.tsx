'use client';

import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { MyMemberInfoType, MyTotalTestResultType } from 'types';

import {
  Footer,
  LoginNoticeDialog,
  PassResultDialog,
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
  TestResultDialog,
} from 'client/components';

import DevNoticeDialog from './DevNoticeDialog';

interface MainPageProps {
  memberInfo: MyMemberInfoType | undefined;
  resultInfo: MyTotalTestResultType | undefined;
  isServerHealthy: boolean;
  errorParam?: string;
}

const MainPage = ({ memberInfo, resultInfo, isServerHealthy, errorParam }: MainPageProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPassOpen, setIsPassOpen] = useState<boolean>(false);

  useEffect(() => {
    if (errorParam) {
      toast.error('로그인에 실패했습니다.');
    }
  }, [errorParam]);

  useEffect(() => {
    const today = new Date().toDateString();
    const hideDialog = localStorage.getItem('hideTestResultDialog');

    if (hideDialog === today) {
      setIsOpen(false);
    } else if (resultInfo && resultInfo.firstTestPassYn !== null) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  const isFinishFirstTest = resultInfo?.secondTestPassYn === null ? true : false;

  return (
    <>
      <LoginNoticeDialog userName={memberInfo?.name} usedPath={'main'} />
      <Section1 isServerCurrentActive={isServerHealthy} />
      <Section2 />
      <Section3 isServerHealthy={isServerHealthy} />
      <Section4 />
      <Section5 />
      <Footer />
      <TestResultDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onOpenPassResultDialog={() => setIsPassOpen(true)}
        isFinishFirstTest={isFinishFirstTest}
      />
      <PassResultDialog
        isPassOpen={isPassOpen}
        setIsPassOpen={setIsPassOpen}
        resultInfo={resultInfo}
        isFinishFirstTest={isFinishFirstTest}
        memberInfo={memberInfo}
      />

      <DevNoticeDialog />
    </>
  );
};

export default MainPage;
