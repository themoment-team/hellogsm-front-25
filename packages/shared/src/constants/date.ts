import { getKoreanDate } from 'shared/utils';

export const RECRUITMENT_PERIOD = {
  startDate: '2024.10.10.',
  endDate: '오전 9시 ~ 5시',
} as const;

// TODO 정확한 날짜 확인 후 수정
export const 역량검사일자 = '2024-07-25';
export const 심층면접일자 = '2024-07-26';
export const 역량검사시험기간 = '2024. 10. 25.(금) 13:00 ~ 16:10';
export const 심층면접시험기간 = '2024. 10. 26.(토) 09:00 ~ 12:00';

// TODO 정확한 날짜 확인 후 수정
export const visionCampDate = {
  startDate: '2025. 01. 15.(수)',
  endDate: '2025. 01. 17.(금)',
};

// TODO 정확한 날짜 확인 후 수정
export const passedMemberAnnounceDate = '2024. 10. 30.(수) 10:00';
export const passedMemberSubmitDate = {
  startDate: '2025. 11. 1.(수)',
  endDate: '2025. 11. 6.(월)',
};
export const CURRENT_YEAR = getKoreanDate().getFullYear();
export const NEXT_YEAR = CURRENT_YEAR + 1;
