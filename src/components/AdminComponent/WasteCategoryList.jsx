import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateWasteCategoryModal from "./Modal/UpdateWasteCategoryModal";

const WasteCategoryList = () => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Dữ liệu mẫu
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Rác hữu cơ",
      description: "Rác thải hữu cơ dễ phân hủy: thức ăn thừa, rau củ...",
    },
    {
      id: 2,
      name: "Rác tái chế",
      description: "Giấy, nhựa, kim loại, thủy tinh có thể tái chế",
    },
    {
      id: 3,
      name: "Rác vô cơ",
      description: "Rác thải khó phân hủy: nilon, cao su, sành sứ",
    },
    {
      id: 4,
      name: "Rác nguy hại",
      description: "Pin, ắc quy, hóa chất, thiết bị điện tử",
    },
    {
      id: 5,
      name: "Rác xây dựng",
      description: "Gạch, đá, bê tông, gỗ thải từ công trình",
    },
  ]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalUpdateOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsModalDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setIsModalDeleteOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleUpdateSuccess = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
    );
    setIsModalUpdateOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  STT
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  TÊN LOẠI RÁC
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  MÔ TẢ
                </th>
                <th className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {category.description}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-yellow-50 shrink-0"
                        title="Sửa"
                      >
                        <FaEdit className="text-sm text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="flex items-center justify-center transition-colors border border-gray-300 rounded-lg w-9 h-9 hover:bg-red-50 shrink-0"
                        title="Xóa"
                      >
                        <FaTrash className="text-sm text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận xóa danh mục */}
      {isModalDeleteOpen && selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsModalDeleteOpen(false);
            setSelectedCategory(null);
          }}
        >
          <div
            className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-gray-700">
                Bạn có chắc muốn xóa danh mục &quot;{selectedCategory.name}
                &quot;?
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4">
              <button
                onClick={() => {
                  setIsModalDeleteOpen(false);
                  setSelectedCategory(null);
                }}
                type="button"
                className="px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                type="button"
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <UpdateWasteCategoryModal
        isOpen={isModalUpdateOpen}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default WasteCategoryList;
