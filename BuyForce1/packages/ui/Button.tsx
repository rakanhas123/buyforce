import React from 'react';

type Props = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Button({ children, onClick, className }: Props) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
