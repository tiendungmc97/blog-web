"use client";
import { Form, FormItemProps, Input, InputProps } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

interface IInputFieldProps<TFormValues extends FieldValues> extends Omit<InputProps, "name"> {
  name: keyof TFormValues;
  label: ReactNode;
  required?: boolean;
  layout?: FormItemProps["layout"];
  showError?: boolean;
}

export const InputPasswordField = <TFormValues extends FieldValues>({
  name,
  layout = "vertical",
  label,
  required = false,
  showError = true,
  ...props
}: IInputFieldProps<TFormValues>) => {
  const [init, setInit] = useState(false);
  const { control } = useFormContext<TFormValues>();
  useEffect(() => {
    setInit(true);
  }, []);
  if (!init) {
    return (
      <Form.Item
        label={label}
        layout={layout}
        required={required}
      >
        <Input.Password
          data-rhf={name}
          {...props}
        />
      </Form.Item>
    );
  }
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={showError && error?.message}
          label={label}
          layout={layout}
          required={required}
        >
          <Input.Password
            {...field}
            data-rhf={name}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
