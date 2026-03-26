import { cn } from '../../lib/utils';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label?: string;
  options: SelectFieldOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function SelectField({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Selecione uma opção...',
  className,
  disabled,
  error,
}: SelectFieldProps) {
  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      {label && <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={label?.toLowerCase().replace(/\s+/g, '-')} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
