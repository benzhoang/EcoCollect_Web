import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getAreas, createArea } from "../../../service/api";

/**
 * Chuyển cây khu vực thành danh sách phẳng, mỗi node có name = path đầy đủ (TP.HCM, TP.HCM - Quan 1, ...).
 */
const buildAllAreaOptions = (nodes, parentName = "") => {
  if (!nodes) return [];
  const result = [];
  (Array.isArray(nodes) ? nodes : [nodes]).forEach((node) => {
    if (!node) return;
    const currentName = parentName ? `${parentName} - ${node.name}` : node.name;
    result.push({ id: node.id, name: currentName });
    if (
      Array.isArray(node.children) &&
      node.children.length > 0 &&
      typeof node.children[0] === "object"
    ) {
      result.push(...buildAllAreaOptions(node.children, currentName));
    }
  });
  return result;
};

const CreateAreaModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    parentId: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const raw = await getAreas();
        const data = raw?.data ?? raw;
        const roots = Array.isArray(data) ? data : data ? [data] : [];
        setAreaOptions(buildAllAreaOptions(roots));
      } catch (err) {
        console.error(err);
        setAreaOptions([]);
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parentId = formData.parentId.trim();
    const name = formData.name.trim();
    if (!name) {
      toast.error("Vui lòng nhập tên khu vực.");
      return;
    }
    setError("");
    setSubmitting(true);
    const body = { name };
    if (parentId) body.parentId = parentId;
    console.log("[CreateAreaModal] submit body:", body);
    try {
      const data = await createArea(body);
      console.log("[CreateAreaModal] createArea success:", data);
      toast.success("Tạo khu vực thành công");
      onSuccess?.(data);
      setFormData({ parentId: "", name: "" });
      onClose?.();
    } catch (err) {
      console.error("[CreateAreaModal] createArea error:", err);
      const message =
        err?.message ?? "Đã xảy ra lỗi khi tạo khu vực. Vui lòng thử lại.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setFormData({ parentId: "", name: "" });
    setError("");
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-white shadow-xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Thêm khu vực</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
            type="button"
            disabled={submitting}
          >
            <span className="sr-only">Đóng</span>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Khu vực cha
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                disabled={loadingAreas}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">— Không chọn (tạo cấp gốc) —</option>
                {areaOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              {loadingAreas && (
                <p className="mt-1 text-xs text-gray-500">
                  Đang tải danh sách khu vực...
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tên khu vực <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên khu vực"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAreaModal;
