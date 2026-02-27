import { Form, FormItemProps, Input } from "antd";
import { TextAreaProps } from "antd/es/input/TextArea";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

interface ITextAreaFieldProps<TFormValues extends FieldValues> extends Omit<TextAreaProps, "name"> {
  name: keyof TFormValues;
  label: string;
  layout?: FormItemProps["layout"];
}

export const InputTextAreaField = <TFormValues extends FieldValues>({
  name,
  layout = "vertical",
  label,
  ...props
}: ITextAreaFieldProps<TFormValues>) => {
  const { control } = useFormContext<TFormValues>();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={error?.message}
          label={label}
          layout={layout}
          required={props.required}
        >
          <Input.TextArea
            {...field}
            data-rhf={name}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
