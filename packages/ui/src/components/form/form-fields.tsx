import { useMemo } from 'react'
import type { ReactNode } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { useFormContext, Controller, useController } from 'react-hook-form'
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError as FieldErrorText,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    DateInput,
    FileInput,
    Textarea,
    RadioGroup,
    RadioGroupItem,
    Label,
} from '@repo/ui'
import { toFieldErrors } from './app-form'

type Orientation = 'vertical' | 'horizontal' | 'responsive'

type FormFieldProps<TFieldValues extends FieldValues = FieldValues> = {
    name: Path<TFieldValues>
    label?: ReactNode
    description?: ReactNode
    required?: boolean
    labelInfo?: ReactNode
    orientation?: Orientation
    fieldClassName?: string
    children: (args: {
        field: any
        disabled: boolean
        id: string
    }) => ReactNode
}

const getErrorByPath = (errors: unknown, path: string): unknown => {
    if (!errors || !path) return undefined

    return path
        .split('.')
        .reduce<unknown>((acc, key) => {
            if (!acc || typeof acc !== 'object') return undefined
            const obj = acc as Record<string, unknown>
            return obj[key]
        }, errors)
}

export const FormField = <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    description,
    required,
    labelInfo,
    orientation = 'vertical',
    fieldClassName,
    children,
}: FormFieldProps<TFieldValues>) => {
    const { control, formState } = useFormContext<TFieldValues>()
    const { isSubmitting, errors } = formState

    const id = name
    const fieldError = getErrorByPath(errors, name)

    return (
        <Controller
            name={name as any}
            control={control}
            render={({ field }) => (
                <Field
                    orientation={orientation}
                    data-invalid={!!fieldError}
                    className={fieldClassName}
                >
                    {label && (
                        <FieldLabel htmlFor={id} info={labelInfo}>
                            {label}
                            {required && (
                                <span className='text-xs font-normal text-muted-foreground'>
                                    (obrigatório)
                                </span>
                            )}
                        </FieldLabel>
                    )}

                    {description && (
                        <FieldDescription>
                            {description}
                        </FieldDescription>
                    )}

                    {children({
                        field,
                        disabled: isSubmitting,
                        id,
                    })}

                    <FieldErrorText errors={toFieldErrors(fieldError)} />
                </Field>
            )}
        />
    )
}

type TextFieldProps = {
    name: string
    label: ReactNode
    description?: ReactNode
    required?: boolean
    labelInfo?: ReactNode
    orientation?: Orientation
    fieldClassName?: string
    transformValue?: (value: string) => string
} & Omit<
    React.ComponentProps<typeof Input>,
    'name' | 'defaultValue' | 'value' | 'onBlur' | 'ref'
>

export const TextField = ({
    name,
    label,
    description,
    required,
    labelInfo,
    orientation,
    fieldClassName,
    transformValue,
    ...inputProps
}: TextFieldProps) => {
    const { clearErrors } = useFormContext()

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            labelInfo={labelInfo}
            orientation={orientation}
            fieldClassName={fieldClassName}
        >
            {({ field, disabled, id }) => (
                <Input
                    id={id}
                    {...field}
                    {...inputProps}
                    disabled={inputProps.disabled ?? disabled}
                    value={field.value ?? ''}
                    onChange={event => {
                        const raw = event.target.value
                        const nextValue = transformValue
                            ? transformValue(raw)
                            : raw

                        field.onChange(nextValue)
                        clearErrors(name)

                        if (inputProps.onChange) {
                            inputProps.onChange(event)
                        }
                    }}
                />
            )}
        </FormField>
    )
}

type TextAreaFieldProps<TFieldValues extends FieldValues = FieldValues> = {
    name: Path<TFieldValues>
    label: ReactNode
    description?: ReactNode
    required?: boolean
    labelInfo?: ReactNode
    orientation?: Orientation
    fieldClassName?: string
} & Omit<
    React.ComponentProps<typeof Textarea>,
    'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur' | 'ref'
>

export const TextAreaField = <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    description,
    required,
    labelInfo,
    orientation,
    fieldClassName,
    ...textareaProps
}: TextAreaFieldProps<TFieldValues>) => {
    const { clearErrors } = useFormContext()

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            labelInfo={labelInfo}
            orientation={orientation}
            fieldClassName={fieldClassName}
        >
            {({ field, disabled, id }) => (
                <Textarea
                    id={id}
                    {...textareaProps}
                    {...field}
                    disabled={textareaProps.disabled ?? disabled}
                    onChange={(e) => {
                        field.onChange(e)
                        clearErrors(name)
                    }}
                />
            )}
        </FormField>
    )
}

type SelectOption = {
    value: string
    label: ReactNode
}

type SelectFieldProps = {
    name: string
    label: ReactNode
    description?: ReactNode
    required?: boolean
    labelInfo?: ReactNode
    orientation?: Orientation
    fieldClassName?: string
    options?: SelectOption[]
    placeholder?: string
    disabled?: boolean
    children?: ReactNode
} & Omit<
    React.ComponentProps<typeof Select>,
    'value' | 'onValueChange' | 'defaultValue' | 'name'
>

