import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/SideBar";
import BottomNav from "../Components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 bg-white">
        <Header />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
