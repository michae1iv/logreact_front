'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface PopupContextType {
  message: string | null;
  showPopup: boolean;
  setPopup: (message: string | null, show: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const setPopup = async (message: string | null, show: boolean) => {
    setShowPopup(show);
    setMessage(message);
  };

  return (
    <PopupContext.Provider value={{ message, showPopup, setPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};