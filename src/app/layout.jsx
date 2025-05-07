import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers/providers";
import HeaderWrapper from "./components/layouts/header/HeaderWrapper";
import Footer from "./components/layouts/footer/Footer";
import OTPConfirmModal from "./components/ui/Modals/OTPmodal";
import ClientOnly from "./components/ClientOnly";
import AdressModal from "./components/ui/Modals/AddressModal";
import DeleteConfirmModal from "./components/ui/Modals/DeleteConfirmModal";
import SearchModal from "./components/ui/Modals/SearchModal";
import ChatBox from "./components/ui/chatBox/ChatBox";
import InformationModal from "./components/ui/Modals/InformationModal";
import LocationModal from "./components/ui/Modals/LocationModal";
import ScrollToTop from "./components/ui/Buttons/ScrollToTopBtn";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | SeasonDecor - A platform for seasonal decoration services",
    default: "SeasonDecor - A platform for seasonal decoration services",
  },
  description: "Find seasonal decoration services for your home",
  metadataBase: new URL("https://www.seasondecor.com"),
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`!scroll-smooth ${montserrat.className}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-auto">
        {/* Zoom Meeting DOM elements - keep these outside the main app structure */}
        <div id="zmmtg-root"></div>
        <div id="aria-notify-area"></div>

        <AppProviders>
          <ClientOnly>
            <HeaderWrapper />
            <OTPConfirmModal />
            <DeleteConfirmModal />
            <SearchModal />
            <ChatBox />
            <InformationModal />
            <AdressModal />
            <LocationModal />
            <ScrollToTop />
            <main className="flex-1">{children}</main>
            <Footer />
          </ClientOnly>
        </AppProviders>
      </body>
    </html>
  );
}
