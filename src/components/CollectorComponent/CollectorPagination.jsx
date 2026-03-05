import React from 'react';

/**
 * @param {Object} props
 * @param {{ page: number, size: number, totalElements: number, totalPages: number }} props.pageInfo
 * @param {number} props.currentPage - Trang hiện tại (1-based)
 * @param {(page: number) => void} props.onPageChange
 * @param {number} props.itemCount - Số item trên trang hiện tại (vd: reports.length)
 * @param {string} [props.itemLabel='yêu cầu'] - Nhãn cho loại item (vd: "yêu cầu", "báo cáo")
 * @param {string} [props.emptyMessage] - Khi totalElements === 0, hiển thị message này bên trái thay cho "Không có {itemLabel} nào"
 */
const CollectorPagination = ({
    pageInfo,
    currentPage,
    onPageChange,
    itemCount,
    itemLabel = 'yêu cầu',
    emptyMessage,
}) => {
    const totalPages = pageInfo?.totalPages ?? 1;
    const totalElements = pageInfo?.totalElements ?? 0;
    const page = pageInfo?.page ?? 0;
    const size = pageInfo?.size ?? 20;

    const start = totalElements > 0 ? page * size + 1 : 0;
    const end = totalElements > 0 ? page * size + itemCount : 0;

    return (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
                {totalElements > 0 ? (
                    <>
                        Hiển thị {start}
                        -
                        {end} của {totalElements} {itemLabel}
                    </>
                ) : (
                    emptyMessage ?? `Không có ${itemLabel} nào`
                )}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === index + 1
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CollectorPagination;
