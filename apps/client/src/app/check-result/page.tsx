import { getDate } from 'api';
import { getKoreanDate, isTimeAfter } from 'shared';

import {
  getMyFirstTestResult,
  getMyMemberInfo,
  getMyOneseo,
  getMySecondTestResult,
} from 'client/app/apis';
import { LoginNoticeDialog } from 'client/components';
import { CheckResultPage } from 'client/pageContainer';

export default async function CheckResult() {
  const [memberInfo, firstResultInfo, secondResultInfo] = await Promise.all([
    getMyMemberInfo('/check-result'),
    getMyFirstTestResult(),
    getMySecondTestResult(),
  ]);

  const resultInfo = {
    firstTestPassYn: firstResultInfo?.firstTestPassYn ?? null,
    secondTestPassYn: secondResultInfo?.secondTestPassYn ?? null,
    decidedMajor: secondResultInfo?.decidedMajor ?? null,
  };

  const dateList = await getDate();

  const currentTime = getKoreanDate();

  const isCheckFirstResult =
    !!dateList?.firstResultsAnnouncement &&
    isTimeAfter({
      baseTime: new Date(dateList.firstResultsAnnouncement),
      compareTime: currentTime,
    });

  const isCheckFinalResult =
    !!dateList?.finalResultsAnnouncement &&
    isTimeAfter({
      baseTime: new Date(dateList.finalResultsAnnouncement),
      compareTime: currentTime,
    });

  const isOneseoWrite = await getMyOneseo();

  return (
    <>
      <CheckResultPage
        memberInfo={memberInfo}
        resultInfo={resultInfo}
        isCheckFirstResult={isCheckFirstResult}
        isCheckFinalResult={isCheckFinalResult}
        isOneseoWrite={isOneseoWrite === undefined}
      />
      <LoginNoticeDialog userName={memberInfo?.name} usedPath={'check-result'} />
    </>
  );
}
