import {
  AchievementGradeType,
  achievementGradeValues,
  GraduationEnum,
  LiberalSystemValueEnum,
  MajorEnum,
  OneseoStatusType,
  ScreeningEnum,
} from '@repo/types';
import { cn } from '@repo/utils';

import FormColgroup from '../FormColgroup';

const tdStyle = 'border border-black';
const thStyle = 'border border-black bg-[#e9e9e9] p-[0.2vh] font-medium align-middle';

const OneseoStatus = ({ oneseo }: OneseoStatusType) => {
  const {
    graduationDate,
    graduationType,
    schoolName,
    schoolAddress,
    studentNumber,
    schoolTeacherName,
    schoolTeacherPhoneNumber,
  } = oneseo.privacyDetail;
  const {
    attendanceScore,
    volunteerScore,
    totalScore,
    generalSubjectsScoreDetail,
    artsPhysicalSubjectsScore = 0,
    totalSubjectsScore = 0,
  } = oneseo.calculatedScore;

  const isGED = graduationType === 'GED';

  const [year, month] = graduationDate.split('-');

  const achievementScoreMap: Record<string, keyof typeof generalSubjectsScoreDetail> = {
    achievement1_1: 'score1_1',
    achievement1_2: 'score1_2',
    achievement2_1: 'score2_1',
    achievement2_2: 'score2_2',
    achievement3_1: 'score3_1',
    achievement3_2: 'score3_2',
  };

  const isPreview = oneseo.oneseoId === null;
  const { liberalSystem, freeSemester } = oneseo.middleSchoolAchievement;

  const freeSemesterGradeKey =
    liberalSystem === LiberalSystemValueEnum.FREE_SEMESTER && freeSemester
      ? (`achievement${freeSemester.replace('-', '_')}` as AchievementGradeType)
      : null;

  /**
   * 자유학기로 지정된 학기에는 애초에 성적이 존재할 수 없다. 그런데 자유학기가 1-2인
   * 원서는 1학년 1학기 환산점이 score1_2(자유학기 자리)에 담겨 내려온다. 그대로 그리면
   * "1학년 2학기 성적이 있다"는 오해를 부르므로, 그 값은 원래 자리인 1-1 칸에 표시하고
   * 자유학기 칸은 빗금으로 비운다. 서버가 score1_1을 채워 주면 그 값이 우선한다.
   */
  const getConvertedScore = (gradeKey: AchievementGradeType) => {
    const ownScore = generalSubjectsScoreDetail[achievementScoreMap[gradeKey]!];
    if (ownScore !== null && ownScore !== undefined) return ownScore;

    if (gradeKey === 'achievement1_1' && freeSemesterGradeKey === 'achievement1_2') {
      return generalSubjectsScoreDetail.score1_2;
    }

    return null;
  };

  const isSemesterEmpty = (gradeKey: AchievementGradeType) => {
    if (gradeKey === freeSemesterGradeKey) return true;

    const score = getConvertedScore(gradeKey);
    if (score === null || score === undefined) return true;

    // 미리보기는 환산점만 먼저 내려오는 경우가 있어 입력값 유무로 한 번 더 확인한다.
    return isPreview && !oneseo.middleSchoolAchievement[gradeKey]?.length;
  };

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
      <FormColgroup />
      <tbody>
        <tr>
          <td className={cn(thStyle, 'w-[3%]', 'border-l-0', 'border-t-0')} rowSpan={9}>
            지원자 현황
          </td>
          <td className={cn(thStyle, 'border-t-0')} colSpan={2} rowSpan={3}>
            출신중학교
          </td>
          <td
            colSpan={4}
            className={cn(
              tdStyle,
              isGED && ['bg-slash', 'bg-contain', 'bg-no-repeat'],
              'border-t-0',
            )}
          >
            {!isGED && schoolName}
          </td>
          <td colSpan={6} className={cn(tdStyle, 'border-t-0')}>
            {year}년 {month}월 {GraduationEnum[graduationType]}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} colSpan={2}>
            지원자 학번
          </td>
          <td
            colSpan={2}
            className={cn(tdStyle, isGED && ['bg-slash', 'bg-contain', 'bg-no-repeat'])}
          >
            {!isGED && studentNumber}
          </td>
          <td className={cn(thStyle)} colSpan={2}>
            학교 주소
          </td>
          <td
            colSpan={4}
            className={cn(tdStyle, isGED && ['bg-slash', 'bg-contain', 'bg-no-repeat'])}
          >
            {!isGED && schoolAddress}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle, 'leading-tight')} colSpan={3}>
            원서작성자(담임)
            <br />
            성명
          </td>
          <td
            colSpan={2}
            className={cn(
              tdStyle,
              'relative',
              graduationType !== 'CANDIDATE' && ['bg-slash', 'bg-contain', 'bg-no-repeat'],
            )}
          >
            {graduationType === 'CANDIDATE' && (
              <>
                {schoolTeacherName}
                <span className={cn('absolute', 'right-1', 'top-1/2', '-translate-y-1/2')}>
                  (인)
                </span>
              </>
            )}
          </td>
          <td className={cn(thStyle, 'leading-tight')} colSpan={3}>
            원서작성자(담임)
            <br />
            연락처
          </td>
          <td
            colSpan={2}
            className={cn(
              tdStyle,
              graduationType !== 'CANDIDATE' && ['bg-slash', 'bg-contain', 'bg-no-repeat'],
            )}
          >
            {graduationType === 'CANDIDATE' && schoolTeacherPhoneNumber}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} colSpan={12}>
            전 형 구 분
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={12}>
            {ScreeningEnum[oneseo.wantedScreening]}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} rowSpan={2}>
            교과 <br /> 성적
          </td>
          {['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '예체능'].map((label) => (
            <td key={label} className={cn(thStyle)}>
              {label}
            </td>
          ))}
          <td className={cn(thStyle)} colSpan={2}>
            소계
          </td>
          <td className={cn(thStyle, 'leading-tight')} colSpan={2} rowSpan={2}>
            합계
            <br />
            (환산 총점)
          </td>
        </tr>
        <tr>
          {isGED ? (
            <>
              <td className={cn(tdStyle)} colSpan={7}>
                {oneseo.middleSchoolAchievement.gedAvgScore}
              </td>
              <td className={cn(tdStyle)} colSpan={2}>
                {totalSubjectsScore}
              </td>
            </>
          ) : (
            <>
              {achievementGradeValues.map((gradeKey) =>
                isSemesterEmpty(gradeKey) ? (
                  <td
                    key={gradeKey}
                    className={cn(tdStyle, 'bg-slash', 'bg-contain', 'bg-no-repeat')}
                  />
                ) : (
                  <td key={gradeKey} className={cn(tdStyle)}>
                    {getConvertedScore(gradeKey)}
                  </td>
                ),
              )}
              <td className={cn(tdStyle)}>{artsPhysicalSubjectsScore}</td>
              <td className={cn(tdStyle)} colSpan={2}>
                {parseFloat(
                  (
                    (oneseo.calculatedScore.generalSubjectsScore ?? 0) + artsPhysicalSubjectsScore
                  ).toFixed(3),
                )}
              </td>
            </>
          )}
        </tr>
        <tr>
          <td className={cn(thStyle)} rowSpan={2}>
            비교과 <br /> 성적
          </td>
          <td className={cn(thStyle)} colSpan={4}>
            출석
          </td>
          <td className={cn(thStyle)} colSpan={3}>
            봉사활동
          </td>
          <td className={cn(thStyle)} colSpan={2}>
            소계
          </td>
          <td className={cn(tdStyle)} colSpan={2} rowSpan={2}>
            {totalScore}
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={4}>
            {attendanceScore}
          </td>
          <td className={cn(tdStyle)} colSpan={3}>
            {volunteerScore}
          </td>
          <td className={cn(tdStyle)} colSpan={2}>
            {attendanceScore + volunteerScore}
          </td>
        </tr>
        <tr>
          <td
            className={cn(thStyle, 'border-l-0')}
            rowSpan={4}
            colSpan={2}
            style={{ height: '7vh' }}
          >
            지원구분
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} colSpan={4}>
            1지망 학과
          </td>
          <td className={cn(thStyle)} colSpan={3}>
            2지망 학과
          </td>
          <td className={cn(thStyle)} colSpan={4}>
            3지망 학과
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={4}>
            {MajorEnum[oneseo.desiredMajors.firstDesiredMajor]}
          </td>
          <td className={cn(tdStyle)} colSpan={3}>
            {MajorEnum[oneseo.desiredMajors.secondDesiredMajor]}
          </td>
          <td className={cn(tdStyle)} colSpan={4}>
            {MajorEnum[oneseo.desiredMajors.thirdDesiredMajor]}
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={11} style={{ textAlign: 'start' }}>
            1.(인공지능(AI)과/ 스마트IoT과/ 소프트웨어개발과) 중 지망 학과를 순서대로 기록. <br />
            2. 지원학과는 희망 순에 따라 3개 학과를 모두 기록해야 함.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OneseoStatus;
