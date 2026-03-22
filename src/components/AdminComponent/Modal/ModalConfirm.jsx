import { FaTimes } from "react-icons/fa";

const confirmButtonVariants = {
  danger: "bg-red-600 hover:bg-red-700",
  success: "bg-green-600 hover:bg-green-700",
};

const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa?",
  confirmText = "Xóa",
  isLoading = false,
  /** danger: đỏ (mặc định). success: xanh lá — vd. kích hoạt / bật lại */
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const confirmBtnClass =
    confirmButtonVariants[variant] ?? confirmButtonVariants.danger;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-8 mx-4 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <FaTimes className="text-2xl" />
        </button>

        <h2 className="mb-6 text-xl font-medium text-center text-gray-700">
          {title}
        </h2>

        <div className="mb-6">
          <p className="text-center text-gray-700">{message}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
            className={`px-12 py-2.5 font-medium text-white transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${confirmBtnClass}`}
          >
            {isLoading ? "Đang xác nhận..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
