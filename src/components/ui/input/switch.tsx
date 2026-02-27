import { Form, FormItemProps, Switch, SwitchProps } from "antd";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

interface ISwitchFieldProps<TFormValues extends FieldValues> extends SwitchProps {
  name: keyof TFormValues;
  label: string;
  layout?: FormItemProps["layout"];
}

export const SwitchField = <TFormValues extends Record<string, any>>({
  name,
  label,
  layout = "horizontal",
  ...props
}: ISwitchFieldProps<TFormValues> & SwitchProps) => {
  const { control } = useFormContext<TFormValues>();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          layout={layout}
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <Switch
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
