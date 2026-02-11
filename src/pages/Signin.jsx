import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { login, saveTokens, saveUser } from "../service/api";
import Loading from "../components/Loading";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Giữ loading tối thiểu 10s (để user thấy progress), đồng thời vẫn gọi API song song
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const [response] = await Promise.all([
        login(formData.email, formData.password),
        // delay(3000),
      ]);

      // Response có cấu trúc { data: { tokens, user } } hoặc { tokens, user } trực tiếp
      const responseData = response.data || response;
      const tokens = responseData.tokens;
      const user = responseData.user;

      // Lưu tokens vào localStorage
      if (tokens) {
        saveTokens(tokens);
      }

      // Lưu thông tin user vào localStorage
      if (user) {
        const userData = {
          ...user,
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
        };
        saveUser(userData);

        // Xác định role từ roles array hoặc userType
        const roles = user.roles || [];
        const userType = user.userType?.toUpperCase();

        // Hàm helper để xác định role chính
        const getPrimaryRole = () => {
          // Ưu tiên kiểm tra roles array trước
          if (Array.isArray(roles) && roles.length > 0) {
            // Tìm role trong mảng roles (có thể là string hoặc object)
            for (const role of roles) {
              const roleStr = typeof role === 'string' ? role : role?.name || role?.authority || '';
              const normalizedRole = roleStr.toUpperCase();

              // Kiểm tra exact match trước
              if (normalizedRole === 'ROLE_ADMIN') {
                return 'ADMIN';
              }
              if (normalizedRole === 'ROLE_ENTERPRISE_MANAGER' || normalizedRole === 'ROLE_ENTERPRISE') {
                return 'ENTERPRISE';
              }
              if (normalizedRole === 'ROLE_COLLECTOR') {
                return 'COLLECTOR';
              }
              if (normalizedRole === 'ROLE_CITIZEN') {
                return 'CITIZEN';
              }

              // Sau đó kiểm tra includes (fallback)
              if (normalizedRole.includes('ADMIN')) {
                return 'ADMIN';
              }
              if (normalizedRole.includes('ENTERPRISE')) {
                return 'ENTERPRISE';
              }
              if (normalizedRole.includes('COLLECTOR')) {
                return 'COLLECTOR';
              }
              if (normalizedRole.includes('CITIZEN')) {
                return 'CITIZEN';
              }
            }
          }

          // Nếu không tìm thấy trong roles, kiểm tra userType
          if (userType) {
            // Kiểm tra exact match trước
            if (userType === 'ADMIN') {
              return 'ADMIN';
            }
            if (userType === 'ENTERPRISE_MANAGER' || userType === 'ENTERPRISE') {
              return 'ENTERPRISE';
            }
            if (userType === 'COLLECTOR') {
              return 'COLLECTOR';
            }
            if (userType === 'CITIZEN') {
              return 'CITIZEN';
            }

            // Sau đó kiểm tra includes (fallback)
            if (userType.includes('ADMIN')) {
              return 'ADMIN';
            }
            if (userType.includes('ENTERPRISE')) {
              return 'ENTERPRISE';
            }
            if (userType.includes('COLLECTOR')) {
              return 'COLLECTOR';
            }
            if (userType.includes('CITIZEN')) {
              return 'CITIZEN';
            }
          }

          // Mặc định là CITIZEN
          console.warn('Không xác định được role, sử dụng mặc định CITIZEN. Roles:', roles, 'UserType:', userType);
          return 'CITIZEN';
        };

        const primaryRole = getPrimaryRole();
        console.log('User data:', { roles, userType, primaryRole });

        // Xác định đường dẫn dựa trên role
        let redirectPath = "/";
        switch (primaryRole) {
          case 'ADMIN':
            redirectPath = "/admin/dashboard";
            break;
          case 'ENTERPRISE':
            redirectPath = "/enterprise";
            break;
          case 'COLLECTOR':
            redirectPath = "/collector/request-list";
            break;
          case 'CITIZEN':
          default:
            redirectPath = "/";
            break;
        }

        console.log('Redirecting to:', redirectPath, 'for role:', primaryRole);

        // Tắt loading trước rồi mới hiện toast
        setIsLoading(false);

        // Hiển thị thông báo thành công
        toast.success('Đăng nhập thành công!', {
          duration: 2000,
        });

        // Chuyển hướng sau một chút để người dùng thấy toast
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);
      }
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo bằng toast
      const errorMessage = error.message || "Email hoặc mật khẩu không đúng";

      // Tắt loading trước rồi mới hiện toast
      setIsLoading(false);

      // Hiển thị lỗi bằng toast
      toast.error(errorMessage, {
        duration: 5000,
      });

      // Xóa các lỗi validation cũ để chỉ hiển thị toast
      setErrors({});
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log("Google sign in clicked");
    // You can integrate with Google OAuth here
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {isLoading && <Loading text="Đang đăng nhập..." />}
      {/* Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-100 via-teal-100 to-green-200"></div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/40 via-transparent to-teal-200/40"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-green-200/30 via-transparent to-emerald-200/30"></div>

      {/* Large Animated Blobs - More Visible */}
      <div className="absolute bg-green-400 rounded-full top-20 -left-20 w-96 h-96 mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute bg-green-300 rounded-full bottom-20 right-1/4 w-80 h-80 mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>

      {/* Radial Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.2),transparent_50%)]"></div>

      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 transition-colors hover:text-gray-900 group"
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Quay lại</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Đăng nhập vào tài khoản
            </h2>
            <p className="text-base text-gray-600">
              Nhập thông tin đăng nhập của bạn để tiếp tục
            </p>
          </div>

          {/* Signin Form */}
          <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
                    }`}
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white"
                      }`}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transition-colors -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="block ml-2 text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-green-600 transition-colors hover:text-green-700"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">Hoặc</span>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Đăng nhập bằng Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <a
                  href="/signup"
                  className="font-medium text-green-600 transition-colors hover:text-green-700"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
