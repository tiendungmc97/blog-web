import { Form, FormItemProps, Input } from "antd";
import { ReactNode, forwardRef } from "react";
import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";

/**
 * OTP Input Field Component
 *
 * A reusable OTP (One-Time Password) input component that integrates with react-hook-form.
 * Built on top of Ant Design's Input.OTP component.
 *
 * @example
 * // Basic usage with 6-digit OTP
 * <InputOTPField
 *   name="otp"
 *   label="Enter OTP"
 *   required
 * />
 *
 * @example
 * // Custom length with callback
 * <InputOTPField
 *   name="verificationCode"
 *   label="Verification Code"
 *   length={4}
 *   onComplete={(value) => console.log('OTP completed:', value)}
 * />
 *
 * @example
 * // Masked OTP for sensitive data
 * <InputOTPField
 *   name="secureCode"
 *   label="Secure Code"
 *   mask
 *   autoFocus
 * />
 */

interface IOTPInputProps<TFormValues extends FieldValues> {
  /** Field name for form control */
  name: Path<TFormValues>;
  /** Label for the input field */
  label?: ReactNode;
  /** Whether the field is required */
  required?: boolean;
  /** Form item layout */
  layout?: FormItemProps["layout"];
  /** Number of OTP input boxes (default: 6) */
  length?: number;
  /** Size of the input boxes */
  size?: "small" | "middle" | "large";
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to auto focus the first input */
  autoFocus?: boolean;
  /** Custom CSS class names */
  className?: string;
  /** Custom formatter function to process input */
  formatter?: (str: string) => string;
  /** Callback when OTP is completed */
  onComplete?: (value: string) => void;
  /** Callback on value change */
  onValueChange?: (value: string) => void;
  /** Whether to mask the input values */
  mask?: boolean;
  /** Input variant style */
  variant?: "outlined" | "borderless" | "filled";
}

export const InputOTPField = forwardRef<any, IOTPInputProps<any>>(
  <TFormValues extends FieldValues>(
    {
      name,
      layout = "vertical",
      label,
      required = false,
      length = 6,
      size = "large",
      disabled = false,
      autoFocus = false,
      className = "!text-center",
      formatter = (str: string) => str.replace(/\D/g, ""),
      onComplete,
      onValueChange,
      mask = false,
      variant = "outlined",
      ...props
    }: IOTPInputProps<TFormValues>,
    ref: any,
  ) => {
    const { control } = useFormContext<TFormValues>();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            validateStatus={error ? "error" : ""}
            help={error?.message}
            label={label}
            layout={layout}
            required={required}
          >
            <Input.OTP
              {...field}
              ref={ref}
              data-rhf={name}
              length={length}
              size={size}
              disabled={disabled}
              autoFocus={autoFocus}
              className={className}
              formatter={formatter}
              mask={mask}
              variant={variant}
              onChange={(value) => {
                if (value.length === length && onComplete) {
                  onComplete(value);
                }
              }}
              onInput={(value) => {
                const valueStr = value.join("");
                field.onChange(valueStr);
                if (onValueChange) {
                  onValueChange(valueStr);
                }
              }}
              {...props}
            />
          </Form.Item>
        )}
      />
    );
  },
);

InputOTPField.displayName = "InputOTPField";
