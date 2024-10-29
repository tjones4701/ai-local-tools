import * as React from 'react';

interface ILoading {
  children?: React.ReactNode;
}
const Loading: React.FC<ILoading> = function ({ children }: ILoading) {
  const getLabel = () => {
    return <>{children}</>;
  };
  return <div>Loading... {getLabel()}</div>;
};

export default Loading;
