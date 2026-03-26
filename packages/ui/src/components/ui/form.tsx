import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
  useFormContext,
} from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = { id: string };

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <Label
      ref={ref}
      className={cn(error && 'text-danger', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-subtle-text', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : children;
  if (!body) return null;
  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-danger', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

interface FormRootProps<TFieldValues extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues, any, any>;
  onSubmit: SubmitHandler<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
  preventSubmitIfPristine?: boolean;
  enableUnsavedWarning?: boolean;
  onPristineSubmitAttempt?: () => void;
}

function FormRoot<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
  preventSubmitIfPristine = true,
  enableUnsavedWarning = true,
  onPristineSubmitAttempt,
  ...props
}: FormRootProps<TFieldValues>) {
  const { formState } = form;
  const { isDirty, isSubmitting } = formState;

  React.useEffect(() => {
    if (!enableUnsavedWarning) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      (event as any).returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enableUnsavedWarning, isDirty, isSubmitting]);

  const handleValidSubmit: SubmitHandler<TFieldValues> = async (values) => {
    if (preventSubmitIfPristine && !isDirty) {
      onPristineSubmitAttempt?.();
      return;
    }
    await onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleValidSubmit)}
        className={cn('flex flex-col gap-4', className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
FormRoot.displayName = 'Form.Root';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: TName;
  label?: string;
  description?: string;
}

function FormInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  className,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input className={className} {...inputProps} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
FormInputField.displayName = 'Form.Input';

interface FormRememberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function FormRemember<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, label, children, disabled }: FormRememberProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const labelContent = children ?? label;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            {labelContent && (
              <FormLabel className="cursor-pointer select-none font-normal">
                {labelContent}
              </FormLabel>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
FormRemember.displayName = 'Form.Remember';

interface FormSubmitProps extends ButtonProps {
  loadingText?: string;
  loading?: boolean;
}

const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ children, loading, loadingText, disabled, ...props }, ref) => {
    return (
      <Button ref={ref} type="submit" disabled={disabled ?? loading} {...props}>
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  },
);
FormSubmit.displayName = 'Form.Submit';


const Form = Object.assign(FormRoot, {
  Field: FormField,
  Item: FormItem,
  Label: FormLabel,
  Control: FormControl,
  Description: FormDescription,
  Message: FormMessage,
  Input: FormInputField,
  Remember: FormRemember,
  Submit: FormSubmit,
});

export { Form };
