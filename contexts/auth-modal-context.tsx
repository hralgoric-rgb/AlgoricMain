"use client";

import React, { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    // Add modal query parameter to URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set("modal", "auth");
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Remove modal query parameter from URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete("modal");
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};
