import { GENERAL_SUBJECTS } from '@repo/constants';
import { OneseoStatusType } from '@repo/types';
import { cn } from '@repo/utils';

import { scoreToAlphabet } from '../scoreUtils';

type SemesterKey = '1_1' | '1_2' | '2_1' | '2_2' | '3_1' | '3_2';

const semesterLabels: Record<SemesterKey, string> = {
  '1_1': '1학년 1학기',
  '1_2': '1학년 2학기',
  '2_1': '2학년 1학기',
  '2_2': '2학년 2학기',
  '3_1': '3학년 1학기',
  '3_2': '3학년 2학기',
};

const GeneralSubjectsTable = ({ oneseo }: OneseoStatusType) => {
  const { graduationType } = oneseo.privacyDetail;
  const isPreview = oneseo.oneseoId === null;
  const freeSemesterKey = oneseo.middleSchoolAchievement.freeSemester
    ? (oneseo.middleSchoolAchievement.freeSemester.replace('-', '_') as SemesterKey)
    : null;
  const { generalSubjectsScoreDetail } = oneseo.calculatedScore;
  const subjects = [...GENERAL_SUBJECTS, ...(oneseo.middleSchoolAchievement.newSubjects ?? [])];

  const isFreeSemester = oneseo.middleSchoolAchievement.liberalSystem === '자유학기제';

  const semesters: SemesterKey[] =
    graduationType === 'CANDIDATE'
      ? ['1_1', '1_2', '2_1', '2_2', '3_1']
      : isFreeSemester
        ? ['1_1', '1_2', '2_1', '2_2', '3_1', '3_2']
        : ['2_1', '2_2', '3_1', '3_2'];

  const getScores = (key: SemesterKey) =>
    oneseo.middleSchoolAchievement[
      `achievement${key}` as keyof typeof oneseo.middleSchoolAchievement
    ] as (number | null)[] | undefined;

  const getConvertedScore = (key: SemesterKey) =>
    generalSubjectsScoreDetail[`score${key}` as keyof typeof generalSubjectsScoreDetail];

  /**
   * 이 표(전형성적 입력 확인서)는 환산점이 아니라 "지원자가 실제로 입력한 성취도"를
   * 보여주는 서식이다. 예전에는 환산점(generalSubjectsScoreDetail)이 없으면 학기를
   * 통째로 빗금 처리했는데, 그러면 서버가 성취도는 내려주면서 환산점은 아직 못 채우는
   * 학기(자유학기제가 1-2인 원서의 1학년 1학기)가 입력값까지 같이 가려져 버린다.
   * 그래서 칸을 채울지 말지는 입력값(middleSchoolAchievement)만 보고 판단한다.
   */
  const isSemesterEmpty = (key: SemesterKey) => {
    if (key === freeSemesterKey) return true;

    const hasAchievement = getScores(key)?.some((score) => score !== null && score !== undefined);
    if (hasAchievement) return false;

    // 미리보기 응답은 성취도 배열이 비어 오는 경우가 있어 환산점 유무로 한 번 더 확인한다.
    return !isPreview || getConvertedScore(key) === null || getConvertedScore(key) === undefined;
  };

  return (
    <table className={cn('w-full', 'border', 'border-black', 'text-center')}>
      <thead>
        <tr>
          <td rowSpan={2} className={cn('w-20', 'border', 'border-black', 'bg-backslash', 'p-1')}>
            <div className={cn('h-[1.2vh]', 'text-right')}>학년</div>
            <div className={cn('h-[1.2vh]', 'text-left')}>과목</div>
          </td>
          {semesters.map((key) => (
            <td
              key={key}
              className={cn('h-[2.2vh]', 'border', 'border-black', 'bg-gray-200', 'p-[0.2vh]')}
            >
              {semesterLabels[key]}
            </td>
          ))}
        </tr>
        <tr>
          {semesters.map((key) => (
            <td
              key={`${key}-성취도`}
              className={cn('h-[2.2vh]', 'border', 'border-black', 'bg-gray-200', 'p-[0.2vh]')}
            >
              성취도
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        {subjects.map((subject, rowIdx) => (
          <tr key={subject}>
            <td className={cn('border', 'border-black')}>{subject}</td>
            {semesters.map((key) => {
              if (isSemesterEmpty(key)) {
                if (rowIdx === 0) {
                  return (
                    <td
                      key={`${key}-empty`}
                      rowSpan={subjects.length}
                      className={cn(
                        'border',
                        'border-black',
                        'bg-slash',
                        'bg-contain',
                        'bg-no-repeat',
                      )}
                    />
                  );
                }
                return null;
              }

              const scores = getScores(key);

              return (
                <td key={`${key}-${rowIdx}`} className={cn('border', 'border-black')}>
                  {scoreToAlphabet[scores?.[rowIdx] ?? -1] ?? ''}
                </td>
              );
            })}
          </tr>
        ))}

        <tr>
          <td className={cn('border', 'border-black')}>환산점</td>
          {semesters.map((key) => (
            <td key={`${key}-total`} className={cn('border', 'border-black')}>
              {isSemesterEmpty(key) ? '' : (getConvertedScore(key) ?? '')}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default GeneralSubjectsTable;
