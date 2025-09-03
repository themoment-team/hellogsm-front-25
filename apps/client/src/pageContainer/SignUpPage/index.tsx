'use client';

import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { zodResolver } from '@hookform/resolvers/zod';
import { memberQueryKeys, useGetDuplicateMember } from 'api';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { MemberRegisterType, SendCodeType, SexType } from 'types';
import { z } from 'zod';

import { ChevronIcon } from 'client/assets';
import { Footer, SexToggle } from 'client/components';
import { useVerifyCode, usePostMemberRegister, useSendCode } from 'client/hooks';
import { signupFormSchema } from 'client/schemas';

import {
  FormControl,
  CustomFormItem,
  FormItem,
  Button,
  Input,
  Select,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  InspectionDialog,
} from 'shared/components';
import { CURRENT_YEAR } from 'shared/constants';
import { useDebounce } from 'shared/hooks';
import { cn } from 'shared/lib/utils';

const PERMIT_YEAR = 50;

interface SignUpProps {
  isPastAnnouncement: boolean;
}

const SignUpPage = ({ isPastAnnouncement }: SignUpProps) => {
  const { push } = useRouter();

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [btnClick, setBtnClick] = useState<boolean>(false);
  const [lastSubmittedCode, setLastSubmittedCode] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const [isVerifyClicked, setIsVerifyClicked] = useState(false);

  const [showModal, setShowModal] = useState<
    'duplicate' | 'date' | 'code' | 'success' | 'error' | ''
  >('');

  const [timeLeft, setTimeLeft] = useState(0);

  const formMethods = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      sex: '',
      phoneNumber: '',
      certificationNumber: '',
      isSentCertificationNumber: false,
      isAgreed: false,
      birth: {
        year: '',
        month: '',
        day: '',
      },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const initialTime = 180;
    const savedTime = sessionStorage.getItem('timerStart');

    if (savedTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedTime, 10)) / 1000);
      const remainingTime = initialTime - elapsedTime;
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    } else if (btnClick === true) {
      sessionStorage.setItem('timerStart', Date.now().toString());
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [btnClick]);

  useEffect(() => {
    if (timeLeft > 0) {
      setBtnClick(true);
    } else if (timeLeft === 0) {
      setBtnClick(false);
      sessionStorage.removeItem('timerStart');
    }
  }, [btnClick, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const phoneNumber = formMethods.watch('phoneNumber');
  const certificationNumber = formMethods.watch('certificationNumber');
  const isAgreed = formMethods.watch('isAgreed');
  const isSentCertificationNumber = formMethods.watch('isSentCertificationNumber');
  const sex = formMethods.watch('sex');
  const birthYear = formMethods.watch('birth.year');
  const birthMonth = formMethods.watch('birth.month');
  const birthDay = formMethods.watch('birth.day');

  const isCertificationButtonDisabled = !/^\d{10,11}$/.test(phoneNumber);
  const isCertificationValid = isSuccess === true;
  const isSubmitButtonDisabled = !isCertificationValid || !isAgreed;

  const queryClient = useQueryClient();

  const { refetch: checkDuplicateMember } = useGetDuplicateMember(phoneNumber, {
    enabled: false,
  });

  const { mutate: mutateMemberRegister } = usePostMemberRegister({
    onError: () => setShowModal('error'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.getMyAuthInfo() });
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.getMyMemberInfo() });
      setShowModal('success');
    },
  });

  const { mutate: mutateSendCode } = useSendCode({
    onSuccess: () => {
      setBtnClick(true);
      setIsVerifyClicked(true);
      formMethods.setValue('isSentCertificationNumber', true);
    },
    onError: () => setShowModal('code'),
  });

  const { mutate: mutateVerifyCode } = useVerifyCode({
    onSuccess: () => setIsSuccess(true),
    onError: () => setIsSuccess(false),
  });

  const codeDebounce = useDebounce(certificationNumber, 500);

  useEffect(() => {
    if (codeDebounce.length === 6 && codeDebounce !== lastSubmittedCode) {
      const payload = {
        code: codeDebounce,
      };

      mutateVerifyCode(payload);

      setLastSubmittedCode(codeDebounce);
    }
  }, [codeDebounce, lastSubmittedCode, mutateVerifyCode]);

  const onSubmit = (data: z.infer<typeof signupFormSchema>) => {
    const month = String(data.birth.month).padStart(2, '0');
    const day = String(data.birth.day).padStart(2, '0');

    const body: MemberRegisterType = {
      code: data.certificationNumber ?? '',
      name: data.name,
      sex: data.sex as SexType,
      phoneNumber: data.phoneNumber,
      birth: `${data.birth.year}-${month}-${day}`,
    };
    mutateMemberRegister(body);
  };

  const sendCodeNumber = async (number: string) => {
    const duplicateResponse = await checkDuplicateMember();
    const isDuplicate = duplicateResponse?.data?.duplicateMemberYn === 'NO';

    if (isDuplicate) {
      const body: SendCodeType = {
        phoneNumber: number,
      };
      mutateSendCode(body);
      return;
    } else if (isContinue === true) {
      const body: SendCodeType = {
        phoneNumber: number,
      };
      mutateSendCode(body);
      return;
    } else {
      setShowModal('duplicate');
    }
  };

  useEffect(() => {
    if (isContinue === true) {
      sendCodeNumber(phoneNumber);
    }
  }, [isContinue]);

  return (
    <>
      <main
        className={cn(
          'flex',
          'flex-col',
          'items-center',
          'gap-10',
          'pb-40',
          'pt-[7.5rem]',
          'bg-white',
        )}
      >
        <div className={cn('flex', 'flex-col', 'gap-3', 'items-center')}>
          <h1 className={cn('text-2xl', 'font-semibold')}>회원가입</h1>
          <p className={cn('text-sm', 'font-normal', 'text-gray-600')}>
            가입 이후 <span className={cn('font-semibold')}>정보 수정이 불가</span>하니 정보를
            정확히 입력해 주세요.
          </p>
        </div>

        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className={cn('flex', 'flex-col', 'gap-4')}
          >
            <FormItem>
              <CustomFormItem className={cn('gap-1')} text="이름">
                <FormControl>
                  <Input {...formMethods.register('name')} placeholder="이름 입력" />
                </FormControl>
              </CustomFormItem>
            </FormItem>

            <CustomFormItem className={cn('gap-1.5')} text="성별">
              <div className={cn('flex', 'gap-2')}>
                <SexToggle
                  isSelected={sex === 'MALE'}
                  onClick={() => formMethods.setValue('sex', 'MALE')}
                >
                  남자
                </SexToggle>
                <SexToggle
                  isSelected={sex === 'FEMALE'}
                  onClick={() => formMethods.setValue('sex', 'FEMALE')}
                >
                  여자
                </SexToggle>
              </div>
            </CustomFormItem>

            <CustomFormItem className={cn('gap-1')} text="생년월일">
              <div className={cn('flex', 'gap-2')}>
                <FormItem>
                  <Select
                    onValueChange={(value) => formMethods.setValue('birth.year', value)}
                    defaultValue={birthYear ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger className={cn('w-[7.5625rem]')}>
                        <SelectValue placeholder="연도" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>연도 선택</SelectLabel>
                        {Array.from(
                          { length: PERMIT_YEAR },
                          (_, index) => CURRENT_YEAR - index,
                        ).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem>
                  <Select
                    onValueChange={(value) => formMethods.setValue('birth.month', value)}
                    defaultValue={birthMonth ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger className={cn('w-[7.5625rem]')}>
                        <SelectValue placeholder="월" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>월 선택</SelectLabel>
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem>
                  <Select
                    onValueChange={(value) => formMethods.setValue('birth.day', value)}
                    defaultValue={birthDay ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger className={cn('w-[7.5625rem]')}>
                        <SelectValue placeholder="일" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>일 선택</SelectLabel>
                        {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
            </CustomFormItem>

            <CustomFormItem className={cn('relative', 'gap-1')} text="전화번호">
              <div
                className={cn('absolute', 'right-0', 'text-red-500', 'text-[0.75rem]/[1.125rem]')}
              >
                인증번호가 국제발신으로 전송됩니다.
              </div>
              <div className={cn('flex', 'flex-col', 'gap-1.5')}>
                <div className={cn('flex', 'justify-between', 'items-center')}>
                  <div className={cn(['w-[18rem]', btnClick === true ? 'absolute' : ''])}>
                    <Input
                      {...formMethods.register('phoneNumber')}
                      placeholder="번호 입력"
                      disabled={isSentCertificationNumber}
                    />
                  </div>
                  {btnClick === true && (
                    <p
                      className={cn(
                        'text-blue-500',
                        'text-[0.875rem]/[1.25rem]',
                        'font-medium',
                        'relative',
                        'left-[15rem]',
                      )}
                    >
                      {formatTime(timeLeft)}
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="disabled"
                    className={cn('w-[5.25rem]')}
                    disabled={
                      (isCertificationButtonDisabled || btnClick === true) && timeLeft !== 0
                    }
                    onClick={() => {
                      sendCodeNumber(phoneNumber);
                      setTimeLeft(180);
                    }}
                  >
                    {isVerifyClicked ? '재전송' : '번호 인증'}
                  </Button>
                </div>
                <Input
                  {...formMethods.register('certificationNumber')}
                  disabled={!isSentCertificationNumber || timeLeft === 0}
                  placeholder="인증번호 6자리 입력"
                  successMessage={isSuccess === true ? '번호 인증이 완료되었습니다' : undefined}
                  errorMessage={
                    isSuccess === false
                      ? timeLeft === 0
                        ? '인증번호가 만료되었습니다.'
                        : '인증번호를 확인해 주세요.'
                      : undefined
                  }
                />
              </div>
            </CustomFormItem>

            <div className={cn('text-gray-900', 'text-sm', 'font-medium')}>
              <div className={cn('flex', 'items-center', 'gap-1', 'justify-between')}>
                <div className={cn('flex', 'items-center', 'gap-2')}>
                  <input type="checkbox" {...formMethods.register('isAgreed')} />
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                  className={cn([
                    'transition-transform duration-300',
                    showPrivacyPolicy ? 'rotate-180' : 'rotate-0',
                  ])}
                >
                  <ChevronIcon />
                </button>
              </div>
              {showPrivacyPolicy && (
                <div
                  className={cn(
                    'mt-4',
                    'mb-4',
                    'pt-4',
                    'border-t',
                    'border-solid',
                    'border-gray-200',
                    'text-gray-500',
                    'text-[0.75rem]/[1.125rem]',
                    'font-normal',
                    'overflow-y-auto',
                    'overflow-x-hidden',
                    'w-[23.75rem]',
                    'h-[6.25rem]',
                  )}
                >
                  ㅡ 서류제출 시 [서식2-1] 개인정보수집활용동의서, [서식2-2] 개인정보 제3자
                  제공동의서를 작성하여 제출하여 주시기 바랍니다.
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="disabled"
              disabled={isSubmitButtonDisabled || formMethods.formState.isSubmitting}
            >
              회원가입 완료
            </Button>
          </form>
        </FormProvider>
      </main>

      <Footer />

      <AlertDialog open={showModal === 'code'}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              인증번호 전송에 실패하였습니다. <br /> (인증번호는 최대 5번만 전송 가능합니다.)
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowModal('')}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showModal === 'success' || showModal === 'error'}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showModal === 'success' ? '회원가입에 성공했습니다!' : '오류가 발생했습니다.'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowModal('');
                if (showModal === 'success') push('/');
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showModal === 'duplicate'}>
        <AlertDialogContent className={cn('w-[520px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              같은 전화번호로 생성된 계정이 이미 존재합니다.
              <br />
              회원가입 시, 기존의 정보는 사라집니다. 진행하시겠습니까?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal('');
              }}
            >
              취소
            </Button>
            <AlertDialogAction
              onClick={() => {
                if (isPastAnnouncement) {
                  setShowModal('date');
                } else {
                  setIsContinue(true);
                  setShowModal('');
                }
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showModal === 'date'}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              1차 합격 결과 발표 이후에는 기존 회원 정보를 <br /> 삭제할 수 없습니다.
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowModal('');
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <InspectionDialog showModal={false} />
    </>
  );
};

export default SignUpPage;
