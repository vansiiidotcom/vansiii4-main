// src/contexts/ModalContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  setIsModalOpenModal: (isOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalContext;

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setModalOpenModal] = useState<boolean>(false);

  return (
    <ModalContext.Provider value={{ isModalOpenModal, setModalOpenModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalContextProvider');
  }
  return context;
};