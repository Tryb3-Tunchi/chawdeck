import { Outlet } from "react-router-dom";
import ScrollAwareHeader from "./ScrollAwareHeader";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollAwareHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
