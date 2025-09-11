'use client';

import { AdminModals, ClientModals, ScoreCalculationModal, SharedModals } from 'shared/components';

const ModalContainer = () => {
  return (
    <>
      <AdminModals />
      <ClientModals />
      <ScoreCalculationModal />
      <SharedModals />
    </>
  );
};

export default ModalContainer;
