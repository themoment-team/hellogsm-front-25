'use client';

import { useEffect } from 'react';

import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { RelationshipWithGuardianValueEnum, Step3FormType } from 'types';

import { CustomFormItem, RadioButton } from 'shared/components';
import { Input } from 'shared/components';
import { cn } from 'shared/lib/utils';

interface Step3RegisterProps {
  register: UseFormRegister<Step3FormType>;
  setValue: UseFormSetValue<Step3FormType>;
  watch: UseFormWatch<Step3FormType>;
  isCandidate: boolean;
}
const relationshipWithGuardianList = [
  { name: '부', value: RelationshipWithGuardianValueEnum.FATHER },
  { name: '모', value: RelationshipWithGuardianValueEnum.MOTHER },
  { name: '기타 (직접입력)', value: RelationshipWithGuardianValueEnum.OTHER },
] as const;

const Step3Register = ({ register, setValue, watch, isCandidate }: Step3RegisterProps) => {
  const handleRelationshipWithGuardianOptionClick = (value: RelationshipWithGuardianValueEnum) => {
    if (value !== RelationshipWithGuardianValueEnum.OTHER) {
      setValue('otherRelationshipWithGuardian', null);
    }

    setValue('relationshipWithGuardian', value);
  };

  useEffect(() => {
    if (isCandidate) {
      setValue('schoolTeacherName', watch('schoolTeacherName') ?? '');
      setValue('schoolTeacherPhoneNumber', watch('schoolTeacherPhoneNumber') ?? '');
    }

    if (!isCandidate) {
      setValue('schoolTeacherName', null);
      setValue('schoolTeacherPhoneNumber', null);
    }
  }, []);

  return (
    <div className={cn('flex', 'w-full', 'flex-col', 'items-start', 'gap-10')}>
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-0.5')}>
        <h1 className={cn('text-gray-900', 'text-[1.25rem]/[1.75rem]', 'font-semibold')}>
          보호자 / 담임선생님 정보를 입력해 주세요.
        </h1>
        <p className={cn('text-gray-600', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
          회원가입 시 입력한 기본 정보가 노출됩니다.
        </p>
      </div>

      <div className={cn('flex', 'items-start', 'gap-12')}>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-8')}>
          <CustomFormItem
            text={'보호자 이름 / 휴대폰 번호'}
            className={cn('gap-1')}
            required
            fullWidth
          >
            <Input placeholder="보호자 이름 입력" width="full" {...register('guardianName')} />
            <Input
              placeholder="보호자 휴대폰 번호 입력 (하이픈 '-' 제외)"
              width="full"
              {...register('guardianPhoneNumber')}
            />
          </CustomFormItem>
          <div className={cn('flex', 'flex-col', 'gap-3')}>
            <RadioButton<RelationshipWithGuardianValueEnum>
              title={'보호자 관계'}
              list={[...relationshipWithGuardianList]}
              selectedValue={watch('relationshipWithGuardian')}
              handleOptionClick={handleRelationshipWithGuardianOptionClick}
              required
            />
            {watch('relationshipWithGuardian') === RelationshipWithGuardianValueEnum.OTHER && (
              <Input placeholder="직접 입력" {...register('otherRelationshipWithGuardian')} />
            )}
          </div>
        </div>
        <div className={cn('flex', 'w-[29.75rem]', 'flex-col', 'items-start', 'gap-8')}>
          {isCandidate && (
            <CustomFormItem
              text={'담임선생님 이름 / 연락처'}
              className={cn('gap-1')}
              required
              fullWidth
            >
              <Input
                placeholder="담임선생님 이름 입력"
                width="full"
                {...register('schoolTeacherName')}
              />
              <Input
                placeholder="담임선생님 연락처 입력 (하이픈 '-' 제외)"
                width="full"
                {...register('schoolTeacherPhoneNumber')}
              />
            </CustomFormItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Register;
