// Sử dụng proxy trong development để tránh lỗi CORS
// Trong development: sử dụng relative path (sẽ được proxy bởi Vite)
// Trong production: sử dụng full URL
const API_BASE_URL = import.meta.env.DEV
    ? ""
    : "http://localhost:8080";

/**
 * Chuyển đổi tên trường sang tiếng Việt
 * @param {string} field - Tên trường tiếng Anh
 * @returns {string} Tên trường tiếng Việt
 */
const getFieldNameInVietnamese = (field) => {
    const fieldMap = {
        'email': 'Email',
        'phone': 'Số điện thoại',
        'password': 'Mật khẩu',
        'fullName': 'Họ và tên',
        'areaId': 'Khu vực',
        'username': 'Tên người dùng'
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
        'validation failed': 'Thông tin không hợp lệ',
        'email already exists': 'Email đã được sử dụng',
        'phone already exists': 'Số điện thoại đã được sử dụng',
        'email or phone is required': 'Vui lòng nhập email hoặc số điện thoại',
        'email is required': 'Vui lòng nhập email',
        'phone is required': 'Vui lòng nhập số điện thoại',
        'password is required': 'Vui lòng nhập mật khẩu',
        'fullname is required': 'Vui lòng nhập họ và tên',
        'areaid is required': 'Vui lòng nhập khu vực',
        'invalid email': 'Email không hợp lệ',
        'invalid phone': 'Số điện thoại không hợp lệ',
        'password too short': 'Mật khẩu quá ngắn',
        'password must be at least': 'Mật khẩu phải có ít nhất',
        'email must be an email': 'Email không đúng định dạng',
        'phone must be a phone number': 'Số điện thoại không đúng định dạng',
        'areaid must be a uuid': 'ID khu vực không hợp lệ',
        'user already exists': 'Người dùng đã tồn tại',
        'internal server error': 'Lỗi hệ thống. Vui lòng thử lại sau.',
        'bad request': 'Yêu cầu không hợp lệ',
        'unauthorized': 'Không có quyền truy cập',
        'forbidden': 'Bị cấm truy cập',
        'not found': 'Không tìm thấy',
        'conflict': 'Dữ liệu đã tồn tại'
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
 * Gọi API đăng ký
 * @param {Object} userData - Object chứa email, phone, password, fullName, areaId
 * @returns {Promise} Response từ API
 */
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            let errorMessage = "Đăng ký thất bại";
            try {
                const errorData = await response.json();
                
                // Xử lý các loại lỗi khác nhau
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (Array.isArray(errorData.errors)) {
                    // Xử lý validation errors dạng array
                    const errorMessages = errorData.errors.map(err => {
                        if (typeof err === 'string') return err;
                        return err.message || err.msg || JSON.stringify(err);
                    });
                    errorMessage = errorMessages.join('. ');
                } else if (errorData.validationErrors) {
                    // Xử lý validation errors dạng object
                    const validationMessages = Object.entries(errorData.validationErrors)
                        .map(([field, message]) => {
                            const fieldName = getFieldNameInVietnamese(field);
                            return `${fieldName}: ${message}`;
                        });
                    errorMessage = validationMessages.join('. ');
                }
                
                // Chuyển đổi các message phổ biến sang tiếng Việt
                errorMessage = translateErrorMessage(errorMessage);
                
            } catch (e) {
                // Nếu không parse được JSON, sử dụng status text
                const statusText = response.statusText || "Đăng ký thất bại";
                errorMessage = translateErrorMessage(statusText);
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
