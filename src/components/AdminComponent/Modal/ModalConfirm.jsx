import React from 'react'
import { FaTimes } from 'react-icons/fa'

const ModalConfirm = ({ isOpen, onClose, onConfirm, accountEmail }) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm?.()
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute text-gray-500 transition-colors top-6 right-6 hover:text-gray-700"
          type="button"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Xác nhận xóa
          </h2>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-gray-700">
            Bạn có muốn xóa tài khoản {accountEmail}?
          </p>
        </div>

        {/* Footer - Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm
