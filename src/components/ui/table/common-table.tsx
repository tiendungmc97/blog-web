"use client";

import { useDeviceDetection } from "@/hooks/use-device-detection";
import { Table, Card, type TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface IPagination {
  pageSize: number;
  current: number;
  total?: number;
}

export const INIT_PAGINATION: IPagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

interface CommonTableProps<RecordType> extends TableProps<RecordType> {
  paginationData?: IPagination & {
    onChange: (current: number, pageSize: number) => void;
  };
  mobileBreakpoint?: number;
  cardRender?: (record: RecordType, index: number) => React.ReactNode;
}

export const CommonTable = function <T>({
  paginationData,
  mobileBreakpoint = 768,
  cardRender,
  ...rest
}: CommonTableProps<T>) {
  const { isMobile } = useDeviceDetection();

  const getPagination = (): TableProps<T>["pagination"] => {
    if (!paginationData || (paginationData.total ?? 0) <= INIT_PAGINATION.pageSize) return false;
    return {
      pageSize: paginationData.pageSize,
      current: paginationData.current,
      total: paginationData.total,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30"],
      onChange: paginationData.onChange,
    };
  };

  const defaultCardRender = (record: T, index: number) => {
    const columns = rest.columns as ColumnsType<T>;
    if (!columns) return null;

    return (
      <Card
        key={rest.rowKey || ((record as any)?.id ?? (record as any)?.key ?? index)}
        className="!border-border !mb-4 !border"
        size="small"
      >
        <div className="space-y-2">
          {columns.map((col: any, colIndex: number) => {
            const column = col as any;
            if (!column.dataIndex && !column.render) return null;

            let value: React.ReactNode;
            const label = column.title as string;

            if (column.render) {
              value = column.render(
                column.dataIndex ? (record as any)[column.dataIndex as string] : record,
                record,
                index,
              );
            } else if (column.dataIndex) {
              value = (record as any)[column.dataIndex as string];
            }

            if (value === null || value === undefined || value === "") return null;

            return (
              <div
                key={colIndex}
                className="flex items-start justify-between"
              >
                <span className="mr-3 flex-shrink-0 text-sm font-medium text-gray-600">{label}:</span>
                <div className="flex-1 text-right text-sm">{value}</div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  if (isMobile) {
    const renderFunction = cardRender || defaultCardRender;
    const dataSource = rest.dataSource || [];

    return (
      <div className="space-y-4">
        {dataSource.map((record, index) => renderFunction(record, index))}
        {paginationData && typeof paginationData !== "boolean" && (
          <div className="mt-6 flex justify-center">
            <div className="ant-pagination">{/* Pagination will be handled by parent component */}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Table
      {...rest}
      pagination={getPagination()}
      rowKey={rest.rowKey || ((record) => (record as any)?.id || (record as any)?.key)}
    />
  );
};
