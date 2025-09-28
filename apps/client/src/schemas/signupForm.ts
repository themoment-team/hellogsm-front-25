import { z } from 'zod';

const nameSchema = z
  .string()
  .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
  .max(50, { message: '이름은 최대 50자 이내여야 합니다.' })
  .regex(/^[가-힣a-zA-Z\s]+$/, { message: '이름에는 한글, 영문, 공백만 사용할 수 있습니다.' })
  .min(1, { message: '이름을 작성해주세요.' });

const sexSchema = z.string().refine((value) => ['MALE', 'FEMALE'].includes(value), {
  message: '성별을 선택해주세요.',
});

const phoneNumberSchema = z
  .string()
  .regex(/^010\d{8}$/, { message: '010으로 시작하는 11자리 번호를 입력해주세요.' })
  .min(1, { message: '전화번호를 입력해주세요.' });

const birthSchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, { message: '유효한 연도를 선택해주세요.' })
    .min(1, { message: '연도를 선택해주세요.' }),
  month: z
    .string()
    .regex(/^\d{1,2}$/, { message: '유효한 월을 선택해주세요.' })
    .min(1, { message: '월을 선택해주세요.' }),
  day: z
    .string()
    .regex(/^\d{1,2}$/, { message: '유효한 일을 선택해주세요.' })
    .min(1, { message: '일을 선택해주세요.' }),
});

export const signupFormSchema = z.object({
  name: nameSchema,
  sex: sexSchema,
  phoneNumber: phoneNumberSchema,
  birth: birthSchema,
  certificationNumber: z.string().optional(),
  isSentCertificationNumber: z.boolean().optional(),
  isAgreed: z.boolean().optional(),
});
