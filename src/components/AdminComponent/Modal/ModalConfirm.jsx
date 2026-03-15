import { FaTimes } from "react-icons/fa";

const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa?",
  confirmText = "Xóa",
  isLoading = false,
}) => {
  if (!isOpen) return null;

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
            className="px-12 py-2.5 font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
