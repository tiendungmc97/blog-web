"use client";

import React from "react";
import { RefreshCw, AlertCircle, Gift, Info, Bell as NotificationIcon } from "lucide-react";
import { useRouter } from "@/libs/i18n/navigation";
import { ROUTERS } from "@/constants/routers";
import { Notifications } from "@/app/[locale]/(user)/notifications/_services/notifications-service";
import { LoadingSpinner } from "@/components/ui/feedback/loading-spinner";
import { dateHelpers, DATE_FORMATS } from "@/utils/dayjs";
import { useTranslations } from "next-intl";

// Map notiType to display type and icon - same as dax-fsilver-web
const getNotificationType = (notiType: any): "transaction" | "account" | "system" | "promotion" => {
  return notiType;
};

// Get display name for notification type
const getNotificationTypeName = (
  type: "transaction" | "account" | "system" | "promotion",
  t: (key: string) => string,
): string => {
  switch (type) {
    case "transaction":
      return t("transaction");
    case "account":
      return t("accountAlert");
    case "system":
      return t("notification");
    case "promotion":
      return t("promotion");
    default:
      return t("notification");
  }
};

// Get icon for notification type
const getNotificationIcon = (type: "transaction" | "account" | "system" | "promotion") => {
  switch (type) {
    case "transaction":
      return <RefreshCw className="h-5 w-5" />;
    case "account":
      return <AlertCircle className="h-5 w-5" />;
    case "system":
      return <NotificationIcon className="h-5 w-5" />;
    case "promotion":
      return <Gift className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return dateHelpers.formatDisplay(dateString, DATE_FORMATS.DISPLAY_DATE);
};

const formatTime = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return dateHelpers.formatDisplay(dateString, DATE_FORMATS.DISPLAY_TIME);
};

// Categorize notifications by type
const categorizeNotifications = (notifications: NotificationItem[]) => {
  const categories: Record<"transaction" | "account" | "system" | "promotion", NotificationItem[]> = {
    transaction: [],
    account: [],
    system: [],
    promotion: [],
  };

  notifications.forEach((notification) => {
    categories[notification.notiType].push(notification);
  });

  return categories;
};

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationDropdownEnter: () => void;
  onNotificationDropdownLeave: () => void;
  notificationDropdownRef: React.RefObject<HTMLDivElement | null>;
  notifications?: { data: Notifications[] };
  isLoading?: boolean;
}

interface NotificationItem {
  id: string;
  notiType: "transaction" | "account" | "system" | "promotion";
  title: string;
  body: string;
  sentDate: string;
  formattedDate: string;
  formattedTime: string;
  createDate?: string;
  isRead: boolean;
}

export function NotificationDropdown({
  isOpen,
  onClose,
  onNotificationDropdownEnter,
  onNotificationDropdownLeave,
  notificationDropdownRef,
  notifications: apiNotifications,
  isLoading,
}: NotificationDropdownProps) {
  const tRaw = useTranslations("Header.notificationDropdown" as any);
  const t = tRaw as unknown as (key: string) => string;
  const router = useRouter();

  if (!isOpen) return null;

  const notifications: NotificationItem[] =
    apiNotifications?.data?.map((notif) => {
      const dateField = notif.createDate || notif.sentDate || "";
      const mappedType = getNotificationType(notif.notiType);
      return {
        id: notif.id.toString(),
        notiType: mappedType,
        title: notif.title,
        body: notif.body,
        sentDate: dateField,
        formattedDate: formatDate(dateField),
        formattedTime: formatTime(dateField),
        createDate: dateField,
        isRead: notif.isRead,
      };
    }) || [];

  // Debug: Check data flow
  if (process.env.NODE_ENV === "development") {
    console.log("NotificationDropdown Debug:", {
      apiNotificationsData: apiNotifications?.data,
      rawNotifications: apiNotifications?.data?.map((n: any) => ({ id: n.id, notiType: n.notiType, title: n.title })),
      mappedNotifications: notifications.map((n) => ({ id: n.id, notiType: n.notiType, title: n.title })),
    });
  }

  const categorizedNotifications = categorizeNotifications(notifications);

  // Debug: Check categorized
  if (process.env.NODE_ENV === "development") {
    console.log("Categorized Notifications:", {
      transaction: categorizedNotifications.transaction.length,
      account: categorizedNotifications.account.length,
      system: categorizedNotifications.system.length,
      promotion: categorizedNotifications.promotion.length,
      transactionItems: categorizedNotifications.transaction.map((n) => ({ id: n.id, title: n.title })),
    });
  }

  const handleSeeAll = () => {
    router.push(ROUTERS.NOTIFICATION.INDEX);
    onClose();
  };

  return (
    <div
      className="absolute top-16 right-0 z-50 w-full rounded-sm bg-white shadow-lg md:w-80"
      ref={notificationDropdownRef}
      onMouseEnter={onNotificationDropdownEnter}
      onMouseLeave={onNotificationDropdownLeave}
    >
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <section className="mt-6 flex min-h-[40px] items-center justify-center rounded-xl">
            <LoadingSpinner text={t("loading")} />
          </section>
        ) : (
          <div className="space-y-2 p-3">
            {(["system", "promotion", "transaction", "account"] as const).map((type) => {
              const typeNotifications = categorizedNotifications[type];
              const typeName = getNotificationTypeName(type, t);
              const typeIcon = getNotificationIcon(type);
              const latestNotification =
                typeNotifications.length > 0
                  ? [...typeNotifications].sort((a, b) => {
                      const dateA = a.createDate ? new Date(a.createDate).getTime() : 0;
                      const dateB = b.createDate ? new Date(b.createDate).getTime() : 0;
                      return dateB - dateA;
                    })[0]
                  : undefined;

              // Always show all 4 types, even if empty (matching dax-fsilver-web behavior)
              return (
                <div
                  key={type}
                  className="hover:bg-bgHover rounded-lg bg-white p-3 transition-all"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => {
                      // Route to specific notification type page
                      const routeMap = {
                        system: ROUTERS.NOTIFICATION.SYSTEM,
                        promotion: ROUTERS.NOTIFICATION.PROMOTION,
                        transaction: ROUTERS.NOTIFICATION.TRANSACTION,
                        account: ROUTERS.NOTIFICATION.ACCOUNT_ALERT,
                      };
                      router.push(routeMap[type] || ROUTERS.NOTIFICATION.INDEX);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{typeIcon}</div>
                      <div className="flex max-w-[150px] flex-col">
                        <h3 className="text-textBase text-sm font-semibold">{typeName}</h3>
                        {typeNotifications.length > 0 && latestNotification ? (
                          <p className="text-textSecondary truncate text-xs">{latestNotification.title}</p>
                        ) : (
                          <p className="text-textTertiary text-xs">{t("noNotificationsYet")}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      {typeNotifications.length > 0 && latestNotification && (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end gap-0.5 text-right">
                            <span className="text-textTertiary text-xs">{latestNotification.formattedDate}</span>
                            <span className="text-textTertiary text-xs">{latestNotification.formattedTime}</span>
                          </div>
                          {!latestNotification.isRead && <span className="bg-primary h-2 w-2 rounded-full"></span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-borderSecondary border-t p-3">
          <button
            onClick={handleSeeAll}
            className="bg-primaryBg text-primary hover:bg-primaryBgHover w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {t("viewAll")}
          </button>
        </div>
      )}
    </div>
  );
}
