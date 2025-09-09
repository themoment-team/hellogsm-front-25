import { MockScoreType } from 'types';
import { create } from 'zustand';

interface ModalStore {
  // admin
  documentSubmissionChangeModal: { isOpen: boolean; onConfirm: () => void };
  setDocumentSubmissionChangeModal: (isOpen: boolean, onConfirm?: () => void) => void;
  admissionAgreementChangeModal: { isOpen: boolean; onConfirm: () => void };
  setAdmissionAgreementChangeModal: (isOpen: boolean, onConfirm?: () => void) => void;
  applicationModificationNotPossibleModal: boolean;
  setApplicationModificationNotPossibleModal: (isOpen: boolean) => void;
  firstResultAnnouncementModal: boolean;
  setFirstResultAnnouncementModal: (isOpen: boolean) => void;
  secondResultAnnouncementModal: boolean;
  setSecondResultAnnouncementModal: (isOpen: boolean) => void;

  // client
  loginRequiredModal: { isOpen: boolean; isMain: boolean };
  setLoginRequiredModal: (isOpen: boolean, isMain?: boolean) => void;
  mockScoreCalculationPeriodModal: boolean;
  setMockScoreCalculationPeriodModal: (isOpen: boolean) => void;
  resultAnnouncementPeriodModal: { isOpen: boolean; isFirstTest: boolean };
  setResultAnnouncementPeriodModal: (isOpen: boolean, isFirstTest?: boolean) => void;
  devServerNoticeModal: boolean;
  setDevServerNoticeModal: (isOpen: boolean) => void;
  verificationCodeSendErrorModal: boolean;
  setVerificationCodeSendErrorModal: (isOpen: boolean) => void;
  signupSuccessModal: boolean;
  setSignupSuccessModal: (isOpen: boolean) => void;
  signupErrorModal: boolean;
  setSignupErrorModal: (isOpen: boolean) => void;
  phoneNumberDuplicateModal: { isOpen: boolean; onConfirm: () => void };
  setPhoneNumberDuplicateModal: (isOpen: boolean, onConfirm?: () => void) => void;
  applicationPeriodModal: boolean;
  setApplicationPeriodModal: (isOpen: boolean) => void;

  // shared
  systemInspectionModal: boolean;
  setSystemInspectionModal: (isOpen: boolean) => void;
  scoreCalculationCompleteModal: {
    isOpen: boolean;
    data: MockScoreType | null;
    type: 'score' | 'mock';
  };
  setScoreCalculationCompleteModal: (
    isOpen: boolean,
    data?: MockScoreType | null,
    type?: 'score' | 'mock',
  ) => void;
  applicationSubmitModal: { isOpen: boolean; type: 'client' | 'admin' };
  setApplicationSubmitModal: (isOpen: boolean, type?: 'client' | 'admin') => void;
  imageUploadSizeLimitModal: boolean;
  setImageUploadSizeLimitModal: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // admin
  documentSubmissionChangeModal: { isOpen: false, onConfirm: () => {} },
  setDocumentSubmissionChangeModal: (isOpen, onConfirm = () => {}) =>
    set({ documentSubmissionChangeModal: { isOpen, onConfirm } }),
  admissionAgreementChangeModal: { isOpen: false, onConfirm: () => {} },
  setAdmissionAgreementChangeModal: (isOpen, onConfirm = () => {}) =>
    set({ admissionAgreementChangeModal: { isOpen, onConfirm } }),
  applicationModificationNotPossibleModal: false,
  setApplicationModificationNotPossibleModal: (isOpen) =>
    set({ applicationModificationNotPossibleModal: isOpen }),
  firstResultAnnouncementModal: false,
  setFirstResultAnnouncementModal: (isOpen) => set({ firstResultAnnouncementModal: isOpen }),
  secondResultAnnouncementModal: false,
  setSecondResultAnnouncementModal: (isOpen) => set({ secondResultAnnouncementModal: isOpen }),

  // client
  loginRequiredModal: { isOpen: false, isMain: false },
  setLoginRequiredModal: (isOpen, isMain = false) =>
    set({ loginRequiredModal: { isOpen, isMain } }),
  mockScoreCalculationPeriodModal: false,
  setMockScoreCalculationPeriodModal: (isOpen) => set({ mockScoreCalculationPeriodModal: isOpen }),
  resultAnnouncementPeriodModal: { isOpen: false, isFirstTest: true },
  setResultAnnouncementPeriodModal: (isOpen, isFirstTest = true) =>
    set({ resultAnnouncementPeriodModal: { isOpen, isFirstTest } }),
  devServerNoticeModal: false,
  setDevServerNoticeModal: (isOpen) => set({ devServerNoticeModal: isOpen }),
  verificationCodeSendErrorModal: false,
  setVerificationCodeSendErrorModal: (isOpen) => set({ verificationCodeSendErrorModal: isOpen }),
  signupSuccessModal: false,
  setSignupSuccessModal: (isOpen) => set({ signupSuccessModal: isOpen }),
  signupErrorModal: false,
  setSignupErrorModal: (isOpen) => set({ signupErrorModal: isOpen }),
  phoneNumberDuplicateModal: { isOpen: false, onConfirm: () => {} },
  setPhoneNumberDuplicateModal: (isOpen, onConfirm = () => {}) =>
    set({ phoneNumberDuplicateModal: { isOpen, onConfirm } }),
  applicationPeriodModal: false,
  setApplicationPeriodModal: (isOpen) => set({ applicationPeriodModal: isOpen }),

  // shared
  systemInspectionModal: false,
  setSystemInspectionModal: (isOpen) => set({ systemInspectionModal: isOpen }),
  scoreCalculationCompleteModal: { isOpen: false, data: null, type: 'mock' },
  setScoreCalculationCompleteModal: (isOpen, data = null, type = 'mock') =>
    set({ scoreCalculationCompleteModal: { isOpen, data, type } }),
  applicationSubmitModal: { isOpen: false, type: 'client' },
  setApplicationSubmitModal: (isOpen, type = 'client') =>
    set({ applicationSubmitModal: { isOpen, type } }),
  imageUploadSizeLimitModal: false,
  setImageUploadSizeLimitModal: (isOpen) => set({ imageUploadSizeLimitModal: isOpen }),
}));
