import { useData } from './save-data';

export const useSettings = (group: string, code: string, defaultValue: string) => {
  group = group.toUpperCase();
  code = code.toUpperCase();
  const data = useData('SETTINGS_' + group, {});

  return {
    isLoading: data.isLoading,
    value: data?.data?.[code] ?? defaultValue,
    set: (value: string) => data.patch({ [code]: value })
  };
};
