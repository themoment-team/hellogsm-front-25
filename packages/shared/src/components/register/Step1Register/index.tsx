'use client';

import { useEffect } from 'react';

import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  FormState,
} from 'react-hook-form';
import { SexType, SexValueEnum, Step1FormType } from 'types';

import {
  CustomFormItem,
  RadioButton,
  UploadPhoto,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
} from 'shared/components';
import { cn } from 'shared/lib/utils';

interface Step1RegisterProps {
  name: string;
  birth: string;
  sex: SexType;
  phoneNumber: string;
  register: UseFormRegister<Step1FormType>;
  setValue: UseFormSetValue<Step1FormType>;
  watch: UseFormWatch<Step1FormType>;
  trigger: UseFormTrigger<Step1FormType>;
  formState: FormState<Step1FormType>;
  showError: boolean;
}

const Step1Register = ({
  name,
  birth,
  sex,
  phoneNumber,
  register,
  setValue,
  watch,
  trigger,
  formState: { errors },
  showError,
}: Step1RegisterProps) => {
  const daumPostCode = useDaumPostcodePopup();

  // 개선 필요해보임
  const birthDate = birth ? new Date(birth) : null;
  const birthYear = birthDate ? birthDate.getFullYear() : '';
  const birthMonth = birthDate ? String(birthDate.getMonth() + 1).padStart(2, '0') : '';
  const birthDay = birthDate ? String(birthDate.getDate()).padStart(2, '0') : '';
  const sexList = [
    { name: '남자', value: SexValueEnum.MALE },
    { name: '여자', value: SexValueEnum.FEMALE },
  ];

  const handleDaumPostCodePopupComplete = ({ address }: Address) => {
    setValue('address', address, { shouldValidate: true, shouldDirty: true });
  };

  const handleZipCodeButtonClick = () =>
    daumPostCode({
      popupTitle: 'Hello, GSM 2024',
      onComplete: handleDaumPostCodePopupComplete,
    });

  const validateForm = async () => {
    await trigger();
  };

  useEffect(() => {
    if (!showError) return;
    validateForm();
  }, [showError]);

  return (
    <div
      className={cn('flex', 'w-full', 'h-[28.75rem]', 'flex-col', 'items-start', 'justify-between')}
    >
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-[0.125rem]')}>
        <h1 className={cn('text-gray-900', 'text-[1.25rem]/[1.75rem]', 'font-semibold')}>
          기본 정보를 입력해 주세요.
        </h1>
        <p className={cn('text-gray-600', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
          회원가입 시 입력한 기본 정보가 노출됩니다.
        </p>
      </div>

      <div className={cn('flex', 'items-end', 'gap-[3rem]')}>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-[2rem]')}>
          <UploadPhoto setValue={setValue} watch={watch} />
          <CustomFormItem text={'이름'} className={cn('gap-1')} required={true} fullWidth={true}>
            <Input placeholder={name} disabled={true} />
          </CustomFormItem>
          <CustomFormItem
            text={'생년월일'}
            className={cn('gap-1')}
            required={true}
            fullWidth={true}
          >
            <div className={cn('flex', 'w-full', 'justify-between')}>
              <Select>
                <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                  <SelectValue placeholder={birthYear} />
                </SelectTrigger>
              </Select>
              <Select>
                <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                  <SelectValue placeholder={birthMonth} />
                </SelectTrigger>
              </Select>
              <Select>
                <SelectTrigger className={cn('w-[9.3785rem]')} disabled={true}>
                  <SelectValue placeholder={birthDay} />
                </SelectTrigger>
              </Select>
            </div>
          </CustomFormItem>
        </div>

        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-10')}>
          <RadioButton
            title={'성별'}
            list={sexList}
            required={true}
            disabled={true}
            selectedValue={sex}
          />

          <div className={cn('flex', 'flex-col', 'items-start', 'gap-[0.375rem]', 'w-full')}>
            <CustomFormItem
              text={'주소지'}
              className={cn('gap-1')}
              required={true}
              fullWidth={true}
            >
              <div className={cn('w-full', 'flex', 'gap-2')}>
                <Input
                  placeholder={'주소를 입력해 주세요'}
                  width="full"
                  disabled
                  {...register('address')}
                  variant={showError && errors.address ? 'error' : undefined}
                />

                <Button onClick={handleZipCodeButtonClick}>주소 찾기</Button>
              </div>
            </CustomFormItem>
            <Input
              placeholder="상세주소"
              width="full"
              {...register('detailAddress')}
              variant={showError && errors.detailAddress ? 'error' : undefined}
            />
          </div>

          <CustomFormItem
            text={'휴대폰 번호'}
            className={cn('gap-1')}
            required={true}
            fullWidth={true}
          >
            <Input placeholder={phoneNumber} disabled width="full" />
          </CustomFormItem>
        </div>
      </div>
    </div>
  );
};

export default Step1Register;
