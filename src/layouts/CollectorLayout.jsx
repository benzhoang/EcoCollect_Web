import React, { useState } from "react";
import CollectorSidebar from "../components/CollectorComponent/CollectorSidebar";

const CollectorLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Full Height */}
      <div
        className={`${isSidebarOpen ? "w-70" : "w-0"} shrink-0 transition-all duration-300 ease-in-out overflow-hidden h-full`}
      >
        <CollectorSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden h-full">
        {/* Header - Only in main content area
        <div className="shrink-0">
          <HeaderAdmin
            toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </div> */}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 flex flex-col bg-white">
          <div className="flex-1 w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CollectorLayout;
