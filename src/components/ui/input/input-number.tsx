import { Form, FormItemProps, InputNumber, InputNumberProps } from "antd";
import { forwardRef, memo, ReactNode } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { Language } from "@/types/language";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NumericFormat, NumericFormatProps, OnValueChange } from "react-number-format";
interface IInputNumberFieldProps<TFormValues extends FieldValues> extends Omit<InputNumberProps, "name"> {
  name: Path<TFormValues>;
  label: ReactNode;
  required?: boolean;
  layout?: FormItemProps["layout"];
}

export const InputNumberField = <TFormValues extends FieldValues>({
  name,
  label,
  required = false,
  layout = "vertical",
  ...props
}: IInputNumberFieldProps<TFormValues>) => {
  const { control } = useFormContext<TFormValues>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={error ? "error" : ""}
          help={error?.message}
          layout={layout}
        >
          <InputNumber
            {...field}
            data-rhf={name}
            className="w-full"
            value={field.value}
            onChange={field.onChange}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};

interface IFieldProps<TFormValues extends FieldValues>
  extends Omit<NumericFormatProps, "onChange" | "value" | "name" | "onBlur"> {
  name: Path<TFormValues>;
  label?: ReactNode;
  required?: boolean;
  layout?: FormItemProps["layout"];
  symbol?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  onValueChange?: OnValueChange;
  onBlur?: () => void;
}

function InputAmountFieldInner<TFormValues extends FieldValues>(
  {
    name,
    label,
    required = false,
    layout = "vertical",
    symbol = "",
    min = 0,
    max,
    step = 1,
    className = "",
    onValueChange,
    onBlur,
    ...restProps
  }: IFieldProps<TFormValues>,
  ref: React.Ref<HTMLInputElement>,
) {
  const { control } = useFormContext<TFormValues>();
  const locale = Language.EN;

  const handleIncrement = (currentValue: number | undefined, onChange: (value: number | undefined) => void) => {
    const current = currentValue || 0;
    const newValue = current + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = (currentValue: number | undefined, onChange: (value: number | undefined) => void) => {
    const current = currentValue || 0;
    const newValue = current - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={error ? "error" : ""}
          help={error?.message}
          layout={layout}
        >
          <div className={`relative ${className}`}>
            <NumericFormat
              getInputRef={ref}
              value={field.value ?? ""}
              displayType="input"
              thousandSeparator={locale === Language.EN ? "." : ","}
              decimalSeparator={locale === Language.EN ? "," : "."}
              allowNegative={false}
              className={`focus:border-primary focus:ring-primary/20 dark:focus:border-primary dark:focus:ring-primary/20 w-full rounded-sm border border-gray-300 bg-white px-4 py-3 pr-20 text-left text-base font-medium text-gray-900 transition-colors duration-200 placeholder:text-gray-400 focus:ring-2 focus:outline-none disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 md:py-4`}
              onValueChange={(values, sourceInfo) => {
                field.onChange(values.floatValue ?? null);
                if (onValueChange) {
                  onValueChange(values, sourceInfo);
                }
              }}
              onBlur={() => {
                field.onBlur();
                if (onBlur) {
                  onBlur();
                }
              }}
              {...restProps}
            />

            {/* Symbol and controls */}
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{symbol}</span>

              <div className="flex flex-col gap-0.5 border-l border-gray-300 pl-2">
                <button
                  type="button"
                  onClick={() => handleIncrement(field.value, field.onChange)}
                  disabled={restProps.disabled || (max !== undefined && (field.value + step || 0) >= max)}
                  className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300`}
                >
                  <ChevronUp className="h-3 w-3" />
                </button>

                <div className="flex flex-col gap-0.5 border-b border-gray-300 pl-2"></div>

                <button
                  type="button"
                  onClick={() => handleDecrement(field.value, field.onChange)}
                  disabled={restProps.disabled || (field.value || 0) <= min + step}
                  className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300`}
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </Form.Item>
      )}
    />
  );
}

export const InputAmountField = memo(forwardRef(InputAmountFieldInner)) as <TFormValues extends FieldValues>(
  props: IFieldProps<TFormValues> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement;
