import { Form, FormItemProps, Select, SelectProps } from "antd";
import { ReactNode } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface ISelectInputFieldProps<TFormValues extends FieldValues> extends SelectProps {
  name: Path<TFormValues>;
  label: ReactNode;
  required?: boolean;
  layout?: FormItemProps["layout"];
}

export const SelectField = <TFormValues extends FieldValues>({
  name,
  options,
  label,
  layout = "vertical",
  required = false,
  ...props
}: ISelectInputFieldProps<TFormValues>) => {
  const { control } = useFormContext<TFormValues>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={error?.message}
          colon={false}
          label={label}
          layout={layout}
          required={required}
        >
          <Select
            {...field}
            data-rhf={name}
            onChange={(selectedValue) => {
              field.onChange(selectedValue);
            }}
            filterOption={(input, option) => String(option?.label).toLowerCase().includes(input.toLowerCase())}
            options={options}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
