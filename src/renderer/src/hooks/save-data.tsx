import { saveData, getData, deleteData } from '../lib/save-data';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataContextType<T> {
  data: T;
  save: (key: string, value: T | null) => void;
  load: (key: string, defaultData: T | null) => void;
  remove: (key: string) => void;
}

const DataContext = createContext<DataContextType<any> | undefined>(undefined);

export const DataProvider: React.FC<{ children: any }> = ({ children }) => {
  const [data, setData] = useState<any>(null);

  const save = async (key: string, value: any) => {
    await saveData(key, value);
    setData({ ...data, [key]: value });
  };

  const load = async (key: string, defaultData: any | null) => {
    const value = await getData(key, defaultData);
    const newData = { ...data };
    newData[key] = value ?? defaultData;
    setData(newData);
    return value;
  };

  const remove = async (key: string) => {
    await deleteData(key);
    const newData = { ...data };
    delete newData[key];
    setData(newData);
  };

  return (
    <DataContext.Provider value={{ data, save, load, remove }}>{children}</DataContext.Provider>
  );
};

export function useData<T>(contextKey: string, defaultData: T | null) {
  const dataContext = useDataContext<T>();

  useEffect(() => {
    dataContext.load(contextKey, defaultData);
  }, [contextKey]);
  const isLoading = dataContext?.data?.[contextKey] == undefined;
  const data = dataContext.data?.[contextKey] ?? null;

  return {
    data: data,
    isLoading: isLoading,
    update: (value: T) => dataContext.save(contextKey, value),
    patch: (value: Partial<T>) => dataContext.save(contextKey, { ...data, ...value })
  };
}

function useDataContext<T>(): DataContextType<T> {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
