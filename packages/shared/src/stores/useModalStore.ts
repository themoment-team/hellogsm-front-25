import { AdminModals, ClientModals, ModalStore, SharedModals } from 'types';
import { create } from 'zustand';

const createInitialAdminModals = (): AdminModals => ({
  documentSubmissionChangeModal: { isOpen: false, onConfirm: () => {} },
  admissionAgreementChangeModal: { isOpen: false, onConfirm: () => {} },
  applicationModificationNotPossibleModal: false,
  firstResultAnnouncementModal: false,
  secondResultAnnouncementModal: false,
});

const createInitialClientModals = (): ClientModals => ({
  loginRequiredModal: { isOpen: false, isMain: false },
  mockScoreCalculationPeriodModal: false,
  resultAnnouncementPeriodModal: { isOpen: false, isFirstTest: true },
  devServerNoticeModal: false,
  verificationCodeSendErrorModal: false,
  signupSuccessModal: false,
  signupErrorModal: false,
  phoneNumberDuplicateModal: { isOpen: false, onConfirm: () => {} },
  applicationPeriodModal: false,
});

const createInitialSharedModals = (): SharedModals => ({
  systemInspectionModal: false,
  scoreCalculationCompleteModal: { isOpen: false, data: null, type: 'mock' },
  applicationSubmitModal: { isOpen: false, type: 'client' },
  imageUploadSizeLimitModal: false,
});

export const useModalStore = create<ModalStore>((set) => ({
  ...createInitialAdminModals(),
  ...createInitialClientModals(),
  ...createInitialSharedModals(),

  // admin modal action
  setDocumentSubmissionChangeModal: (isOpen, onConfirm = () => {}) => {
    set({ documentSubmissionChangeModal: { isOpen, onConfirm } });
  },
  setAdmissionAgreementChangeModal: (isOpen, onConfirm = () => {}) => {
    set({ admissionAgreementChangeModal: { isOpen, onConfirm } });
  },
  setApplicationModificationNotPossibleModal: (isOpen) => {
    set({ applicationModificationNotPossibleModal: isOpen });
  },
  setFirstResultAnnouncementModal: (isOpen) => {
    set({ firstResultAnnouncementModal: isOpen });
  },
  setSecondResultAnnouncementModal: (isOpen) => {
    set({ secondResultAnnouncementModal: isOpen });
  },

  // client modal action
  setLoginRequiredModal: (isOpen, isMain = false) => {
    set({ loginRequiredModal: { isOpen, isMain } });
  },
  setMockScoreCalculationPeriodModal: (isOpen) => {
    set({ mockScoreCalculationPeriodModal: isOpen });
  },
  setResultAnnouncementPeriodModal: (isOpen, isFirstTest = true) => {
    set({ resultAnnouncementPeriodModal: { isOpen, isFirstTest } });
  },
  setDevServerNoticeModal: (isOpen) => {
    set({ devServerNoticeModal: isOpen });
  },
  setVerificationCodeSendErrorModal: (isOpen) => {
    set({ verificationCodeSendErrorModal: isOpen });
  },
  setSignupSuccessModal: (isOpen) => {
    set({ signupSuccessModal: isOpen });
  },
  setSignupErrorModal: (isOpen) => {
    set({ signupErrorModal: isOpen });
  },
  setPhoneNumberDuplicateModal: (isOpen, onConfirm = () => {}) => {
    set({ phoneNumberDuplicateModal: { isOpen, onConfirm } });
  },
  setApplicationPeriodModal: (isOpen) => {
    set({ applicationPeriodModal: isOpen });
  },

  // shared modal action
  setSystemInspectionModal: (isOpen) => {
    set({ systemInspectionModal: isOpen });
  },
  setScoreCalculationCompleteModal: (isOpen, data = null, type = 'mock') => {
    set({ scoreCalculationCompleteModal: { isOpen, data, type } });
  },
  setApplicationSubmitModal: (isOpen, type = 'client') => {
    set({ applicationSubmitModal: { isOpen, type } });
  },
  setImageUploadSizeLimitModal: (isOpen) => {
    set({ imageUploadSizeLimitModal: isOpen });
  },
}));
