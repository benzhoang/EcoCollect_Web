// Sử dụng proxy trong development để tránh lỗi CORS
// Trong development: sử dụng relative path (sẽ được proxy bởi Vite)
// Trong production: sử dụng full URL
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : "https://swpbe-production-b987.up.railway.app";

import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: gắn token vào mọi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Chuyển đổi tên trường sang tiếng Việt
 * @param {string} field - Tên trường tiếng Anh
 * @returns {string} Tên trường tiếng Việt
 */
const getFieldNameInVietnamese = (field) => {
  const fieldMap = {
    email: "Email",
    phone: "Số điện thoại",
    password: "Mật khẩu",
    fullName: "Họ và tên",
    areaId: "Khu vực",
    username: "Tên người dùng",
  };
  return fieldMap[field] || field;
};

/**
 * Chuyển đổi message lỗi sang tiếng Việt
 * @param {string} message - Message lỗi
 * @returns {string} Message lỗi tiếng Việt
 */
const translateErrorMessage = (message) => {
  if (!message) return "Đăng ký thất bại. Vui lòng thử lại.";

  const lowerMessage = message.toLowerCase();

  // Các message lỗi phổ biến
  const errorTranslations = {
    "validation failed": "Thông tin không hợp lệ",
    "email already exists": "Email đã được sử dụng",
    "phone already exists": "Số điện thoại đã được sử dụng",
    "email or phone is required": "Vui lòng nhập email hoặc số điện thoại",
    "email is required": "Vui lòng nhập email",
    "phone is required": "Vui lòng nhập số điện thoại",
    "password is required": "Vui lòng nhập mật khẩu",
    "fullname is required": "Vui lòng nhập họ và tên",
    "areaid is required": "Vui lòng nhập khu vực",
    "invalid email": "Email không hợp lệ",
    "invalid phone": "Số điện thoại không hợp lệ",
    "password too short": "Mật khẩu quá ngắn",
    "password must be at least": "Mật khẩu phải có ít nhất",
    "email must be an email": "Email không đúng định dạng",
    "phone must be a phone number": "Số điện thoại không đúng định dạng",
    "areaid must be a uuid": "ID khu vực không hợp lệ",
    "user already exists": "Người dùng đã tồn tại",
    "internal server error": "Lỗi hệ thống. Vui lòng thử lại sau.",
    "bad request": "Yêu cầu không hợp lệ",
    unauthorized: "Không có quyền truy cập",
    forbidden: "Bị cấm truy cập",
    "not found": "Không tìm thấy",
    conflict: "Dữ liệu đã tồn tại",
  };

  // Tìm translation phù hợp
  for (const [key, translation] of Object.entries(errorTranslations)) {
    if (lowerMessage.includes(key)) {
      return translation;
    }
  }

  // Nếu không tìm thấy translation, trả về message gốc hoặc message mặc định
  // Nếu message là tiếng Anh và không có trong danh sách, thêm prefix
  if (/^[a-zA-Z\s]+$/.test(message) && message.length < 100) {
    return message; // Giữ nguyên nếu là tiếng Anh ngắn
  }

  return message || "Đăng ký thất bại. Vui lòng thử lại.";
};

/**
 * Xử lý lỗi từ axios (network hoặc response)
 * @param {Error} error - Lỗi từ axios
 * @param {string} defaultMessage - Message mặc định
 * @returns {never}
 */
const handleApiError = (error, defaultMessage) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;
      let message = defaultMessage;
      if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
      else if (error.response.statusText) message = error.response.statusText;
      throw new Error(message);
    }
    // Xử lý các lỗi network và CORS
    if (
      error.code === "ERR_NETWORK" ||
      error.message?.includes("Network Error")
    ) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên.",
      );
    }
  }
  if (error.message) throw error;
  throw new Error(defaultMessage);
};

/**
 * Gọi API login
 * @param {string} identifier - Email hoặc username
 * @param {string} password - Mật khẩu
 * @returns {Promise} Response từ API
 */
export const login = async (identifier, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      identifier,
      password,
    });
    return data;
  } catch (error) {
    handleApiError(error, "Đăng nhập thất bại");
  }
};

/**
 * Lưu token vào localStorage
 * @param {Object} tokens - Object chứa accessToken, refreshToken, tokenType, expiresInSeconds
 */
export const saveTokens = (tokens) => {
  if (tokens.accessToken) {
    localStorage.setItem("accessToken", tokens.accessToken);
  }
  if (tokens.refreshToken) {
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }
  if (tokens.tokenType) {
    localStorage.setItem("tokenType", tokens.tokenType);
  }
  if (tokens.expiresInSeconds) {
    localStorage.setItem("expiresInSeconds", tokens.expiresInSeconds);
  }
};

/**
 * Lưu thông tin user vào localStorage
 * @param {Object} user - Object chứa thông tin user
 */
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} Access token
 */
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

/**
 * Gọi API đăng ký
 * @param {Object} userData - Object chứa email, phone, password, fullName, areaId
 * @returns {Promise} Response từ API
 */
export const register = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const res = error.response;
      const errorData = res.data;
      let errorMessage = "Đăng ký thất bại";

      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (Array.isArray(errorData?.errors)) {
        const errorMessages = errorData.errors.map((err) => {
          if (typeof err === "string") return err;
          return err.message || err.msg || JSON.stringify(err);
        });
        errorMessage = errorMessages.join(". ");
      } else if (errorData?.validationErrors) {
        const validationMessages = Object.entries(
          errorData.validationErrors,
        ).map(([field, message]) => {
          const fieldName = getFieldNameInVietnamese(field);
          return `${fieldName}: ${message}`;
        });
        errorMessage = validationMessages.join(". ");
      } else if (res.statusText) {
        errorMessage = res.statusText;
      }

      errorMessage = translateErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
    // Xử lý các lỗi network và CORS
    if (
      error.code === "ERR_NETWORK" ||
      error.message?.includes("Network Error")
    ) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên.",
      );
    }
    if (error.message) throw error;
    throw new Error("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
  }
};

