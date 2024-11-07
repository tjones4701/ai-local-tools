import { useId } from '@fluentui/react-utilities';
import { quickHash } from '@renderer/lib/quickhash';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

export const QuickFormContext = React.createContext<any>(null);

export type IQuickFormContext = UseFormReturn & {
  getValue: (key: string) => any;
  setValue: (key: string, value: any) => void;
  setValues: (data: { [key: string]: any }) => void;
  disabled: boolean;
  loading: boolean;
  readOnly: boolean;
  reset?: () => void;
  hash: any;
  id: string;
};

interface IUseQuickForm {
  defaultValues?: any;
  readOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onChange?: (id: string, value: any, formData: any) => any;
}

export const useQuickForm = ({
  defaultValues,
  readOnly,
  loading,
  disabled,
  onChange
}: IUseQuickForm): IQuickFormContext => {
  const form: any = useForm({ defaultValues: defaultValues });
  const [formDataHash, setFormDataHash] = useState<null | number>(null);

  const uniquieId = useId();
  form.id = uniquieId;

  useEffect(() => {
    if (form != null) {
      const subscription = form.watch((formData, event) => {
        if (onChange != null) {
          onChange(event.name, event.value ?? formData[event?.name], formData);
        }
        setFormDataHash(quickHash(formData));
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      return () => {
        // do nothing
      };
    }
  }, [form.watch]);

  form.disabled = disabled;
  form.loading = loading;
  form.readOnly = readOnly;
  form.hash = formDataHash;
  form.setValues = (data: { [key: string]: any }) => {
    for (const i in data) {
      form?.setValue(i, data[i]);
    }
  };

  form.getValue = (elementName) => {
    return form?.getValues(elementName) ?? null;
  };

  useEffect(() => {
    form.setValues(defaultValues);
  }, []);

  return { ...form };
};

export const useQuickFormValue = (key: string) => {
  const context = useQuickFormContext();
  return context?.getValue(key);
};

export const useQuickFormContext = (): IQuickFormContext => {
  return useContext(QuickFormContext);
};
