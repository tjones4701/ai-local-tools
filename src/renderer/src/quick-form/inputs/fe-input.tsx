import React from 'react';
import { noEmptyString } from '@renderer/lib/empty-string';
import { useQuickFormContext } from '../use-quick-form';
import Detail from '@renderer/components/detail';
import ControlledInput, { IControlledInputSizes } from '../controller-inputs/controlled-input';
import ControlledTextArea from '../controller-inputs/controller-textarea';
import { Label } from '@fluentui/react-components';

export interface IFEInput {
  name: string;
  label?: React.ReactChild;
  placeholder?: string;
  type?: FEInputTypes;
  disabled?: boolean;
  required?: boolean;
  size?: IControlledInputSizes;
  readOnly?: boolean;
  hideOnReadOnly?: boolean;
  hideOnEmpty?: boolean;
}

export type FEInputTypes =
  | 'text'
  | 'textarea'
  | 'phone'
  | 'email'
  | 'ndis'
  | 'email'
  | 'date'
  | 'dob'
  | 'lookup'
  | 'password'
  | 'number'
  | 'time'
  | 'medicare'
  | 'datetime'
  | 'checkbox';

const typeMappings: any = {
  dob: 'date',
  date: 'date',
  password: 'password',
  number: 'number',
  time: 'time',
  yesno: 'checkbox'
};

const FEInput: React.FC<IFEInput> = function ({
  disabled,
  name,
  placeholder,
  type = 'text',
  label,
  size,
  required,
  readOnly,
  hideOnReadOnly,
  hideOnEmpty
}: IFEInput) {
  const context = useQuickFormContext();

  let elementId = context.id + '-' + name;
  const control = context.control;
  name = name ?? '';
  if (context.readOnly || readOnly) {
    if (hideOnReadOnly) {
      return <></>;
    }
    const value = context?.getValue(name);
    if ((value?.toString() ?? '') == '' && hideOnEmpty) {
      return null;
    }
    return (
      <Detail label={label} type={type}>
        {value}
      </Detail>
    );
  } else {
    const elementType = typeMappings[type];

    let ControlledElement: any = ControlledInput;
    if (type == 'textarea') {
      ControlledElement = ControlledTextArea;
    }
    let isDisabled = disabled || context.disabled;
    return (
      <>
        {noEmptyString(label?.toString()) && (
          <>
            <Label required={required} htmlFor={elementId} disabled={isDisabled}>
              {label}
            </Label>
            <br />
          </>
        )}

        <ControlledElement
          id={elementId}
          size={size ?? 'mini'}
          required={required}
          disabled={isDisabled}
          control={control}
          name={name}
          placeholder={placeholder}
          type={elementType}
        />
      </>
    );
  }
};

export default FEInput;
