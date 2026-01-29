import Logo from "../../assets/Screenshot_2026-01-17_220348-removebg-preview.png";
import { FaBars } from "react-icons/fa";

const HeaderAdmin = ({ toggleSidebar }) => {
  return (
    <nav className="relative z-40 flex items-center h-16 px-6 shadow-sm bg-gray-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button
            className="p-0 mr-4 text-gray-800 cursor-pointer hover:text-black hover:no-underline"
            onClick={toggleSidebar}
          >
            <FaBars className="text-2xl" />
          </button>
          <img src={Logo} alt="Logo" className="object-contain h-9" />
        </div>
      </div>
    </nav>
  );
};

export default HeaderAdmin;
