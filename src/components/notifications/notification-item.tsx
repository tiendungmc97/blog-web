"use client";

import React, { useState, useEffect } from "react";
import { Pagination, Drawer } from "antd";
import { useMarkNotificationAsRead } from "@/app/[locale]/(user)/notifications/_hooks/use-notifications";
import { useTranslations } from "next-intl";
import { useDeviceDetection } from "@/hooks/use-device-detection";
import { X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  date?: string; // Date in DD/MM/YYYY format
  isRead: boolean;
  notiType?: string;
  notiData?: string; // JSON string
  readAt?: string;
  sentDate?: string;
}

interface NotificationItemProps {
  notification: NotificationItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationItemComponent({
  notification,
  isSelected = false,
  onSelect,
  onMarkAsRead,
}: NotificationItemProps) {
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleClick = () => {
    onSelect?.(notification.id);

    // Mark as read when selected
    if (!notification.isRead) {
      markAsReadMutation.mutate(parseInt(notification.id));
      onMarkAsRead?.(notification.id);
    }
  };

  return (
    <div
      className={`cursor-pointer transition-all hover:shadow-sm ${
        isSelected ? "border-primary bg-primaryBg shadow-sm" : "hover:bg-gray-50"
      } lg:!border-border !rounded-none !border-none lg:!rounded-sm lg:!border`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between px-4 py-4 lg:p-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {!notification.isRead && <div className="bg-primary mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" />}
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                isSelected ? "text-primary" : !notification.isRead ? "text-textBase" : "text-textSecondary"
              }`}
            >
              {notification.title}
            </p>
            {notification.date && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-textSecondary text-xs font-medium">{notification.date}</span>
                <span className="text-textTertiary text-xs">•</span>
                <span className="text-textTertiary text-xs">{notification.time}</span>
              </div>
            )}
            {!notification.date && <span className="text-textTertiary mt-1 block text-xs">{notification.time}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationListProps {
  notifications: NotificationItem[];
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationList({
  notifications,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onMarkAsRead,
}: NotificationListProps) {
  const t = useTranslations("Notifications");
  const { isMobile } = useDeviceDetection();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const selectedNotification = notifications.find((n) => n.id === selectedId) || notifications[0] || null;

  // Auto-select first notification if none selected (desktop only)
  useEffect(() => {
    const firstNotification = notifications[0];
    if (!isMobile && !selectedId && firstNotification) {
      setSelectedId(firstNotification.id);
    }
  }, [notifications, selectedId, isMobile]);

  const handleNotificationClick = (id: string) => {
    setSelectedId(id);
    if (isMobile) {
      setIsDetailDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsDetailDrawerOpen(false);
  };

  const detailContent = selectedNotification ? (
    <div className="flex h-full flex-col">
      <div className="border-border border-b bg-gray-50 px-4 py-4 lg:px-6">
        <h3 className="text-textBase text-lg font-semibold">{selectedNotification.title}</h3>
        {selectedNotification.date && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-textSecondary text-sm font-medium">{selectedNotification.date}</span>
            <span className="text-textTertiary text-sm">•</span>
            <span className="text-textTertiary text-sm">{selectedNotification.time}</span>
          </div>
        )}
        {!selectedNotification.date && (
          <span className="text-textTertiary mt-2 block text-sm">{selectedNotification.time}</span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        <div>
          <p className="text-textSecondary mb-2 text-sm font-medium">{t("message")}</p>
          <p className="text-textSecondary leading-relaxed whitespace-pre-wrap">{selectedNotification.message}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <p className="text-textTertiary text-sm">{t("selectNotification")}</p>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="grid min-h-[400px] grid-cols-1 gap-4 lg:h-[400px] lg:grid-cols-2">
        {/* Left Column: Notification List */}
        <div className="flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {notifications.map((notification) => (
              <NotificationItemComponent
                key={notification.id}
                notification={notification}
                isSelected={selectedId === notification.id}
                onSelect={handleNotificationClick}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Notification Details Preview (Desktop only) */}
        <div className="hidden lg:block">
          <div className="border-border flex h-full flex-col rounded-sm border bg-white">{detailContent}</div>
        </div>
      </div>

      {/* Mobile: Detail Drawer */}
      {isMobile && (
        <Drawer
          open={isDetailDrawerOpen}
          onClose={handleCloseDrawer}
          placement="bottom"
          height="90vh"
          closable={false}
          title={
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedNotification?.title || t("title")}</h2>
              <button
                onClick={handleCloseDrawer}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          }
          className="notification-detail-drawer"
        >
          <div className="pb-4">{detailContent}</div>
        </Drawer>
      )}

      {/* Pagination - Below both columns */}
      {total > pageSize && (
        <div className="mt-4 bg-white pt-4">
          <div className="flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              size="small"
              onChange={onPageChange}
              showTotal={(total, range) => {
                const range0 = range[0];
                const range1 = range[1];
                return t("paginationTotal", { range0, range1, total });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
