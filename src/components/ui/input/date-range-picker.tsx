import { DatePicker, Form, FormItemProps } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

dayjs.extend(utc);

const { RangePicker } = DatePicker;

interface IDateRangePickerFieldProps<TFormValues extends FieldValues> extends Omit<RangePickerProps, "name"> {
  name: keyof TFormValues;
  label?: string;
  layout?: FormItemProps["layout"];
  required?: boolean;
}

export const DateRangePickerField = <TFormValues extends FieldValues>({
  name,
  label,
  layout = "vertical",
  required = false,
  ...props
}: IDateRangePickerFieldProps<TFormValues>) => {
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
          <RangePicker
            data-rhf={name}
            className="w-full"
            value={field.value ? ([dayjs(field.value[0]), dayjs(field.value[1])] as [Dayjs, Dayjs]) : null}
            onChange={(dates) => {
              const utcDates = dates
                ? (dates as [Dayjs, Dayjs]).map((date, index) =>
                    date ? (index === 0 ? date.startOf("day").utc().format() : date.endOf("day").utc().format()) : null,
                  )
                : null;
              field.onChange(utcDates);
            }}
            onBlur={field.onBlur}
            name={field.name}
            {...props}
          />
        </Form.Item>
      )}
    />
  );
};
