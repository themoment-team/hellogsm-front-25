import {
  GraduationEnum,
  ScreeningEnum,
  MajorEnum,
  achievementGradeValues,
  OneseoStatusType,
} from 'types';

import { cn } from 'shared/lib/utils';

const tdStyle = 'border border-black ';

const OneseoStatus = ({ oneseo }: OneseoStatusType) => {
  const isGEDScore = !!oneseo.middleSchoolAchievement.gedAvgScore;

  const graduationDate = oneseo.privacyDetail.graduationDate.split('-');

  return (
    <table
      className={cn(
        'mx-auto',
        'w-full',
        'border-collapse',
        'text-center',
        'text-[1.2vh]',
        'leading-[2.2vh]',
      )}
    >
      <tbody>
        <tr>
          <td
            className={cn(
              'w-[3%]',
              'border',
              'border-l-0',
              'border-t-0',
              'border-black',
              'bg-[#e9e9e9]',
              'p-[0.2vh]',
              'align-middle',
              'font-medium',
            )}
            rowSpan={9}
          >
            지원자 현황
          </td>
        </tr>
        <tr>
          <td
            className={cn(
              'border',
              'border-t-0',
              'border-black',
              'bg-[#e9e9e9]',
              'p-[0.2vh]',
              'align-middle',
              'font-medium',
            )}
            colSpan={2}
            rowSpan={2}
          >
            출신중학교
          </td>
          {oneseo.privacyDetail.graduationType === 'GED' ? (
            <td
              colSpan={2}
              className={cn('bg-slash', 'bg-contain', 'bg-no-repeat', 'border-r', 'border-black')}
            />
          ) : (
            <td className={cn('border', 'border-t-0', 'border-black')} colSpan={2}>
              {oneseo.privacyDetail.schoolName}
            </td>
          )}
          <td className={cn('border-r', 'border-black')} colSpan={6}>
            {graduationDate[0]}년 {graduationDate[1]}월{' '}
            {GraduationEnum[oneseo.privacyDetail.graduationType]}
          </td>
        </tr>
        <tr>
          <td
            className={cn(
              'border',
              'border-black',
              'bg-[#e9e9e9]',
              'p-[0.2vh]',
              'align-middle',
              'font-medium',
            )}
          >
            지역명
          </td>
          {oneseo.privacyDetail.graduationType === 'GED' ? (
            <td colSpan={7} className={cn('border', 'border-black', 'bg-slash')} />
          ) : (
            <td className={cn('border', 'border-black')} colSpan={7}>
              {oneseo.privacyDetail.schoolAddress}
            </td>
          )}
        </tr>
        <tr>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            colSpan={10}
          >
            전 형 구 분
          </td>
        </tr>
        <tr>
          <td className={cn('border', 'border-black')} colSpan={10}>
            {ScreeningEnum[oneseo.wantedScreening]}
          </td>
        </tr>
        <tr>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            rowSpan={2}
            style={{ width: '10%' }}
          >
            교과 <br /> 성적
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            1-1
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            1-2
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            2-1
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            2-2
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            3-1
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            3-2
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            예체능
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            소계
          </td>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            rowSpan={2}
          >
            합계 (환산총점)
          </td>
        </tr>
        <tr>
          {achievementGradeValues.map((gradeKey) => {
            const achievementScoreConvertor: {
              [key: string]:
                | 'score1_1'
                | 'score1_2'
                | 'score2_1'
                | 'score2_2'
                | 'score3_1'
                | 'score3_2';
            } = {
              achievement1_1: 'score1_1',
              achievement1_2: 'score1_2',
              achievement2_1: 'score2_1',
              achievement2_2: 'score2_2',
              achievement3_1: 'score3_1',
              achievement3_2: 'score3_2',
            };

            // 검정고시나 자유학기제로 점수가 없다면 빈칸 처리
            return isGEDScore || !oneseo.middleSchoolAchievement[gradeKey]?.length ? (
              <td key={gradeKey} className={tdStyle + 'bg-slash w-[2.6875rem]'}></td>
            ) : (
              <td key={gradeKey} className={cn('border', 'border-black')}>
                {
                  oneseo.calculatedScore.generalSubjectsScoreDetail[
                    achievementScoreConvertor[gradeKey]
                  ]
                }
              </td>
            );
          })}
          {isGEDScore ? (
            <td className={tdStyle + 'bg-slash w-[2.6875rem]'}></td>
          ) : (
            <td className={cn('border', 'border-black')}>
              {oneseo.calculatedScore.artsPhysicalSubjectsScore}
            </td>
          )}
          <td className={cn('border', 'border-black')}>
            {oneseo.privacyDetail.graduationType === 'GED'
              ? oneseo.calculatedScore.totalSubjectsScore
              : parseFloat(
                  (
                    oneseo.calculatedScore.generalSubjectsScore! +
                    oneseo.calculatedScore.artsPhysicalSubjectsScore!
                  ).toFixed(3),
                )}
          </td>
        </tr>
        <tr>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            rowSpan={2}
          >
            비교과 <br /> 성적
          </td>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            colSpan={4}
          >
            출석
          </td>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            colSpan={3}
          >
            봉사활동
          </td>
          <td className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}>
            소계
          </td>
          <td className={cn('border', 'border-black')} colSpan={2} rowSpan={2}>
            {oneseo.calculatedScore.totalScore}
          </td>
        </tr>
        <tr>
          <td className={cn('border', 'border-black')} colSpan={4}>
            {oneseo.calculatedScore.attendanceScore}
          </td>
          <td className={cn('border', 'border-black')} colSpan={3}>
            {oneseo.calculatedScore.volunteerScore}
          </td>
          <td className={cn('border', 'border-black')}>
            {oneseo.calculatedScore.attendanceScore + oneseo.calculatedScore.volunteerScore}
          </td>
        </tr>
        <tr>
          <td
            className={cn(
              'border',
              'border-l-0',
              'border-black',
              'bg-[#e9e9e9]',
              'p-[0.2vh]',
              'font-medium',
            )}
            rowSpan={4}
            colSpan={2}
            style={{ height: '7vh' }}
          >
            지원구분
          </td>
        </tr>
        <tr>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            colSpan={4}
          >
            1지망 학과
          </td>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            colSpan={3}
          >
            2지망 학과
          </td>
          <td
            className={cn('border', 'border-black', 'bg-[#e9e9e9]', 'p-[0.2vh]', 'font-medium')}
            colSpan={2}
          >
            3지망 학과
          </td>
        </tr>
        <tr>
          <td className={cn('border', 'border-black')} colSpan={4}>
            {MajorEnum[oneseo.desiredMajors.firstDesiredMajor]}
          </td>
          <td className={cn('border', 'border-black')} colSpan={3}>
            {MajorEnum[oneseo.desiredMajors.secondDesiredMajor]}
          </td>
          <td className={cn('border', 'border-black')} colSpan={2}>
            {MajorEnum[oneseo.desiredMajors.thirdDesiredMajor]}
          </td>
        </tr>
        <tr>
          <td className={cn('border', 'border-black')} colSpan={9} style={{ textAlign: 'start' }}>
            1.(인공지능과/ 스마트IoT과/ 소프트웨어개발과) 중 지망 학과를 순서대로 기록. <br />
            2. 지원학과는 희망 순에 따라 3개 학과를 모두 기록해야 함.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OneseoStatus;