/**
 * Xóa token và user khỏi localStorage
 */
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("expiresInSeconds");
  localStorage.removeItem("user");
};

/**
 * Lấy bảng xếp hạng theo khu vực
 * @param {string} areaId - ID của khu vực
 * @param {number} days - Số ngày (mặc định: 30)
 * @param {number} limit - Giới hạn số lượng (mặc định: 50)
 * @returns {Promise} Response từ API
 */
export const getLeaderboardByArea = async (areaId, days = 30, limit = 50) => {
  try {
    const params = {};
    if (days !== undefined && days !== null) params.days = days;
    if (limit !== undefined && limit !== null) params.limit = limit;

    const { data } = await api.get(`/areas/${areaId}/leaderboard`, { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy bảng xếp hạng. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy cây khu vực TP.HCM (dùng cho dropdown chọn địa chỉ)
 * @returns {Promise} Response từ API
 */
export const getAreaTree = async () => {
  try {
    const { data } = await api.get("/areas/tree");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách khu vực. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách khu vực đang hoạt động (List active areas)
 * @returns {Promise} Response từ API (200 OK)
 */
export const getAreas = async () => {
  try {
    const { data } = await api.get("/areas");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách khu vực. Vui lòng thử lại.",
    );
  }
};

/**
 * Tạo khu vực mới (Create area) - Admin
 * @param {Object} body - Request body
 * @param {string} body.parentId - ID khu vực cha
 * @param {string} body.name - Tên khu vực
 * @returns {Promise} Response từ API
 */
export const createArea = async (body) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Vui lòng đăng nhập để tạo khu vực.");
    }
    const { data } = await api.post("/admin/areas", body);
    return data;
  } catch (error) {
    handleApiError(error, "Đã xảy ra lỗi khi tạo khu vực. Vui lòng thử lại.");
  }
};

/**
 * Cập nhật khu vực (Admin) - Update area
 * PUT /admin/areas/{id}
 * @param {string} id - UUID khu vực (path parameter, bắt buộc)
 * @param {Object} body - Request body
 * @param {string} [body.parentId] - ID khu vực cha
 * @param {string} [body.name] - Tên khu vực
 * @returns {Promise} Response từ API
 */
export const updateArea = async (id, body) => {
  try {
    const { data } = await api.put(`/admin/areas/${id}`, body);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật khu vực. Vui lòng thử lại.",
    );
  }
};

/**
 * Vô hiệu hóa khu vực (Admin) - Deactivate area
 * PATCH /admin/areas/{id}/deactivate
 * @param {string} id - UUID khu vực (path parameter, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const deactivateArea = async (id) => {
  try {
    const { data } = await api.patch(`/admin/areas/${id}/deactivate`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi vô hiệu hóa khu vực. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách danh mục loại rác (List waste categories)
 * @param {Object} [options] - Tùy chọn
 * @param {boolean} [options.includeInactive=false] - Bao gồm danh mục không hoạt động (admin only)
 * @returns {Promise} Response từ API
 */
export const getWasteCategories = async (options = {}) => {
  try {
    const { includeInactive = true } = options;
    const { data } = await api.get("/waste-categories", {
      params: { includeInactive },
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách danh mục loại rác. Vui lòng thử lại.",
    );
  }
};

/**
 * Tạo danh mục loại rác (Admin) - Create waste category
 * POST /admin/waste-categories
 * @param {Object} body - Request body
 * @param {string} body.code - Mã danh mục (vd: "DEMO")
 * @param {string} body.name - Tên danh mục (vd: "Demo")
 * @returns {Promise} Response từ API
 */
export const createWasteCategory = async (body) => {
  try {
    const { data } = await api.post("/admin/waste-categories", body);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi tạo danh mục loại rác. Vui lòng thử lại.",
    );
  }
};

/**
 * Cập nhật danh mục loại rác (Admin) - Update waste category
 * PUT /admin/waste-categories/{id}
 * @param {string} id - UUID danh mục (path parameter, bắt buộc)
 * @param {Object} body - Request body
 * @param {string} body.name - Tên danh mục
 * @returns {Promise} Response từ API
 */
export const updateWasteCategory = async (id, body) => {
  try {
    const { data } = await api.put(`/admin/waste-categories/${id}`, body);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật danh mục loại rác. Vui lòng thử lại.",
    );
  }
};

/**
 * Vô hiệu hóa danh mục loại rác (Admin) - Deactivate waste category
 * PATCH /admin/waste-categories/{id}/deactivate
 * @param {string} id - UUID danh mục (path parameter, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const deactivateWasteCategory = async (id) => {
  try {
    const { data } = await api.patch(
      `/admin/waste-categories/${id}/deactivate`,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi vô hiệu hóa danh mục loại rác. Vui lòng thử lại.",
    );
  }
};

/**
 * Kích hoạt danh mục loại rác (Admin) - Activate waste category
 * PATCH /admin/waste-categories/{id}/activate
 * @param {string} id - UUID danh mục (path parameter, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const activateWasteCategory = async (id) => {
  try {
    const { data } = await api.patch(
      `/admin/waste-categories/${id}/activate`,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi kích hoạt danh mục loại rác. Vui lòng thử lại.",
    );
  }
};

/**
 * Xử lý khiếu nại (Admin) - Processing complaint
 * PATCH /admin/complaint/{id}/processing
 * @param {string} id - UUID khiếu nại (path parameter, bắt buộc)
 * @param {Object} body - Request body (bắt buộc)
 * @param {string} body.status - Trạng thái (vd: "OPEN")
 * @param {string} body.resolutionNote - Ghi chú xử lý
 * @returns {Promise} Response từ API
 */
