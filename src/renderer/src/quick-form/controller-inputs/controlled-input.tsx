import { Input } from '@fluentui/react-components';
import { DateLib } from '@renderer/lib/date';
import * as React from 'react';
import { Controller } from 'react-hook-form';

export type IControlledInputTypes = 'password' | 'date';
export type IControlledInputSizes = 'large' | 'small' | 'medium';
export interface IControlledInput {
  control: any;
  name: string;
  placeholder: string;
  type?: IControlledInputTypes;
  disabled: boolean;
  size?: IControlledInputSizes;
  required?: boolean;
  id?: string;
}

const ControlledInput: React.FC<IControlledInput> = function ({
  control,
  name,
  placeholder,
  type,
  disabled,
  size,
  required,
  id
}: IControlledInput) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, name, ref } }) => {
        if (type == 'date') {
          value = DateLib.toDateOrNull(value) ?? '';
        }
        return (
          <Input
            id={id}
            required={required}
            size={size}
            disabled={disabled}
            ref={ref as any}
            onChange={onChange}
            onBlur={onBlur}
            value={value ?? ''}
            name={name}
            type={type}
            placeholder={placeholder}
          />
        );
      }}
    />
  );
};

export default ControlledInput;
