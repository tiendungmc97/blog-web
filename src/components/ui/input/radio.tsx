import { Form, FormItemProps, Radio, RadioGroupProps } from "antd";
import { ReactNode } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface IRadioFieldProps<TFormValues extends FieldValues> extends RadioGroupProps {
  name: Path<TFormValues>;
  label: ReactNode;
  required?: boolean;
  layout?: FormItemProps["layout"];
}

export const RadioField = <TFormValues extends FieldValues>({
  name,
  options,
  label,
  layout = "vertical",
  required = false,
  ...props
}: IRadioFieldProps<TFormValues>) => {
  const { control } = useFormContext<TFormValues>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={error?.message}
          layout={layout}
          required={required}
          label={label}
        >
          <Radio.Group
            {...field}
            data-rhf={name}
            onChange={field.onChange}
            value={field.value}
            options={options}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