export const patchAdminComplaintProcessing = async (id, body) => {
  try {
    if (!id) {
      throw new Error("Thiếu id khiếu nại để xử lý.");
    }
    const { data } = await api.patch(
      `/admin/complaint/${id}/processing`,
      body,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi xử lý khiếu nại. Vui lòng thử lại.",
    );
  }
};

/**
 * Thống kê số report theo tháng trong năm (Admin)
 * GET /admin/statistics/reports-by-month
 * @param {number} year - Năm cần thống kê (query, integer)
 * @returns {Promise} Response từ API
 */
export const getAdminStatisticsReportsByMonth = async (year) => {
  try {
    const params = {};
    if (year != null) params.year = year;
    const { data } = await api.get("/admin/statistics/reports-by-month", {
      params,
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thống kê report theo tháng. Vui lòng thử lại.",
    );
  }
};

/**
 * Thống kê tổng quan admin
 * GET /admin/statistics/overview
 * @param {Object} [options]
 * @param {string} [options.range] - Khoảng thời gian (vd: "MONTH")
 * @returns {Promise} Response từ API
 */
export const getAdminStatisticsOverview = async ({ range } = {}) => {
  try {
    const params = {};
    if (range) params.range = range;
    const { data } = await api.get("/admin/statistics/overview", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thống kê tổng quan admin. Vui lòng thử lại.",
    );
  }
};

/**
 * Thống kê collector theo khu vực làm việc (Admin)
 * GET /admin/statistics/collectors-by-area
 * @returns {Promise} Response từ API
 */
export const getAdminStatisticsCollectorsByArea = async () => {
  try {
    const { data } = await api.get("/admin/statistics/collectors-by-area");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thống kê collector theo khu vực. Vui lòng thử lại.",
    );
  }
};

/**
 * Thống kê tổng quan collector
 * GET /collector/statistics/overview
 * @param {Object} [options]
 * @param {string} [options.range] - Khoảng thời gian (vd: "MONTH")
 * @returns {Promise} Response từ API
 */
