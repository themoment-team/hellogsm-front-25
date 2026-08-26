import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SchoolRecordOcrResponseType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, post } from '../../libs';

export const usePostSchoolRecordOcr = (
  options?: UseMutationOptions<SchoolRecordOcrResponseType, AxiosError, FormData>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postSchoolRecordOcr(),
    // Content-Type을 직접 지정하지 않는다 — boundary 없이 명시하면 axios가 FormData를 보고
    // boundary를 채워 넣는 걸 건너뛰어 서버가 멀티파트를 파싱하지 못할 수 있다.
    mutationFn: (data) => post<SchoolRecordOcrResponseType>(oneseoUrl.postSchoolRecordOcr(), data),
    ...options,
  });
