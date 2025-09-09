'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { InspectionIcon } from 'shared/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  LoginDialog,
} from 'shared/components';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores/useModalStore';

const SUBJECT: string[] = ['교과', '일반교과'] as const;
const TOTAL = '총합';

const ModalContainer = () => {
  const {
    documentSubmissionChangeModal,
    setDocumentSubmissionChangeModal,
    admissionAgreementChangeModal,
    setAdmissionAgreementChangeModal,
    applicationModificationNotPossibleModal,
    setApplicationModificationNotPossibleModal,
    firstResultAnnouncementModal,
    setFirstResultAnnouncementModal,
    secondResultAnnouncementModal,
    setSecondResultAnnouncementModal,
    loginRequiredModal,
    setLoginRequiredModal,
    mockScoreCalculationPeriodModal,
    setMockScoreCalculationPeriodModal,
    resultAnnouncementPeriodModal,
    setResultAnnouncementPeriodModal,
    devServerNoticeModal,
    setDevServerNoticeModal,
    verificationCodeSendErrorModal,
    setVerificationCodeSendErrorModal,
    signupSuccessModal,
    setSignupSuccessModal,
    signupErrorModal,
    setSignupErrorModal,
    phoneNumberDuplicateModal,
    setPhoneNumberDuplicateModal,
    applicationPeriodModal,
    setApplicationPeriodModal,
    systemInspectionModal,
    // setSystemInspectionModal,
    scoreCalculationCompleteModal,
    setScoreCalculationCompleteModal,
    applicationSubmitModal,
    setApplicationSubmitModal,
    imageUploadSizeLimitModal,
    setImageUploadSizeLimitModal,
  } = useModalStore();

  const { back, push } = useRouter();

  const scoreArray =
    scoreCalculationCompleteModal.data?.totalSubjectsScore === undefined
      ? [
          {
            title: '일반교과',
            score: scoreCalculationCompleteModal.data?.generalSubjectsScore,
          },
          {
            title: '예체능',
            score: scoreCalculationCompleteModal.data?.artsPhysicalSubjectsScore,
          },
          { title: '출석', score: scoreCalculationCompleteModal.data?.attendanceScore },
          { title: '봉사', score: scoreCalculationCompleteModal.data?.volunteerScore },
          { title: '총합', score: scoreCalculationCompleteModal.data?.totalScore },
        ]
      : [
          {
            title: '교과',
            score: scoreCalculationCompleteModal.data?.totalSubjectsScore,
          },
          { title: '출석', score: scoreCalculationCompleteModal.data?.attendanceScore },
          { title: '봉사', score: scoreCalculationCompleteModal.data?.volunteerScore },
          { title: '총합', score: scoreCalculationCompleteModal.data?.totalScore },
        ];

  return (
    <>
      {/* admin */}
      <AlertDialog open={documentSubmissionChangeModal}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>서류 제출 여부를 변경하시겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentSubmissionChangeModal(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setDocumentSubmissionChangeModal(false)}>
              변경하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={admissionAgreementChangeModal}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>입학동의서 제출 여부를 변경하시겠습니까?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdmissionAgreementChangeModal(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setAdmissionAgreementChangeModal(false)}>
              변경하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={applicationModificationNotPossibleModal}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>원서 수정을 할 수 없는 기간입니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApplicationModificationNotPossibleModal(false)}>
              닫기
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={firstResultAnnouncementModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              확인 버튼 클릭시 전체 지원자들에게 합격, 불합격 여부가 공개됩니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setFirstResultAnnouncementModal(false)}>
              취소
            </Button>
            <Button onClick={() => setFirstResultAnnouncementModal(false)}>확인</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={secondResultAnnouncementModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              확인 버튼 클릭시 전체 지원자들에게 합격, 불합격 여부가 공개됩니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setSecondResultAnnouncementModal(false)}>
              취소
            </Button>
            <Button onClick={() => setSecondResultAnnouncementModal(false)}>확인</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* client */}
      <AlertDialog
        open={loginRequiredModal.isOpen}
        onOpenChange={(isOpen) => setLoginRequiredModal(isOpen)}
      >
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <strong>
                {loginRequiredModal.isMain
                  ? '성적 조회를 하시려면 로그인을 진행해주세요'
                  : '로그인을 먼저 진행해주세요'}
              </strong>
              <br />
              <br />
              학부모/담임교사 합격 확인 시, 보안상의 문제로 <br />
              본인 확인을 위해 회원가입 후 학부모/담임교사의 <br />
              본인 로그인이 필요합니다. <br />
              <br /> 빠른 확인을 원하시는 경우, 062-949-6843로 전화 주시면 친절히 안내해
              드리겠습니다. <br /> 번거롭게 해드려 죄송합니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <LoginDialog />
            <AlertDialogAction onClick={!loginRequiredModal.isMain ? () => back() : undefined}>
              다음에
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={mockScoreCalculationPeriodModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>모의 성적 계산은 10월 13일부터 가능합니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href={'/'} onClick={() => setMockScoreCalculationPeriodModal(false)}>
                확인
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resultAnnouncementPeriodModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              현재 {resultAnnouncementPeriodModal.isFirstTest ? '1차 합격' : '최종 합격'} 여부를
              조회할 수 없는 기간입니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href={'/check-result'} onClick={() => setResultAnnouncementPeriodModal(false)}>
                확인
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={devServerNoticeModal} onOpenChange={() => setDevServerNoticeModal(false)}>
        <AlertDialogContent className={cn('w-[25rem]')}>
          <AlertDialogTitle
            className={cn('flex', 'flex-col', 'text-center', 'gap-4', 'items-center')}
          >
            <p>현재 접속하신 주소는 개발환경입니다.</p>
            <p>아래 링크로 접속하여 원서를 작성해주세요.</p>
            <a
              href="https://www.hellogsm.kr"
              className={cn('text-blue-500', 'underline', 'w-fit')}
              rel="noreferrer"
            >
              www.hellogsm.kr
            </a>
          </AlertDialogTitle>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={verificationCodeSendErrorModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              인증번호 전송에 실패하였습니다. <br /> (인증번호는 최대 5번만 전송 가능합니다.)
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setVerificationCodeSendErrorModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={signupSuccessModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>회원가입에 성공했습니다!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setSignupSuccessModal(false);
                push('/');
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={signupErrorModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>오류가 발생했습니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSignupErrorModal(false)}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={phoneNumberDuplicateModal}>
        <AlertDialogContent className={cn('w-[520px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              같은 전화번호로 생성된 계정이 이미 존재합니다.
              <br />
              회원가입 시, 기존의 정보는 사라집니다. 진행하시겠습니까?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setPhoneNumberDuplicateModal(false)}>
              취소
            </Button>
            <AlertDialogAction onClick={() => setPhoneNumberDuplicateModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={applicationPeriodModal}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              1차 합격 결과 발표 이후에는 기존 회원 정보를 <br /> 삭제할 수 없습니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setApplicationPeriodModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* shared */}
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

      <AlertDialog open={scoreCalculationCompleteModal.isOpen}>
        <AlertDialogContent className={cn('w-[32.5rem]', 'max-w-[32.5rem]', 'bg-white')}>
          <AlertDialogHeader>
            <AlertDialogTitle>성적 계산이 완료되었습니다!</AlertDialogTitle>
            <AlertDialogDescription>
              {scoreCalculationCompleteModal.type === 'score'
                ? '입력하신 모든 정보가 맞다면 성적 확인 후 최종 제출해주세요.'
                : '모의 성적을 확인하셨다면 원서를 작성해 주세요.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className={cn('flex', 'w-[29.5rem]')}>
            {scoreArray.map(({ title, score }) => (
              <div
                key={title}
                className={cn(
                  'flex',
                  'flex-col',
                  'border-zinc-200',
                  'border-y-[0.0625rem]',
                  scoreArray.length === 5 ? 'w-[5.9rem]' : 'w-[7.375rem]',
                  SUBJECT.includes(title) && ['border-l-[0.0625rem]', 'rounded-l-md'],
                  title === TOTAL && ['border-r-[0.0625rem]', 'rounded-r-md'],
                )}
              >
                <h1
                  className={cn(
                    'w-full',
                    'h-[3rem]',
                    'flex',
                    'justify-center',
                    'items-center',
                    'border-b-[0.0625rem]',
                    'border-zinc-200',
                    'text-zinc-500',
                    'text-[0.875rem]/[1.5rem]',
                    'font-semibold',
                    'bg-zinc-50',
                    SUBJECT.includes(title) && 'rounded-tl-md',
                    title === TOTAL && 'rounded-tr-md',
                  )}
                >
                  {title}
                </h1>
                <p
                  className={cn(
                    'w-full',
                    'h-[3.5rem]',
                    'flex',
                    'justify-center',
                    'items-center',
                    'text-[0.875rem]/[1.25rem]',
                    SUBJECT.includes(title) ? ['rounded-tr-md'] : ['font-normal', 'text-slate-700'],
                    title === TOTAL && ['rounded-tl-md', 'text-blue-600', 'font-semibold'],
                  )}
                >
                  {score}
                </p>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setScoreCalculationCompleteModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
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

export default ModalContainer;
