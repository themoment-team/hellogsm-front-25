import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, patch } from 'api/libs';

export const usePatchAptitudeScore = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, { competencyEvaluationScore: number }>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchAptitudeScore(memberId),
    mutationFn: (competencyEvaluationScore) =>
      patch(oneseoUrl.patchAptitudeScore(memberId), competencyEvaluationScore),
    ...options,
  });
