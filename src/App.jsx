import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Citizen/HomePage";
import Contact from "./pages/Citizen/Contact";
import Report from "./pages/Citizen/Report";
import CreateReport from "./pages/Citizen/CreateReport";
import ScorePage from "./pages/Citizen/ScorePage";
import RankPage from "./pages/Citizen/RankPage";
import PointGuild from "./pages/Citizen/PointGuild";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/Admin/DashboardPage";
import EnterpriseHomePage from "./pages/Enterprise/EnterpriseHomePage";
import ReportDetail from "./pages/Enterprise/ReportDetail";
import ConfigPoint from "./pages/Enterprise/ConfigPoint";
import CoordinationFollow from "./pages/Enterprise/CoordinationFollow";
import FollowProgress from "./pages/Enterprise/FollowProgress";
import EnterpriseReport from "./pages/Enterprise/EnterpriseReport";
import EnterpriseSetting from "./pages/Enterprise/EnterpriseSetting";
import "./App.css";
import CitizenListPage from "./pages/Admin/CitizenListPage";
import CollectorListPage from "./pages/Admin/CollectorListPage";
import RecyclingEnterpriseListPage from "./pages/Admin/RecyclingEnterpriseListPage";
import ComplaintListPage from "./pages/Admin/ComplaintListPage";
import AccountDetailPage from "./pages/Admin/AccountDetailPage";
import ComplaintDetailPage from "./pages/Admin/ComplaintDetailPage";
import RequestListPage from "./pages/Collector/RequestListPage";
import CollectorLayout from "./layouts/CollectorLayout";
import HistoryPage from "./pages/Collector/HistoryPage";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener("popstate", handleLocationChange);

    // Intercept link clicks
    const handleLinkClick = (e) => {
      const link = e.target.closest("a");
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const newPath = new URL(link.href).pathname;
        window.history.pushState({}, "", newPath);
        setPathname(newPath);
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  const renderContent = () => {
    // Check if path matches /enterprise/report/:id first
    if (pathname.startsWith("/enterprise/report/")) {
      return <ReportDetail />;
    }
    // Check if path matches /enterprise/follow-progress/:id
    if (pathname.startsWith("/enterprise/follow-progress/")) {
      return <FollowProgress />;
    }

    switch (pathname) {
      case "/signin":
        return <Signin />;
      case "/signup":
        return <Signup />;
      case "/contact":
        return (
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        );
      case "/report":
        return (
          <>
            <Navbar />
            <Report />
            <Footer />
          </>
        );
      case "/report/create":
        return (
          <>
            <Navbar />
            <CreateReport />
            <Footer />
          </>
        );
      case "/score":
        return (
          <>
            <Navbar />
            <ScorePage />
            <Footer />
          </>
        );
      case "/rank":
        return (
          <>
            <Navbar />
            <RankPage />
            <Footer />
          </>
        );
      case "/point-guide":
        return (
          <>
            <Navbar />
            <PointGuild />
            <Footer />
          </>
        );
      case "/admin/dashboard":
        return (
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        );
      case "/admin/account/citizens":
        return (
          <AdminLayout>
            <CitizenListPage />
          </AdminLayout>
        );
      case "/admin/account/collectors":
        return (
          <AdminLayout>
            <CollectorListPage />
          </AdminLayout>
        );
      case "/admin/account/recycling-enterprises":
        return (
          <AdminLayout>
            <RecyclingEnterpriseListPage />
          </AdminLayout>
        );
      case "/admin/complaints":
        return (
          <AdminLayout>
            <ComplaintListPage />
          </AdminLayout>
        );
      case "/admin/complaints/detail":
        return (
          <AdminLayout>
            <ComplaintDetailPage />
          </AdminLayout>
        );
      case "/admin/account/detail":
        return (
          <AdminLayout>
            <AccountDetailPage />
          </AdminLayout>
        );
      case "/collector/request-list":
        return (
          <CollectorLayout>
            <RequestListPage />
          </CollectorLayout>
        );
      case "/collector/history":
        return (
          <CollectorLayout>
            <HistoryPage />
          </CollectorLayout>
        );
      case "/enterprise":
        return <EnterpriseHomePage />;
      case "/enterprise/dispatch":
        return <CoordinationFollow />;
      case "/enterprise/follow-progress":
        return <FollowProgress />;
      case "/enterprise/rewards":
        return <ConfigPoint />;
      case "/enterprise/reports":
        return <EnterpriseReport />;
      case "/enterprise/settings":
        return <EnterpriseSetting />;
      case "/":
      default:
        return (
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        );
    }
  };

  return (
    <BrowserRouter>
      <div className="App">{renderContent()}</div>
    </BrowserRouter>
  );
}

export default App;
