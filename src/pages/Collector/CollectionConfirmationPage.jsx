import React, { useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import UploadProofModal from "../../components/CollectorComponent/UploadProofModal";

/** Lấy assignmentId từ history state (khi chuyển từ RequestDetailPage) */
const getAssignmentId = () => {
  const state = window.history.state;
  return state?.assignmentId ?? null;
};

const CollectionConfirmationPage = () => {
  const assignmentId = useMemo(() => getAssignmentId(), []);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <header className="flex items-center justify-between w-full px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-gray-900"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <div className="ml-5">
            <h1 className="text-2xl font-bold text-black">
              Xác nhận hoàn tất thu gom
            </h1>
            <p className="text-sm text-gray-600">
              Collector uploads proof after COLLECTED — Gửi bằng chứng thu gom
            </p>
          </div>
        </div>
      </header>

      <UploadProofModal
        show={true}
        onClose={handleBack}
        assignmentId={assignmentId}
      />
    </div>
  );
};

export default CollectionConfirmationPage;
