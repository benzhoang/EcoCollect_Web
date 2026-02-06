// Sử dụng proxy trong development để tránh lỗi CORS
// Trong development: sử dụng relative path (sẽ được proxy bởi Vite)
// Trong production: sử dụng full URL
const API_BASE_URL = import.meta.env.DEV
    ? ""
    : "http://localhost:8080";

/**
 * Gọi API login
 * @param {string} identifier - Email hoặc username
 * @param {string} password - Mật khẩu
 * @returns {Promise} Response từ API
 */
export const login = async (identifier, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier,
                password,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Đăng nhập thất bại";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // Nếu không parse được JSON, sử dụng status text
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Xử lý các lỗi network và CORS
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc liên hệ quản trị viên.");
            }
        }
        // Nếu error đã có message, giữ nguyên
        if (error.message) {
            throw error;
        }
        // Nếu không có message, tạo message mặc định
        throw new Error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
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
 * Xóa token và user khỏi localStorage
 */
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("expiresInSeconds");
    localStorage.removeItem("user");
};
