import { Checkbox, CheckboxProps, Form, FormItemProps } from "antd";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface ICheckboxFieldProps<TFormValues extends FieldValues> extends Omit<CheckboxProps, "name"> {
  name: Path<TFormValues>;
  label: string;
  layout?: FormItemProps["layout"];
  required?: boolean;
  showError?: boolean;
}

export const CheckBoxField = <TFormValues extends Record<string, any>>({
  name,
  label,
  layout = "horizontal",
  required,
  showError = true,
  ...props
}: ICheckboxFieldProps<TFormValues>) => {
  const { control } = useFormContext<TFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={showError && error?.message}
          layout={layout}
          required={required}
        >
          <Checkbox
            {...field}
            data-rhf={name}
            checked={!!field.value}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
