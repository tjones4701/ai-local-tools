import { makeStyles } from '@fluentui/react-components';
import Loading from '@renderer/components/loading';
import SpaceApart from '@renderer/components/utilities/SpaceApart';
import { forceArray } from '@renderer/lib/force-array';
import { quickHash } from '@renderer/lib/quickhash';
import { tryCall } from '@renderer/lib/try-call';
import React, { useEffect } from 'react';
import { useQuickForm, QuickFormContext } from './use-quick-form';
import { Theme } from '@renderer/theme';
import Button from '@renderer/components/button';
interface IQuickForm {
  children: any;
  readOnly?: boolean;
  submitText?: string;
  onSubmit?: (values: any, dirtyValues: any) => any;
  hideSubmit?: boolean;
  hideCancel?: boolean;
  onChange?: (key: string, value: any, formData: any) => void;
  cancelText?: string;
  onCancel?: () => any;
  defaultValues?: any;
  values?: any;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const useStyles = makeStyles({
  defaultInputContainer: {
    ':not(:empty)': {
      paddingBottom: Theme.sizing.small
    }
  }
});

const QuickForm: React.FC<IQuickForm> = function ({
  children,
  submitText,
  onSubmit,
  defaultValues,
  hideSubmit,
  hideCancel,
  readOnly,
  cancelText,
  onChange,
  onCancel,
  values,
  disabled,
  loading,
  loadingText
}: IQuickForm) {
  const { defaultInputContainer } = useStyles();
  children = forceArray(children ?? []);

  const form = useQuickForm({
    defaultValues: defaultValues,
    readOnly: readOnly,
    onChange: onChange
  });

  useEffect(() => {
    if (form == null) {
      return;
    }
    if (values != null) {
      form.reset();
      form?.setValues?.(values);
    }
  }, [quickHash(values)]);

  form.disabled = disabled ?? false;
  form.loading = loading ?? false;

  const onInnerSubmit = (vals) => {
    const dirtyValues = {};

    const existingValues = values ?? {};
    for (const i in vals) {
      if (vals[i] != existingValues[i]) {
        dirtyValues[i] = vals[i];
      }
    }

    tryCall(onSubmit, vals, dirtyValues);
  };

  const handleCancel = () => {
    tryCall(onCancel);
  };

  return (
    <QuickFormContext.Provider value={form}>
      {loading && <Loading>{loadingText}</Loading>}
      <form onSubmit={form?.handleSubmit(onInnerSubmit)}>
        {children?.map((item: React.ReactElement, key) => {
          const id = quickHash(item?.props);
          return (
            <div key={`${id}_${key}`} className={defaultInputContainer}>
              {item}
            </div>
          );
        })}

        {!readOnly && (
          <SpaceApart>
            {!hideSubmit && (
              <Button disabled={form?.disabled} size="small" buttonType="submit">
                {submitText ?? 'Submit'}
              </Button>
            )}
            {!hideCancel && cancelText != null && (
              <Button
                onClick={handleCancel}
                disabled={form?.disabled ?? false}
                size="small"
                type="primary-outline"
              >
                {cancelText ?? 'Cancel'}
              </Button>
            )}
          </SpaceApart>
        )}
      </form>
    </QuickFormContext.Provider>
  );
};

export default QuickForm;
