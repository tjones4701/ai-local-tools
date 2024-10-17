/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pageData: Record<string,any> | null;
  setPageData: (data: any) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export type PageFC = React.FC<{ pageContext: NavigationContextProps }>;

export const NavigationProvider: React.FC<{ children: ReactNode, defaultPage: string }> = ({ children, defaultPage }) => {
  const [currentPage, setCurrentPage] = useState<string>(defaultPage);
  const [pageData, setPageData] = useState<any>(null);

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage, pageData, setPageData }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextProps => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
