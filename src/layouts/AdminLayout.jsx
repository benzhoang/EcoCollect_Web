import AdminSidebar from "../components/AdminComponent/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
      <AdminSidebar isOpen={true} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300 ease-in-out">
        {/* Content */}
        <div className="flex flex-col flex-1 p-5 overflow-x-hidden overflow-y-auto">
          <div className="flex-1 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
