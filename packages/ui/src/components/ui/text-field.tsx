import * as React from 'react';

import { cn } from '../../lib/utils';
import { Input } from './input';
import { Label } from './label';

export interface TextFieldProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, wrapperClassName, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col items-start gap-2', wrapperClassName)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <Input
          ref={ref}
          id={inputId}
          className={cn(error && 'border-danger focus-visible:ring-danger', className)}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = 'TextField';
