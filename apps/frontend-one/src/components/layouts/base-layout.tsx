import { cn } from '@repo/ui';
import type React from 'react';

type BaseProps = { children?: React.ReactNode; className?: string };
const Root = ({ children, className }: BaseProps) => (
  <div
    className={cn(
      'flex flex-1 flex-col gap-y-4 p-4 w-full',
      className,
    )}
  >
    {children}
  </div>
);
type HeaderProps = BaseProps & { title: string; description?: string };
const Header = ({ title, description, children, className }: HeaderProps) => (
  <div className={cn('flex items-center gap-4', className)}>
    <div className="min-w-0">
      <h2 className="text-2xl font-bold tracking-tight truncate">{title}</h2>
      {description && (
        <p className="text-subtle-text truncate">{description}</p>
      )}
    </div>
    {children}
  </div>
);
type ContentVariant = 'default' | 'form' | 'table';
type ContentProps = BaseProps & { variant?: ContentVariant };
const Content = ({
  children,
  className,
  variant = 'default',
}: ContentProps) => {
  const variants: Record<ContentVariant, string> = {
    default: 'pt-0',
    form: 'w-full max-w-2xl',
    table: 'pt-0',
  };
  return (
    <div
      className={cn(
        'flex flex-col flex-1 gap-6 pt-4',
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
};
type MainProps = BaseProps & {
  title: string;
  description?: string;
  headerContent?: React.ReactNode;
  contentClassName?: string;
  variant?: ContentVariant;
};
const Main = ({
  title,
  description,
  headerContent,
  children,
  className,
  contentClassName,
  variant,
}: MainProps) => (
  <Root className={className}>
    <Header title={title} description={description}>
      {headerContent}
    </Header>
    <Content variant={variant} className={contentClassName}>
      {children}
    </Content>
  </Root>
);
export const BaseLayout = { Root, Header, Content, Main };
