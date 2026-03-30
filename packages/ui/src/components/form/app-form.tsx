import { cn } from '@repo/ui';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

export type FieldErrorItem = {
  message: string;
};

export const toFieldErrors = (error?: unknown): FieldErrorItem[] => {
  if (!error) return [];

  if (Array.isArray(error)) {
    const nested: FieldErrorItem[] = error.flatMap((item) =>
      toFieldErrors(item),
    );

    const seen = new Set<string>();
    return nested.filter((item) => {
      const key = item.message;
      if (!key) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === 'string') {
      const msg = maybeError.message.trim();
      if (msg) {
        return [{ message: msg }];
      }
    }
  }

  return [];
};

type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit: (values: TTransformedValues) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  id?: string;
  preventSubmitIfPristine?: boolean;
  enableUnsavedWarning?: boolean;
  onPristineSubmitAttempt?: () => void;
};

export const Form = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  form,
  onSubmit,
  children,
  className,
  id,
  preventSubmitIfPristine = true,
  enableUnsavedWarning = true,
  onPristineSubmitAttempt,
}: FormProps<TFieldValues, TContext, TTransformedValues>) => {
  const { formState } = form;
  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    if (!enableUnsavedWarning) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enableUnsavedWarning, isDirty, isSubmitting]);

  const handleValidSubmit = async (values: TTransformedValues) => {
    if (preventSubmitIfPristine && !isDirty) {
      onPristineSubmitAttempt?.();
      return;
    }

    await onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        noValidate
        onSubmit={form.handleSubmit(handleValidSubmit)}
        className={cn('space-y-4', className)}
      >
        {children}
      </form>
    </FormProvider>
  );
};
