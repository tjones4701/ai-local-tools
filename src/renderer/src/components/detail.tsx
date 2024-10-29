import { FEInputTypes } from '@renderer/quick-form/inputs/fe-input';
import React from 'react';
import { useAsync } from 'react-use';
import Icon from './icon';
import { DateLib } from '@renderer/lib/date';
import { Label } from '@fluentui/react-components';

export interface IDetail {
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  multiLine?: boolean;
  value?: any;
  type?: FEInputTypes;
}

const typeMappingFunctions = {
  dob: (value: any) => {
    return DateLib.toDateOfBirth(value);
  },
  date: (value: any) => {
    return DateLib.format(value, 'MMM d, yyyy');
  },
  checkbox: (value: any) => {
    if (value == true) {
      return <Icon>Check</Icon>;
    }
    return 'No';
  }
};

const Detail: React.FC<IDetail> = ({
  children,
  label,
  value: rawValue,
  type = 'text',
  className
}: IDetail) => {
  rawValue = children ?? rawValue;

  const result = useAsync(async () => {
    return rawValue;
  }, [rawValue]);

  const loading = result?.loading;
  let value = result?.value;

  if (loading) {
    value = '';
  }

  value = value ?? children;
  if (typeMappingFunctions?.[type] != null) {
    value = typeMappingFunctions?.[type](value) ?? value;
  }
  return (
    <div className={className ?? ''}>
      <Label weight="semibold">{label}:</Label> {value}
    </div>
  );
};

export default Detail;
