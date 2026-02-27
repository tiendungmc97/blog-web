import { DatePicker, DatePickerProps, Form, FormItemProps } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

dayjs.extend(utc);
interface IDatePickerFieldProps<TFormValues extends FieldValues> extends Omit<DatePickerProps, "name"> {
  name: keyof TFormValues;
  label?: string;
  layout?: FormItemProps["layout"];
  required?: boolean;
}

export const DatePickerField = <TFormValues extends FieldValues>({
  name,
  label,
  layout = "vertical",
  required = false,
  ...props
}: IDatePickerFieldProps<TFormValues>) => {
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
          required={required}
        >
          <DatePicker
            {...field}
            data-rhf={name}
            className="w-full"
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              const utcDate = date ? date.utc().format() : null;
              field.onChange(utcDate);
            }}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
