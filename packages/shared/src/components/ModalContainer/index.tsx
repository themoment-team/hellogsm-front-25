'use client';

import { AdminModals, ClientModals, SharedModals } from 'shared/components';

const ModalContainer = () => {
  return (
    <>
      <AdminModals />
      <ClientModals />
      <SharedModals />
    </>
  );
};

export default ModalContainer;
