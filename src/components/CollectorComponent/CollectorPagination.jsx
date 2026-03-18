import React, { useMemo } from "react";

/**
 * Danh sách nút trang + ellipsis — cùng logic CabinCrew Pagination.jsx
 * @param {number} totalPages
 * @param {number} currentPage — 1-based
 */
const getVisiblePageItems = (totalPages, currentPage) => {
  const tp = Math.max(1, totalPages);
  const cp = Math.min(Math.max(1, currentPage), tp);

  if (tp <= 7) {
    return Array.from({ length: tp }, (_, i) => ({
      type: "page",
      page: i + 1,
    }));
  }

  const items = [];
  const pushPage = (p) => items.push({ type: "page", page: p });
  const pushEllipsis = () => {
    if (items.length && items[items.length - 1].type === "ellipsis") return;
    items.push({ type: "ellipsis", key: `e-${items.length}` });
  };

  if (cp === 1) {
    for (let i = 1; i <= 4 && i <= tp; i++) pushPage(i);
    if (tp > 4) {
      pushEllipsis();
      pushPage(tp);
    }
    return items;
  }

  if (cp >= 2 && cp <= 3) {
    for (let i = 1; i <= 4 && i <= tp; i++) pushPage(i);
    if (tp > 4) {
      pushEllipsis();
      pushPage(tp);
    }
    return items;
  }

  const isNearEnd = cp >= tp - 2 && cp > 1;
  if (isNearEnd) {
    if (tp > 4) {
      pushPage(1);
      pushEllipsis();
    }
    const start = Math.max(1, tp - 3);
    for (let i = start; i <= tp; i++) pushPage(i);
    return items;
  }

  pushPage(1);
  pushEllipsis();
  pushPage(cp - 1);
  pushPage(cp);
  pushPage(cp + 1);
  if (cp < tp - 2) {
    pushEllipsis();
    pushPage(tp);
  }
  return items;
};

/**
 * @param {Object} props
 * @param {{ page: number, size: number, totalElements: number, totalPages: number }} props.pageInfo
 * @param {number} props.currentPage - Trang hiện tại (1-based)
 * @param {(page: number) => void} props.onPageChange
 * @param {number} props.itemCount - Số item trên trang hiện tại (vd: reports.length)
 * @param {string} [props.itemLabel='yêu cầu'] - Nhãn cho loại item (vd: "yêu cầu", "báo cáo")
 */
const CollectorPagination = ({
  pageInfo,
  currentPage,
  onPageChange,
  itemCount,
  itemLabel = "yêu cầu",
}) => {
  const totalPages = Math.max(1, pageInfo?.totalPages ?? 1);
  const totalElements = pageInfo?.totalElements ?? 0;
  const page = pageInfo?.page ?? 0;
  const size = pageInfo?.size ?? 20;

  const start = totalElements > 0 ? page * size + 1 : 0;
  const end = totalElements > 0 ? page * size + itemCount : 0;

  const pageItems = useMemo(
    () => getVisiblePageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const btnBase =
    "px-3 py-1 rounded-lg text-sm font-medium transition-colors min-w-[2.25rem]";
  const btnActive = "bg-green-600 text-white";
  const btnIdle = "text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="text-sm text-gray-600 shrink-0">
        {totalElements > 0 ? (
          <>
            Hiển thị {start}-{end} của {totalElements} {itemLabel}
          </>
        ) : (
          `Không có ${itemLabel} nào`
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {pageItems.map((item, idx) =>
          item.type === "ellipsis" ? (
            <span
              key={item.key ?? `ellipsis-${idx}`}
              className="px-2 py-1 text-sm font-medium text-gray-400 select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item.page}
              type="button"
              onClick={() => onPageChange(item.page)}
              className={`${btnBase} ${
                currentPage === item.page ? btnActive : btnIdle
              }`}
            >
              {item.page}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages < 2}
          className="p-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CollectorPagination;
