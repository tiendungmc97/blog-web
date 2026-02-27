import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, FormItemProps, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/es/upload";
import { ReactNode, useState } from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

const { Dragger } = Upload;

interface IInputFileFieldProps<TFormValues extends FieldValues> extends Omit<UploadProps, "name"> {
  children?: ReactNode;
  note?: ReactNode;
  name: keyof TFormValues;
  label: ReactNode;
  required?: boolean;
  layout?: FormItemProps["layout"];
  allowedFormats?: string[]; // e.g., ['.jpg', '.png', '.pdf']
  maxFiles?: number;
  uploadType?: "button" | "dragger"; // UI type
}

export const InputFileField = <TFormValues extends FieldValues>({
  children,
  note,
  name,
  layout = "vertical",
  label,
  required = false,
  allowedFormats = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"],
  maxFiles = 1,
  uploadType = "button",
  ...props
}: IInputFileFieldProps<TFormValues>) => {
  const { control, setValue } = useFormContext();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (info: { fileList: UploadFile[] }) => {
    const validFiles = [...info.fileList];
    setFileList(validFiles);
    if (maxFiles === 1) {
      setValue(name as string, validFiles[0] || null, { shouldValidate: true });
    } else {
      setValue(name as string, validFiles, { shouldValidate: true });
    }
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    if (maxFiles === 1) {
      setValue(name as string, null, { shouldValidate: true });
    } else {
      setValue(name as string, newFileList, { shouldValidate: true });
    }
  };

  const uploadProps = {
    ...props,
    fileList,
    onChange: handleChange,
    onRemove: handleRemove,
    "data-rhf": name,
    accept: allowedFormats.join(","),
  };

  const renderUploadComponent = () => {
    if (uploadType === "dragger") {
      return (
        <Dragger {...uploadProps}>
          <InboxOutlined />
        </Dragger>
      );
    }

    return (
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>{children ?? "Upload"}</Button>
        {note}
      </Upload>
    );
  };

  return (
    <Controller
      name={name as string}
      control={control}
      render={({ fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? "error" : ""}
          help={error?.message}
          label={label}
          layout={layout}
          required={required}
        >
          {renderUploadComponent()}
        </Form.Item>
      )}
    />
  );
};
