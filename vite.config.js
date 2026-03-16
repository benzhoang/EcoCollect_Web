import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho các API khu vực (areas) để tránh lỗi CORS trong development
      "/areas": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      // Chỉ proxy API /admin/areas, không proxy route frontend /admin/config/areas (tránh 401)
      "/admin/areas": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy API công suất tiếp nhận rác
      "/admin/waste-capabilities": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/admin/waste-categories": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy API danh sách user (admin)
      "/admin/users": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/admin/reward-rules": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho các API công dân (citizen) để tránh 404 trên Vite dev server
      "/citizen": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/enterprise/reports": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho API danh mục loại rác (waste-categories)
      "/waste-categories": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/enterprise/collectors": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/collector/assignments": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/enterprise/reward-rules": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/enterprise/vouchers": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/vouchers": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/citizen/vouchers": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
      "/complaints": {
        target: "https://swpbe-production-b987.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
