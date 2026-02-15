import Navbar from "./Navbar";
import Footer from "./Footer";
import { AppSettingProvider } from "@/context/AppSettingContext";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <AppSettingProvider>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </AppSettingProvider>
  );
}
