"use client";

import * as React from "react";

type Keyish = string | number;

export type CommonCardField<T> = {
  key: React.Key;
  label: React.ReactNode;
  render: (record: T) => React.ReactNode;
};

export interface CommonCardListProps<T> {
  data: T[];
  fields: CommonCardField<T>[];
  rowKey?: keyof T | ((record: T) => Keyish);
  /** Hiển thị khi rỗng */
  empty?: React.ReactNode;
  className?: string;
}

export function CommonCardList<T>({
  data,
  fields,
  rowKey,
  empty = <div className="rounded-xl border py-8 text-center text-sm text-neutral-500">Không có dữ liệu</div>,
  className = "",
}: CommonCardListProps<T>) {
  const getKey = React.useCallback(
    (r: T, idx: number): Keyish => {
      if (typeof rowKey === "function") return rowKey(r);
      if (typeof rowKey === "string") return (r as any)?.[rowKey] ?? idx;
      return idx;
    },
    [rowKey],
  );

  if (!data || data.length === 0) return <>{empty}</>;

  return (
    <ul className={["space-y-3", className].join(" ")}>
      {data.map((r, i) => (
        <li
          key={String(getKey(r, i))}
          className="rounded-xl border px-4 py-3"
        >
          {fields.map((f) => (
            <div
              key={String(f.key)}
              className="mt-2 flex items-center justify-between first:mt-0"
            >
              <span className="text-xs font-medium text-neutral-500 uppercase">{f.label}</span>
              <span className="text-sm font-semibold">
                {(() => {
                  const out = f.render(r);
                  if (out === null || out === undefined || (typeof out === "string" && out.trim() === "")) return "-";
                  return out;
                })()}
              </span>
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
