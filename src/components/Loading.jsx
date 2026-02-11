import React from "react";

const Loading = ({ text = "Đang xử lý...", subtext = "Vui lòng đợi trong giây lát" }) => {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Đang tải"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

            {/* Card */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/90 shadow-2xl ring-1 ring-black/5">
                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                            <svg
                                className="h-6 w-6 animate-spin text-emerald-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="text-base font-semibold text-slate-900">{text}</div>
                            <div className="mt-1 text-sm text-slate-600">{subtext}</div>

                            {/* Progress (indeterminate) */}
                            <div className="mt-4" aria-hidden="true">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div className="loading-bar h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                                </div>
                            </div>

                            <div className="sr-only" role="status" aria-live="polite">
                                Đang xử lý, vui lòng chờ.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Local CSS for indeterminate bar (no Tailwind config required) */}
                <style>{`
          @keyframes loadingBarMove {
            0% { transform: translateX(-120%); }
            50% { transform: translateX(60%); }
            100% { transform: translateX(220%); }
          }
          .loading-bar {
            animation: loadingBarMove 1.2s ease-in-out infinite;
          }
        `}</style>
            </div>
        </div>
    );
};

export default Loading;