export const getCollectorStatisticsOverview = async ({ range } = {}) => {
  try {
    const params = {};
    if (range) params.range = range;
    const { data } = await api.get("/collector/statistics/overview", {
      params,
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thống kê tổng quan collector. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy lịch sử giao dịch điểm của công dân hiện tại
 * GET /citizen/points/transactions
 * @param {number} page - Chỉ số trang (zero-based)
 * @param {number} size - Kích thước trang
 * @param {string[]} sort - Mảng sort dạng: ["createdAt,desc"]
 * @returns {Promise} Response từ API
 */
export const getCitizenPointTransactions = async (
  page = 0,
  size = 20,
  sort = ["createdAt,desc"],
) => {
  try {
    const params = { page, size };
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }
    const { data } = await api.get("/citizen/points/transactions", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy lịch sử giao dịch điểm. Vui lòng thử lại.",
    );
  }
};

/**
 * Lay so du diem hien tai cua cong dan
 * GET /citizen/points/balance
 * @returns {Promise} Response tu API
 */
export const getCitizenPointsBalance = async () => {
  try {
    const { data } = await api.get("/citizen/points/balance");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Da xay ra loi khi lay so du diem hien tai. Vui long thu lai.",
    );
  }
};

/**
 * Lấy danh sách thông báo của công dân hiện tại
 * GET /citizen/notifications
 * @returns {Promise} Response từ API
 */
export const getCitizenNotifications = async () => {
  try {
    const { data } = await api.get("/citizen/notifications");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách thông báo. Vui lòng thử lại.",
    );
  }
};

/**
 * Thống kê tổng quan citizen theo tháng
 * GET /citizen/statistics/overview?month=YYYY-MM
 * @param {string} [month] - Tháng cần thống kê (YYYY-MM)
 * @returns {Promise} Response từ API
 */
export const getCitizenStatisticsOverview = async (month) => {
  try {
    const params = {};
    if (month) params.month = month;
    const { data } = await api.get("/citizen/statistics/overview", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thống kê tổng quan. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy thông tin hồ sơ của citizen hiện tại
 * GET /citizen/profile
 * @returns {Promise} Response từ API
 */
export const getCitizenProfile = async () => {
  try {
    const { data } = await api.get("/citizen/profile");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thông tin hồ sơ công dân. Vui lòng thử lại.",
    );
  }
};

/**
 * Cập nhật trạng thái đã đọc cho thông báo của công dân
 * PUT /citizen/notification?ids=<id>&ids=<id>
 * @param {string[]} ids - Danh sách notification user id cần đánh dấu đã đọc
 * @returns {Promise} Response từ API
 */
export const markCitizenNotificationsAsRead = async (ids = []) => {
  try {
    const normalizedIds = Array.isArray(ids)
      ? ids.map((id) => String(id || "").trim()).filter(Boolean)
      : [];

    if (!normalizedIds.length) {
      return { success: true, data: [] };
    }

    const { data } = await api.put("/citizen/notification", null, {
      params: { ids: normalizedIds },
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật trạng thái đã đọc thông báo. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách báo cáo của công dân hiện tại
 * @param {number} page - Chỉ số trang (zero-based)
 * @param {number} size - Kích thước trang
 * @param {string[]} sort - Mảng sort dạng: ["createdAt,desc"]
 * @returns {Promise} Response từ API
 */
export const getCitizenReports = async (
  page = 0,
  size = 20,
  sort = ["createdAt,desc"],
) => {
  try {
    const params = { page, size };
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }
    const { data } = await api.get("/citizen/reports", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Tạo báo cáo rác thải mới
 * @param {Object} reportData - Object chứa areaId, wasteCategoryId, description, estimatedWeightKg, latitude, longitude, addressText, imageUrls
 * @returns {Promise} Response từ API
 */
export const createCitizenReport = async (reportData) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Vui lòng đăng nhập để tạo báo cáo.");
    }
    const { data } = await api.post("/citizen/reports", reportData);
    return data;
  } catch (error) {
    handleApiError(error, "Đã xảy ra lỗi khi tạo báo cáo. Vui lòng thử lại.");
  }
};
/**
 * Lấy chi tiết một báo cáo của công dân theo ID
 * @param {string} id - ID của báo cáo
 * @returns {Promise} Response từ API
 */
export const getCitizenReportById = async (id) => {
  try {
    const token = getAccessToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/citizen/reports/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      let errorMessage = "Không thể lấy chi tiết báo cáo";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Xử lý các lỗi network và CORS
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên.",
        );
      }
    }
    // Nếu error đã có message, giữ nguyên
    if (error.message) {
      throw error;
    }
    // Nếu không có message, tạo message mặc định
    throw new Error(
      "Đã xảy ra lỗi khi lấy chi tiết báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Citizen hủy báo cáo (chỉ khi trạng thái PENDING/ACCEPTED)
 * POST /citizen/reports/{id}/cancel
 * @param {string} id - ID report
 * @param {string} reason - Lý do hủy (required by swagger)
 * @returns {Promise} Response từ API
 */
export const cancelCitizenReport = async (id, reason) => {
  try {
    if (!id) throw new Error("Thiếu ID báo cáo để hủy.");
    const payload = {
      reason: String(reason ?? "").trim() || "Citizen cancel report",
    };
    const { data } = await api.post(`/citizen/reports/${id}/cancel`, payload);
    return data;
  } catch (error) {
    handleApiError(error, "Đã xảy ra lỗi khi hủy báo cáo. Vui lòng thử lại.");
  }
};

/**
 * Citizen bổ sung ảnh cho báo cáo PENDING
 * POST /citizen/reports/{id}/images
 * @param {string} id - ID báo cáo
 * @param {string[]} imageUrls - Danh sách URL ảnh cần thêm
 * @returns {Promise} Response từ API
 */
export const addImagesToCitizenReport = async (id, imageUrls) => {
  try {
    if (!id) throw new Error("Thiếu ID báo cáo để bổ sung ảnh.");

    const normalizedImageUrls = Array.isArray(imageUrls)
      ? imageUrls.map((url) => String(url || "").trim()).filter(Boolean)
      : [];

    if (!normalizedImageUrls.length) {
      throw new Error("Vui lòng nhập ít nhất một URL ảnh hợp lệ.");
    }

    const payload = {
      imageUrls: normalizedImageUrls,
    };

    const { data } = await api.post(`/citizen/reports/${id}/images`, payload);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi bổ sung ảnh cho báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách báo cáo trong hộp thư của doanh nghiệp (pending/filtered reports in dispatch inbox)
 * @param {string} areaId - ID của khu vực (optional)
 * @param {string} status - Trạng thái báo cáo (optional)
 * @param {number} page - Chỉ số trang (zero-based, mặc định: 0)
 * @param {number} size - Kích thước trang (mặc định: 20)
 * @param {string[]} sort - Mảng sort dạng: ["createdAt,desc"] (optional)
 * @returns {Promise} Response từ API
 */
export const getEnterpriseReportsInbox = async (
  areaId = null,
  status = null,
  page = 0,
  size = 20,
  sort = ["createdAt,desc"],
) => {
  try {
    const params = {};
    if (areaId) {
      // Swagger định nghĩa param là "areaId"
      params.areaId = areaId;
    }
    if (status) {
      params.status = status;
    }
    if (page !== undefined && page !== null) {
      params.page = page;
    }
    if (size !== undefined && size !== null) {
      params.size = size;
    }
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }
    const { data } = await api.get("/enterprise/reports/inbox", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách báo cáo doanh nghiệp. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách voucher cho doanh nghiệp (enterprise list vouchers with paging)
 * Endpoint: GET /enterprise/vouchers
 * @param {Object} options - Tham số query
 * @param {string} [options.keyword] - Từ khóa tìm kiếm
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Sắp xếp: property,(asc|desc)
 * @returns {Promise} Response từ API
 */
export const getEnterpriseVouchers = async ({
  keyword,
  page = 0,
  size = 20,
  sort,
} = {}) => {
  try {
    const params = {};
    if (keyword != null && keyword !== "") {
      params.keyword = keyword;
    }
    if (page !== undefined && page !== null) {
      params.page = page;
    }
    if (size !== undefined && size !== null) {
      params.size = size;
    }
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }

    const { data } = await api.get("/enterprise/vouchers", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách voucher. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy thống kê tổng quan enterprise
 * Endpoint: GET /enterprise/statistics/overview
 * @param {Object} [options]
 * @param {string} [options.range] - DAY | WEEK | MONTH | YEAR
 * @returns {Promise} Response từ API
 */
export const getEnterpriseStatisticsOverview = async ({ range } = {}) => {
  try {
    const params = {};
    if (range) params.range = range;
    const { data } = await api.get("/enterprise/statistics/overview", {
      params,
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy thống kê tổng quan. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách voucher công khai (Public voucher catalog)
 * Endpoint: GET /vouchers
 * @param {Object} options - Tham số query
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Sắp xếp: property,(asc|desc)
 * @returns {Promise} Response từ API
 */
export const getPublicVouchers = async ({ page = 0, size = 20, sort } = {}) => {
  try {
    const params = {};
    if (page !== undefined && page !== null) {
      params.page = page;
    }
    if (size !== undefined && size !== null) {
      params.size = size;
    }
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }

    const { data } = await api.get("/vouchers", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách voucher. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy lịch sử đổi voucher của citizen
 * Endpoint: GET /citizen/vouchers/redemptions
 * @param {Object} options - Tham số query
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Sắp xếp: property,(asc|desc)
 * @returns {Promise} Response từ API
 */
export const getCitizenVoucherRedemptions = async ({
  page = 0,
  size = 20,
  sort,
} = {}) => {
  try {
    const params = {};
    if (page !== undefined && page !== null) {
      params.page = page;
    }
    if (size !== undefined && size !== null) {
      params.size = size;
    }
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }

    const { data } = await api.get("/citizen/vouchers/redemptions", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy lịch sử đổi voucher. Vui lòng thử lại.",
    );
  }
};

/**
 * Citizen đổi voucher
 * Endpoint: POST /citizen/vouchers/{id}/redeem
 * @param {string} id - ID voucher (path param, required)
 * @returns {Promise} Response từ API
 */
export const redeemCitizenVoucher = async (id) => {
  try {
    if (!id) {
      throw new Error("Thiếu id voucher để đổi quà.");
    }
    const { data } = await api.post(`/citizen/vouchers/${id}/redeem`);
    return data;
  } catch (error) {
    handleApiError(error, "Đã xảy ra lỗi khi đổi voucher. Vui lòng thử lại.");
  }
};

/**
 * Tạo voucher cho doanh nghiệp (enterprise create voucher)
 * Endpoint: POST /enterprise/vouchers
 * @param {Object} body - Request body
 * @param {string} body.code
 * @param {string} body.title
 * @param {string} body.description
 * @param {number} body.pointsCost
 * @param {number} body.stock
 * @param {string} body.availableFrom - ISO datetime
 * @param {string} body.availableTo - ISO datetime
 * @param {boolean} body.isActive
 * @param {string} body.imageUrl
 * @returns {Promise} Response từ API
 */
export const createEnterpriseVoucher = async (body) => {
  try {
    const { data } = await api.post("/enterprise/vouchers", body);
    return data;
  } catch (error) {
    handleApiError(error, "Đã xảy ra lỗi khi tạo voucher. Vui lòng thử lại.");
  }
};

/**
 * Lấy chi tiết voucher cho doanh nghiệp (enterprise get voucher detail)
 * Endpoint: GET /enterprise/vouchers/{id}
 * @param {string} id - ID voucher
 * @returns {Promise} Response từ API
 */
export const getEnterpriseVoucherById = async (id) => {
  try {
    const { data } = await api.get(`/enterprise/vouchers/${id}`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy chi tiết voucher. Vui lòng thử lại.",
    );
  }
};

/**
 * Bật/tắt trạng thái active của voucher (Enterprise manager)
 * PATCH /enterprise/vouchers/{id}/toggle?active=true|false
 * @param {string} id - ID voucher (path param)
 * @param {boolean} active - Trạng thái active mới (query param, required)
 * @returns {Promise} Response từ API
 */
export const toggleEnterpriseVoucher = async (id, active) => {
  try {
    if (!id) {
      throw new Error("Thiếu id voucher để bật/tắt.");
    }
    if (typeof active !== "boolean") {
      throw new Error("Thiếu trạng thái active hợp lệ để bật/tắt voucher.");
    }
    const { data } = await api.patch(
      `/enterprise/vouchers/${id}/toggle`,
      null,
      {
        params: { active },
      },
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi bật/tắt voucher. Vui lòng thử lại.",
    );
  }
};

/**
 * Cập nhật voucher cho doanh nghiệp (enterprise update voucher)
 * Endpoint: PUT /enterprise/vouchers/{id}
 * @param {string} id - ID voucher
 * @param {Object} body - Request body
 * @param {string} body.title
 * @param {string} body.description
 * @param {number} body.pointsCost
 * @param {number} body.stock
 * @param {string} body.availableFrom - ISO datetime
 * @param {string} body.availableTo - ISO datetime
 * @param {boolean} body.isActive
 * @param {string} body.imageUrl
 * @returns {Promise} Response từ API
 */
export const updateEnterpriseVoucher = async (id, body) => {
  try {
    const { data } = await api.put(`/enterprise/vouchers/${id}`, body);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật voucher. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách tất cả báo cáo cho doanh nghiệp (enterprise report list)
 * Endpoint: GET /enterprise/reports
 * @param {number} page - Chỉ số trang (zero-based, mặc định: 0)
 * @param {number} size - Kích thước trang (mặc định: 20)
 * @param {string[]} sort - Mảng sort dạng: ["createdAt,desc"] (optional)
 * @returns {Promise} Response từ API
 */
export const getEnterpriseReports = async (
  page = 0,
  size = 20,
  sort = ["createdAt,desc"],
) => {
  try {
    const params = {};
    if (page !== undefined && page !== null) {
      params.page = page;
    }
    if (size !== undefined && size !== null) {
      params.size = size;
    }
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }

    // Swagger định nghĩa: GET /enterprise/reports?page=0&size=20&sort=property,(asc|desc)
    const { data } = await api.get("/enterprise/reports", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy chi tiết một báo cáo của doanh nghiệp theo ID
 * Endpoint: GET /enterprise/reports/{id}
 * @param {string} id - ID của báo cáo
 * @returns {Promise} Response từ API
 */
export const getEnterpriseReportById = async (id) => {
  try {
    const { data } = await api.get(`/enterprise/reports/${id}`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy chi tiết báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách collector đang hoạt động theo khu vực làm việc
 * Endpoint: GET /enterprise/collectors
 * @param {Object} options - Tham số query
 * @param {string} options.areaId - ID khu vực làm việc của collector (bắt buộc để lọc theo khu vực)
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Mảng sort dạng: ["property,asc"] hoặc ["property,desc"]
 * @returns {Promise} Response từ API
 */
export const getEnterpriseCollectors = async ({
  areaId,
  page = 0,
  size = 20,
  sort,
} = {}) => {
  try {
    const params = {};

    // Swagger định nghĩa các query param: areaId, page, size, sort
    if (areaId) {
      params.areaId = areaId;
    }
    if (page !== undefined && page !== null) {
      params.page = page;
    }
    if (size !== undefined && size !== null) {
      params.size = size;
    }
    if (Array.isArray(sort) && sort.length) {
      params.sort = sort;
    }

    const { data } = await api.get("/enterprise/collectors", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách collector. Vui lòng thử lại.",
    );
  }
};

/**
 * Chấp nhận (accept) một báo cáo cho doanh nghiệp
 * Endpoint: POST /enterprise/reports/{id}/accept
 * @param {string} id - ID của báo cáo
 * @returns {Promise} Response từ API
 */
export const acceptEnterpriseReport = async (id) => {
  try {
    const { data } = await api.post(`/enterprise/reports/${id}/accept`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi chấp nhận báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Từ chối (reject) một báo cáo cho doanh nghiệp với lý do
 * Endpoint: POST /enterprise/reports/{id}/reject
 * @param {string} id - ID của báo cáo
 * @param {string} reason - Lý do từ chối
 * @returns {Promise} Response từ API
 */
export const rejectEnterpriseReport = async (id, reason) => {
  try {
    const { data } = await api.post(`/enterprise/reports/${id}/reject`, {
      reason,
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi từ chối báo cáo. Vui lòng thử lại.",
    );
  }
};

/**
 * Giao việc collector cho báo cáo đã ACCEPTED (enterprise)
 * Endpoint: POST /enterprise/reports/{id}/assign
 * @param {string} id - ID của báo cáo
 * @param {string} collectorId - ID của collector
 * @returns {Promise} Response từ API
 */
export const assignEnterpriseReport = async (id, collectorId) => {
  try {
    const { data } = await api.post(`/enterprise/reports/${id}/assign`, {
      collectorId,
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi giao việc cho collector. Vui lòng thử lại.",
    );
  }
};

/**
 * Collector lấy danh sách assignment của mình
 * GET /collector/assignments
 * @param {Object} options - Tham số query
 * @param {string} [options.status] - Trạng thái assignment
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Mảng sort dạng: ["property,asc"] hoặc ["property,desc"]
 * @returns {Promise} Response từ API
 */
export const getCollectorAssignments = async ({
  status,
  page = 0,
  size = 20,
  sort,
} = {}) => {
  try {
    const params = { page, size };
    if (status != null && status !== "") params.status = status;
    if (Array.isArray(sort) && sort.length) params.sort = sort;
    const { data } = await api.get("/collector/assignments", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách phân công. Vui lòng thử lại.",
    );
  }
};

/**
 * Collector lấy chi tiết báo cáo của assignment (theo reportId)
 * GET /collector/assignments/report/{reportId}
 * @param {string} reportId - ID báo cáo (bắt buộc)
 * @returns {Promise} Response từ API
 */
export const getCollectorAssignmentReportDetail = async (reportId) => {
  try {
    const { data } = await api.get(`/collector/assignments/report/${reportId}`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy chi tiết báo cáo phân công. Vui lòng thử lại.",
    );
  }
};

/**
 * Collector cập nhật trạng thái assignment
 * PATCH /collector/assignments/{id}/status
 * @param {string} id - ID assignment (path, bắt buộc)
 * @param {Object} body - Request body
 * @param {string} body.status - Trạng thái (ASSIGNED | ON_THE_WAY | COLLECTED)
 * @param {string} [body.note] - Ghi chú
 * @param {number} [body.lastKnownLatitude=0] - Vĩ độ
 * @param {number} [body.lastKnownLongitude=0] - Kinh độ
 * @returns {Promise} Response từ API
 */
export const updateCollectorAssignmentStatus = async (
  id,
  { status, note = "" },
) => {
  try {
    const { data } = await api.patch(`/collector/assignments/${id}/status`, {
      status,
      note,
      // lastKnownLatitude,
      // lastKnownLongitude,
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật trạng thái phân công. Vui lòng thử lại.",
    );
  }
};

/**
 * Collector upload bằng chứng sau khi đã thu gom (COLLECTED)
 * POST /collector/assignments/{id}/proof
 * @param {string} id - ID assignment (path, bắt buộc)
 * @param {Object} body - Request body
 * @param {string[]} body.proofUrls - Mảng URL ảnh bằng chứng
 * @param {string} body.takenAt - Thời điểm chụp (ISO 8601, VD: "2026-03-11T10:29:49.473Z")
 * @returns {Promise} Response từ API
 */
export const uploadCollectorAssignmentProof = async (
  id,
  { proofUrls, takenAt },
) => {
  try {
    const { data } = await api.post(`/collector/assignments/${id}/proof`, {
      proofUrls: Array.isArray(proofUrls)
        ? proofUrls
        : [proofUrls].filter(Boolean),
      takenAt: takenAt || new Date().toISOString(),
    });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi tải bằng chứng thu gom. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách waste capabilities (Admin)
 * GET /admin/waste-capabilities - List waste capabilities
 * @returns {Promise} Response từ API
 */
export const getAdminWasteCapabilities = async () => {
  try {
    const { data } = await api.get("/admin/waste-capabilities");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách waste capabilities. Vui lòng thử lại.",
    );
  }
};

/**
 * Upsert waste capability theo danh mục rác (Admin)
 * PUT /admin/waste-capabilities/{wasteCategoryId}
 * @param {string} wasteCategoryId - ID danh mục rác (path param, required)
 * @param {Object} body - Request body
 * @param {number} body.dailyCapacityKg
 * @param {boolean} body.accepting
 * @returns {Promise} Response từ API
 */
export const upsertAdminWasteCapability = async (wasteCategoryId, body) => {
  try {
    if (!wasteCategoryId) {
      throw new Error("Thiếu wasteCategoryId để thêm công suất.");
    }
    const { data } = await api.put(
      `/admin/waste-capabilities/${wasteCategoryId}`,
      body,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi thêm công suất. Vui lòng thử lại.",
    );
  }
};

/**
 * Bật/tắt cờ tiếp nhận (Admin) - Toggle accepting flag
 * PATCH /admin/waste-capabilities/{wasteCategoryId}/toggle
 * @param {string} wasteCategoryId - UUID danh mục rác (path parameter, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const toggleAdminWasteCapability = async (wasteCategoryId) => {
  try {
    const { data } = await api.patch(
      `/admin/waste-capabilities/${wasteCategoryId}/toggle`,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi bật/tắt tiếp nhận. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách user (Admin)
 * GET /admin/users - Get list of user
 * @param {Object} options - Tham số query
 * @param {string} [options.searchTerm] - Chuỗi tìm kiếm
 * @param {string} [options.role] - Lọc theo role
 * @param {string} [options.status] - Lọc theo status
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Sắp xếp: property,(asc|desc), nhiều tiêu chí được hỗ trợ
 * @returns {Promise} Response từ API
 */
export const getAdminUsers = async ({
  searchTerm,
  role,
  status,
  page = 0,
  size = 20,
  sort,
} = {}) => {
  try {
    const params = { page, size };
    if (searchTerm != null && searchTerm !== "") params.searchTerm = searchTerm;
    if (role != null && role !== "") params.role = role;
    if (status != null && status !== "") params.status = status;
    if (Array.isArray(sort) && sort.length) params.sort = sort;
    const { data } = await api.get("/admin/users", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách người dùng. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy chi tiết user (Admin) - Get user detail
 * GET /admin/users/{userId}
 * @param {string} userId - ID user (path parameter, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const getAdminUserDetail = async (userId) => {
  try {
    const { data } = await api.get(`/admin/users/${userId}`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy chi tiết người dùng. Vui lòng thử lại.",
    );
  }
};

/**
 * Thăng cấp user thành collector và set working area (Admin)
 * POST /admin/users/{userId}/promote-collector
 * @param {string} userId - ID user (path parameter, bắt buộc)
 * @param {Object} body - Request body
 * @param {string} body.areaId - ID khu vực làm việc
 * @returns {Promise} Response từ API
 */
export const promoteAdminUserToCollector = async (userId, body) => {
  try {
    if (!userId) {
      throw new Error("Thiếu userId để thăng cấp collector.");
    }
    const { data } = await api.post(
      `/admin/users/${userId}/promote-collector`,
      body,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi thăng cấp người dùng thành collector. Vui lòng thử lại.",
    );
  }
};

/**
 * Cập nhật trạng thái user (Admin)
 * PATCH /admin/users/{userId}/status
 * @param {string} userId - ID user (path parameter, bắt buộc)
 * @param {Object} body - Request body
 * @param {string} body.status - Trạng thái mới (vd: "ACTIVE", "INACTIVE")
 * @param {string} body.reason - Lý do cập nhật
 * @returns {Promise} Response từ API
 */
export const updateAdminUserStatus = async (userId, body) => {
  try {
    if (!userId) {
      throw new Error("Thiếu userId để cập nhật trạng thái.");
    }
    const { data } = await api.patch(`/admin/users/${userId}/status`, body);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật trạng thái người dùng. Vui lòng thử lại.",
    );
  }
};

/**
 * Gỡ bỏ role khỏi user (Admin)
 * DELETE /admin/users/{userId}/roles/{roleCode}
 * @param {string} userId - ID user (path parameter, bắt buộc)
 * @param {string} roleCode - Mã role cần xóa (path parameter, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const removeAdminUserRole = async (userId, roleCode) => {
  try {
    if (!userId) {
      throw new Error("Thiếu userId để xóa role.");
    }
    if (!roleCode) {
      throw new Error("Thiếu roleCode để xóa role khỏi người dùng.");
    }
    const { data } = await api.delete(
      `/admin/users/${userId}/roles/${roleCode}`,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi xóa role khỏi người dùng. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách khiếu nại đang hoạt động (List active complaints)
 * GET /complaints
 * @param {Object} options - Tham số query
 * @param {string} [options.category] - Lọc theo category
 * @param {string} [options.status] - Lọc theo status
 * @param {number} [options.page=0] - Chỉ số trang (zero-based)
 * @param {number} [options.size=20] - Kích thước trang
 * @param {string[]} [options.sort] - Sắp xếp: property,(asc|desc)
 * @returns {Promise} Response từ API
 */
export const getComplaints = async ({
  category,
  status,
  page = 0,
  size = 20,
  sort,
} = {}) => {
  try {
    const params = { page, size };
    if (category != null && category !== "") params.category = category;
    if (status != null && status !== "") params.status = status;
    if (Array.isArray(sort) && sort.length) params.sort = sort;
    const { data } = await api.get("/complaints", { params });
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách khiếu nại. Vui lòng thử lại.",
    );
  }
};

/**
 * Tạo khiếu nại (Citizen)
 * POST /citizen/complaint
 * @param {Object} body - Request body
 * @param {string} body.reportId
 * @param {string} body.category
 * @param {string} body.description
 * @param {number|null} body.latitude
 * @param {number|null} body.longitude
 * @param {string} body.status
 * @returns {Promise} Response từ API
 */
export const createCitizenComplaint = async (body) => {
  try {
    const { data } = await api.post("/citizen/complaint", body);
    return data;
  } catch (error) {
    handleApiError(error, "Đã xảy ra lỗi khi tạo khiếu nại. Vui lòng thử lại.");
  }
};

/**
 * Cập nhật khiếu nại (Citizen)
 * PUT /citizen/complaint/{id}
 * @param {string} id - ID khiếu nại (uuid)
 * @param {Object} body - Request body
 * @param {string} body.reportId
 * @param {string} body.category
 * @param {string} body.description
 * @param {number|null} body.latitude
 * @param {number|null} body.longitude
 * @param {string} body.status
 * @returns {Promise} Response từ API
 */
export const updateCitizenComplaint = async (id, body) => {
  try {
    const { data } = await api.put(`/citizen/complaint/${id}`, body);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi cập nhật khiếu nại. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách quy tắc thưởng (Admin) - List reward rules
 * GET /admin/reward-rules - No parameters
 * @returns {Promise} Response từ API
 */
export const getAdminRewardRules = async () => {
  try {
    const { data } = await api.get("/admin/reward-rules");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách quy tắc thưởng. Vui lòng thử lại.",
    );
  }
};

/**
 * Upsert quy tắc thưởng theo danh mục rác (Admin)
 * PUT /admin/reward-rules/{wasteCategoryId}
 * @param {string} wasteCategoryId - ID danh mục rác (uuid, path param, bắt buộc)
 * @param {Object} body - Request body
 * @param {number} body.pointsPerKg
 * @param {number} body.bonusQualityPoints
 * @param {number} body.bonusFastCompletePoints
 * @param {string} body.effectiveFrom - ISO datetime
 * @param {string} body.effectiveTo - ISO datetime
 * @param {number} body.priority
 * @returns {Promise} Response từ API
 */
export const upsertAdminRewardRuleByWasteCategory = async (
  wasteCategoryId,
  body,
) => {
  try {
    if (!wasteCategoryId) {
      throw new Error("Thiếu wasteCategoryId để lưu quy tắc thưởng.");
    }
    const { data } = await api.put(
      `/admin/reward-rules/${wasteCategoryId}`,
      body,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lưu quy tắc thưởng. Vui lòng thử lại.",
    );
  }
};

/**
 * Bật/tắt trạng thái active của quy tắc thưởng (Admin)
 * PATCH /admin/reward-rules/{id}/toggle
 * @param {string} id - ID quy tắc thưởng (uuid, path param, bắt buộc)
 * @returns {Promise} Response từ API
 */
export const toggleAdminRewardRule = async (id) => {
  try {
    if (!id) {
      throw new Error("Thiếu id để bật/tắt quy tắc thưởng.");
    }
    const { data } = await api.patch(`/admin/reward-rules/${id}/toggle`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi bật/tắt quy tắc thưởng. Vui lòng thử lại.",
    );
  }
};

/**
 * Lấy danh sách quy tắc thưởng (Enterprise manager) - List reward rules
 * GET /enterprise/reward-rules - No parameters
 * @returns {Promise} Response từ API (200 OK)
 */
export const getEnterpriseRewardRules = async () => {
  try {
    const { data } = await api.get("/enterprise/reward-rules");
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lấy danh sách quy tắc thưởng. Vui lòng thử lại.",
    );
  }
};

/**
 * Upsert quy tắc thưởng theo danh mục rác (Enterprise manager)
 * PUT /enterprise/reward-rules/{wasteCategoryId}
 * @param {string} wasteCategoryId - ID danh mục rác (path param)
 * @param {Object} body - Request body
 * @param {number} body.pointsPerKg
 * @param {number} body.bonusQualityPoints
 * @param {number} body.bonusFastCompletePoints
 * @param {string} body.effectiveFrom - ISO datetime
 * @param {string} body.effectiveTo - ISO datetime
 * @param {number} body.priority
 * @returns {Promise} Response từ API
 */
export const upsertEnterpriseRewardRuleByWasteCategory = async (
  wasteCategoryId,
  body,
) => {
  try {
    if (!wasteCategoryId) {
      throw new Error("Thiếu wasteCategoryId để lưu quy tắc thưởng.");
    }
    const { data } = await api.put(
      `/enterprise/reward-rules/${wasteCategoryId}`,
      body,
    );
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi lưu quy tắc thưởng. Vui lòng thử lại.",
    );
  }
};

/**
 * Bật/tắt trạng thái active của reward rule (Enterprise manager)
 * PATCH /enterprise/reward-rules/{id}/toggle
 * @param {string} id - ID reward rule (path param)
 * @returns {Promise} Response từ API
 */
export const toggleEnterpriseRewardRule = async (id) => {
  try {
    if (!id) {
      throw new Error("Thiếu id để bật/tắt quy tắc thưởng.");
    }
    const { data } = await api.patch(`/enterprise/reward-rules/${id}/toggle`);
    return data;
  } catch (error) {
    handleApiError(
      error,
      "Đã xảy ra lỗi khi bật/tắt quy tắc thưởng. Vui lòng thử lại.",
    );
  }
};