export const SelectField = ({
    name,
    label,
    description,
    required,
    labelInfo,
    orientation,
    fieldClassName,
    options,
    placeholder = 'Selecione',
    disabled,
    children,
    ...selectProps
}: SelectFieldProps) => {
    const { clearErrors } = useFormContext()

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            labelInfo={labelInfo}
            orientation={orientation}
            fieldClassName={fieldClassName}
        >
            {({ field, disabled: formDisabled, id }) => (
                <Select
                    {...selectProps}
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                        field.onChange(value)
                        clearErrors(name)
                    }}
                    disabled={disabled ?? formDisabled}
                >
                    <SelectTrigger id={id} className='w-full'>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {children ??
                            options?.map(option => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            )}
        </FormField>
    )
}

type DateFieldProps = {
    name: string
    label: ReactNode
    description?: ReactNode
    required?: boolean
    labelInfo?: ReactNode
    orientation?: Orientation
    fieldClassName?: string
    disabled?: boolean
} & Omit<
    React.ComponentProps<typeof DateInput>,
    'value' | 'onChange' | 'id'
>

export const DateField = ({
    name,
    label,
    description,
    required,
    labelInfo,
    orientation,
    fieldClassName,
    disabled,
    ...dateProps
}: DateFieldProps) => {
    const { clearErrors } = useFormContext()

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            labelInfo={labelInfo}
            orientation={orientation}
            fieldClassName={fieldClassName}
        >
            {({ field, disabled: formDisabled, id }) => (
                <DateInput
                    {...dateProps}
                    id={id}
                    value={field.value}
                    onChange={(value) => {
                        field.onChange(value)
                        clearErrors(name)
                    }}
                    onBlur={field.onBlur}
                    disabled={disabled ?? formDisabled}
                />
            )}
        </FormField>
    )
}

type FileFieldProps = {
    name: string
    label: ReactNode
    description?: ReactNode
    required?: boolean
    orientation?: Orientation
    fieldClassName?: string
    helperText?: string
    containerClassName?: string
    className?: string
    accept?: string
    multiple?: boolean
    maxFiles?: number
    maxFileSizeMb?: number
    acceptLabel?: string
    sortable?: boolean
    disabled?: boolean
    valueOverride?: File[]
    allowRemoteDelete?: boolean
    labelInfo?: ReactNode
    dropDescription?: string
    onValueChange?: (
        files: File[],
        context: {
            fieldValue: unknown
            fieldOnChange: (value: unknown) => void
        },
    ) => void
}

export const FileField = ({
    name,
    label,
    description,
    required,
    orientation = 'vertical',
    fieldClassName,
    helperText,
    valueOverride,
    onValueChange,
    labelInfo,
    ...fileInputProps
}: FileFieldProps) => {
    const { control, clearErrors, formState } = useFormContext()
    const { isSubmitting } = formState
    const { field, fieldState } = useController({ name, control })

    const files = useMemo(() => {
        if (valueOverride) return valueOverride

        const value = field.value

        if (value instanceof FileList) {
            return Array.from(value)
        }

        if (Array.isArray(value)) {
            return value as File[]
        }

        return []
    }, [field.value, valueOverride])

    const handleChange = (files: File[]) => {
        if (onValueChange) {
            onValueChange(files, {
                fieldOnChange: (value: unknown) => {
                    field.onChange(value)
                    clearErrors(name)
                },
                fieldValue: field.value,
            })
            return
        }

        // Salva como array por padrão (compatível com Zod schemas)
        field.onChange(files)
        clearErrors(name)
    }

    return (
        <Field
            orientation={orientation}
            data-invalid={!!fieldState.error}
            className={fieldClassName}
        >
            <FieldLabel info={labelInfo}>
                {label}
                {required && (
                    <span className=' text-xs font-normal text-muted-foreground'>
                        (obrigatório)
                    </span>
                )}
            </FieldLabel>

            {description ? (
                <FieldDescription>{description}</FieldDescription>
            ) : null}

            <FileInput
                {...fileInputProps}
                disabled={fileInputProps.disabled ?? isSubmitting}
                value={files}
                onChange={handleChange}
            />

            <FieldErrorText errors={toFieldErrors(fieldState.error)} />

            {helperText ? (
                <FieldDescription>{helperText}</FieldDescription>
            ) : null}
        </Field>
    )
}

type RadioOption = {
    value: string
    label: ReactNode
}

type RadioGroupFieldProps = {
    name: string
    label: ReactNode
    description?: ReactNode
    required?: boolean
    labelInfo?: ReactNode
    orientation?: Orientation
    fieldClassName?: string
    options: RadioOption[]
    disabled?: boolean
    layout?: 'vertical' | 'horizontal'
}

export const RadioGroupField = ({
    name,
    label,
    description,
    required,
    labelInfo,
    orientation,
    fieldClassName,
    options,
    disabled,
    layout = 'vertical',
}: RadioGroupFieldProps) => {
    const { clearErrors } = useFormContext()

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            labelInfo={labelInfo}
            orientation={orientation}
            fieldClassName={fieldClassName}
        >
            {({ field, disabled: formDisabled, id }) => (
                <RadioGroup
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                        field.onChange(value)
                        clearErrors(name)
                    }}
                    disabled={disabled ?? formDisabled}
                    className={layout === 'horizontal' ? 'flex flex-row gap-4' : undefined}
                >
                    {options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={option.value}
                                id={`${id}-${option.value}`}
                            />
                            <Label
                                htmlFor={`${id}-${option.value}`}
                                className="font-normal cursor-pointer"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
        </FormField>
    )
}
