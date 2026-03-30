import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import type { Matcher } from "react-day-picker";

const toIsoDate = (value: Date) => {
	const year = value.getFullYear();
	const month = String(value.getMonth() + 1).padStart(2, "0");
	const day = String(value.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const tryParseIso = (value?: string) => {
	if (!value) return undefined;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
	const date = new Date(`${value}T00:00:00`);
	return Number.isNaN(date.getTime()) ? undefined : date;
};

const tryParseDisplay = (value?: string) => {
	if (!value) return undefined;
	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
	if (!match) return undefined;
	const [, dd, mm, yyyy] = match;
	const date = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
	return Number.isNaN(date.getTime()) ? undefined : date;
};

const parseAnyDateString = (value?: string) => tryParseIso(value) ?? tryParseDisplay(value);

const formatDisplay = (iso?: string) => {
	const date = parseAnyDateString(iso);
	if (!date) return iso ?? "";
	const dd = String(date.getDate()).padStart(2, "0");
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const yyyy = date.getFullYear();
	return `${dd}/${mm}/${yyyy}`;
};

export type DateInputProps = {
	id?: string;
	value?: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
	min?: string;
	max?: string;
};

export function DateInput({
	id,
	value,
	onChange,
	onBlur,
	disabled,
	min,
	max,
}: DateInputProps) {
	const [text, setText] = React.useState(formatDisplay(value));

	React.useEffect(() => {
		if (!value) {
			setText("");
			return;
		}
		const formatted = formatDisplay(value);
		setText(formatted);
	}, [value]);

	const minDate = React.useMemo(() => tryParseIso(min), [min]);
	const maxDate = React.useMemo(() => tryParseIso(max), [max]);

	const disabledDays = React.useMemo(() => {
		const rules: Matcher[] = [];
		if (minDate) rules.push({ before: minDate });
		if (maxDate) rules.push({ after: maxDate });
		return rules.length ? rules : undefined;
	}, [minDate, maxDate]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const raw = event.target.value;
		const digits = raw.replace(/\D/g, "").slice(0, 8);
		const dd = digits.slice(0, 2);
		const mm = digits.slice(2, 4);
		const yyyy = digits.slice(4, 8);
		const display = [dd, mm, yyyy].filter(Boolean).join("/");

		const normalized = digits.length === 8 ? `${yyyy}-${mm}-${dd}` : display;

		setText(display);
		onChange(normalized);
	};

	const handleSelect = (date?: Date) => {
		if (!date) return;
		const iso = toIsoDate(date);
		setText(formatDisplay(iso));
		onChange(iso);
	};

	return (
		<div className="flex w-full items-start gap-2">
			<Input
				id={id}
				type="text"
				inputMode="numeric"
				pattern="\\d{2}/\\d{2}/\\d{4}"
				placeholder="dd/mm/aaaa"
				value={text}
				onChange={handleInputChange}
				onBlur={onBlur}
				disabled={disabled}
				autoComplete="off"
			/>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						size="icon"
						disabled={disabled}
						aria-label="Selecionar data pelo calendario"
					>
						<CalendarIcon className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={parseAnyDateString(value)}
						disabled={disabledDays}
						onSelect={handleSelect}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
