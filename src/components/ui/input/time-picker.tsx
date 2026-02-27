import { Form, TimePicker, TimePickerProps } from "antd";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";

interface ITimePickerFieldProps<TFormValues> extends Omit<TimePickerProps, "name" | "control"> {
  name: keyof TFormValues;
}

export const TimePickerField = <TFormValues extends Record<string, any>>({
  name,
  ...props
}: ITimePickerFieldProps<TFormValues>) => {
  const { control } = useForm<TFormValues>();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={error?.message}
        >
          <TimePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            data-rhf={name}
            onChange={(time) => field.onChange(time ? time.format("HH:mm:ss") : null)}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
