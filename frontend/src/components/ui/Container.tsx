import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <div
      className={`w-full px-4 sm:px-6 md:px-8 lg:px-4 mx-auto max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px] ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
