import ScrollAwareHeader from "./layout/ScrollAwareHeader";
import Newsletter from "./Newsletter";
import Footer from "./layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollAwareHeader />
      <main className="flex-1 mx-10 max-w-7xl pt-16">{children}</main>
      <Newsletter />
      <Footer />
    </div>
  );
}
