import { Tag } from "antd";
import { useTranslations } from "next-intl";

export enum Status {
  RETIRED = "retired",
  PAUSED = "paused",
  ACTIVE = "active",
  PENDING = "pending",
  DRAFT = "draft",
  COMPLETED = "completed",
  OPEN = "open",
}

export const StatusDisplay: React.FC<{ status: Status }> = ({ status }) => {
  const t = useTranslations("Status");

  const statusMap: Record<Status, { color: string }> = {
    [Status.ACTIVE]: { color: "blue" },
    [Status.RETIRED]: { color: "red" },
    [Status.PENDING]: { color: "orange" },
    [Status.PAUSED]: { color: "gray" },
    [Status.DRAFT]: { color: "blue" },
    [Status.COMPLETED]: { color: "green" },
    [Status.OPEN]: { color: "green" },
  };

  const { color } = statusMap[status] || {
    color: "gray",
  };

  if (!status) {
    return <></>;
  }

  return (
    <Tag
      color={color}
      bordered={false}
    >
      {t(status)}
    </Tag>
  );
};
