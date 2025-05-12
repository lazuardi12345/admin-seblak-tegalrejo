import Sidebar from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-wrapper">
        <Topbar />
        <div className="content">
          {children} {/* Render children passed from Routes */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
