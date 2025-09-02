import { OneseoStatusType } from 'types';

import { scoreToAlphabet } from 'client/utils/scoreUtils';

import { GENERAL_SUBJECTS } from 'shared/constants';
import { cn } from 'shared/lib/utils';

const GeneralSubjectsTable = ({ oneseo }: OneseoStatusType) => {
  return (
    <div className={cn('flex', 'h-fit', 'border', 'border-black')}>
      <div className={cn('flex', 'w-full', 'flex-col', 'border-r', 'border-black')}>
        <div className={cn('relative', 'z-10', 'border-b', 'border-black', 'bg-backslash')}>
          <div className={cn('h-[2.2vh]', 'text-right')}>학년</div>
          <div className={cn('h-[2.2vh]', 'text-left')}>과목</div>
        </div>
        {[...GENERAL_SUBJECTS, ...(oneseo.middleSchoolAchievement.newSubjects ?? [])].map(
          (subject) => (
            <div
              key={subject}
              className={cn('flex', 'items-center', 'justify-center', 'border-b', 'border-black')}
            >
              {subject}
            </div>
          ),
        )}
        <div className={cn('flex', 'items-center', 'justify-center')}>환산점</div>
      </div>
      {oneseo.privacyDetail.graduationType === 'CANDIDATE' && (
        <div className={cn('flex', 'w-full', 'flex-col', 'border-b-0', 'border-r', 'border-black')}>
          <div className={cn('flex', 'flex-col')}>
            <div
              className={cn(
                'h-[2.2vh]',
                'border-b',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
                'font-bold',
              )}
            >
              1학년 1학기
            </div>
            <div
              className={cn(
                'h-[2.2vh]',
                'border-b',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
                'font-bold',
              )}
            >
              성취도
            </div>
          </div>
          {!oneseo.calculatedScore.generalSubjectsScoreDetail.score1_1 ? (
            <div className={cn('h-full', 'bg-slash', 'bg-contain', 'bg-no-repeat')} />
          ) : (
            <>
              {oneseo.middleSchoolAchievement.achievement1_1!.map((score, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex',
                    'items-center',
                    'justify-center',
                    'border-b',
                    'border-black',
                  )}
                >
                  {scoreToAlphabet[score]}
                </div>
              ))}
              <div
                className={cn(
                  'flex',
                  'items-center',
                  'justify-center',
                  'border-b-0',
                  'border-black',
                )}
              >
                {oneseo.calculatedScore.generalSubjectsScoreDetail.score1_1}
              </div>
            </>
          )}
        </div>
      )}
      {oneseo.privacyDetail.graduationType === 'CANDIDATE' && (
        <div className={cn('flex', 'w-full', 'flex-col', 'border-r', 'border-black')}>
          <div className={cn('flex', 'flex-col')}>
            <div
              className={cn(
                'h-[2.2vh]',
                'border-b',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
                'font-bold',
              )}
            >
              1학년 2학기
            </div>
            <div
              className={cn(
                'h-[2.2vh]',
                'border-b',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
                'font-bold',
              )}
            >
              성취도
            </div>
          </div>
          {!oneseo.calculatedScore.generalSubjectsScoreDetail.score1_2 ? (
            <div className={cn('h-full', 'bg-slash', 'bg-contain', 'bg-no-repeat')} />
          ) : (
            <>
              {oneseo.middleSchoolAchievement.achievement1_2!.map((score, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex',
                    'items-center',
                    'justify-center',
                    'border-b',
                    'border-black',
                  )}
                >
                  {scoreToAlphabet[score]}
                </div>
              ))}
              <div
                className={cn(
                  'flex',
                  'items-center',
                  'justify-center',
                  'border-b-0',
                  'border-black',
                )}
              >
                {oneseo.calculatedScore.generalSubjectsScoreDetail.score1_2}
              </div>
            </>
          )}
        </div>
      )}
      <div className={cn('flex', 'w-full', 'flex-col', 'border-r', 'border-black')}>
        <div className={cn('flex', 'flex-col')}>
          <div
            className={cn(
              'h-[2.2vh]',
              'border-b',
              'border-black',
              'bg-gray-200',
              'p-[0.2vh]',
              'text-center',
              'font-bold',
            )}
          >
            2학년 1학기
          </div>
          <div
            className={cn(
              'h-[2.2vh]',
              'border-b',
              'border-black',
              'bg-gray-200',
              'p-[0.2vh]',
              'text-center',
              'font-bold',
            )}
          >
            성취도
          </div>
        </div>
        {!oneseo.calculatedScore.generalSubjectsScoreDetail.score2_1 ? (
          <div className={cn('h-full', 'bg-slash', 'bg-contain', 'bg-no-repeat')} />
        ) : (
          <>
            {oneseo.middleSchoolAchievement.achievement2_1!.map((score, i) => (
              <div
                key={i}
                className={cn('flex', 'items-center', 'justify-center', 'border-b', 'border-black')}
              >
                {scoreToAlphabet[score]}
              </div>
            ))}
            <div
              className={cn('flex', 'items-center', 'justify-center', 'border-b-0', 'border-black')}
            >
              {oneseo.calculatedScore.generalSubjectsScoreDetail.score2_1}
            </div>
          </>
        )}
      </div>
      <div className={cn('flex', 'w-full', 'flex-col', 'border-r', 'border-black')}>
        <div className={cn('flex', 'flex-col')}>
          <div
            className={cn(
              'h-[2.2vh]',
              'border-b',
              'border-black',
              'bg-gray-200',
              'p-[0.2vh]',
              'text-center',
              'font-bold',
            )}
          >
            2학년 2학기
          </div>
          <div
            className={cn(
              'h-[2.2vh]',
              'border-b',
              'border-black',
              'bg-gray-200',
              'p-[0.2vh]',
              'text-center',
              'font-bold',
            )}
          >
            성취도
          </div>
        </div>
        {!oneseo.calculatedScore.generalSubjectsScoreDetail.score2_2 ? (
          <div className={cn('h-full', 'bg-slash', 'bg-contain', 'bg-no-repeat')} />
        ) : (
          <>
            {oneseo.middleSchoolAchievement.achievement2_2!.map((score, i) => (
              <div
                key={i}
                className={cn('flex', 'items-center', 'justify-center', 'border-b', 'border-black')}
              >
                {scoreToAlphabet[score]}
              </div>
            ))}
            <div
              className={cn('flex', 'items-center', 'justify-center', 'border-b-0', 'border-black')}
            >
              {oneseo.calculatedScore.generalSubjectsScoreDetail.score2_2}
            </div>
          </>
        )}
      </div>
      <div
        className={cn(
          'flex',
          'w-full',
          'flex-col',
          oneseo.privacyDetail.graduationType === 'CANDIDATE' ? '' : 'border-r',
          'border-black',
        )}
      >
        <div className={cn('flex', 'flex-col')}>
          <div
            className={cn(
              'h-[2.2vh]',
              'border-b',
              'border-black',
              'bg-gray-200',
              'p-[0.2vh]',
              'text-center',
              'font-bold',
            )}
          >
            3학년 1학기
          </div>
          <div
            className={cn(
              'h-[2.2vh]',
              'border-b',
              'border-black',
              'bg-gray-200',
              'p-[0.2vh]',
              'text-center',
              'font-bold',
            )}
          >
            성취도
          </div>
        </div>
        {!oneseo.calculatedScore.generalSubjectsScoreDetail.score3_1 ? (
          <div className={cn('h-full', 'bg-slash', 'bg-contain', 'bg-no-repeat')} />
        ) : (
          <>
            {oneseo.middleSchoolAchievement.achievement3_1!.map((score, i) => (
              <div
                key={i}
                className={cn('flex', 'items-center', 'justify-center', 'border-b', 'border-black')}
              >
                {scoreToAlphabet[score]}
              </div>
            ))}
            <div
              className={cn('flex', 'items-center', 'justify-center', 'border-b-0', 'border-black')}
            >
              {oneseo.calculatedScore.generalSubjectsScoreDetail.score3_1}
            </div>
          </>
        )}
      </div>
      {oneseo.privacyDetail.graduationType !== 'CANDIDATE' && (
        <div className={cn('flex', 'w-full', 'flex-col', 'border-black')}>
          <div className={cn('flex', 'flex-col')}>
            <div
              className={cn(
                'h-[2.2vh]',
                'border-b',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
                'font-bold',
              )}
            >
              3학년 2학기
            </div>
            <div
              className={cn(
                'h-[2.2vh]',
                'border-b',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
                'font-bold',
              )}
            >
              성취도
            </div>
          </div>
          {!oneseo.calculatedScore.generalSubjectsScoreDetail.score3_2 ? (
            <div className={cn('h-full', 'bg-slash', 'bg-contain', 'bg-no-repeat')} />
          ) : (
            <>
              {oneseo.middleSchoolAchievement.achievement3_2!.map((score, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex',
                    'items-center',
                    'justify-center',
                    'border-b',
                    'border-black',
                  )}
                >
                  {scoreToAlphabet[score]}
                </div>
              ))}
              <div
                className={cn(
                  'flex',
                  'items-center',
                  'justify-center',
                  'border-b-0',
                  'border-black',
                )}
              >
                {oneseo.calculatedScore.generalSubjectsScoreDetail.score3_2}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneralSubjectsTable;
