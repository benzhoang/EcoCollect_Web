import AdminSidebar from "../components/AdminComponent/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Full Height */}
      <div className="w-70 shrink-0 transition-all duration-300 ease-in-out overflow-hidden h-full">
        <AdminSidebar isOpen={true} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden h-full">
        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col">
          <div className="flex-1 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
