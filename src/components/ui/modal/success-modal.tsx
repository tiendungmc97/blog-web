"use client";

import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
const { Title } = Typography;

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onOk?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "Success",
  message = "Operation completed successfully!",
  onOk,
}: SuccessModalProps) {
  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={400}
      className="success-modal"
      styles={{
        body: { padding: 0 },
        content: { borderRadius: "12px" },
      }}
    >
      <div className="relative rounded-sm bg-white text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
              <CheckOutlined className="!text-2xl !text-white" />
            </div>
          </div>
        </div>

        <Title
          level={4}
          className="font-bold text-gray-900 uppercase dark:text-white"
        >
          {title}
        </Title>

        <p className="mb-8 text-base leading-relaxed text-gray-600">{message}</p>

        <Button
          onClick={handleOk}
          className="!border-none !bg-green-500 !px-6 !font-medium !text-white !transition-colors !duration-200 hover:!bg-green-600"
        >
          OK
        </Button>
      </div>
    </Modal>
  );
}
