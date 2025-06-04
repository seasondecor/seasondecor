"use client";

import { usePathname } from "next/navigation";
import Header from "./generalHeader/Header";
import SellerHeader from "./sellerHeader/SellerHeader";
import MinimalHeader from "./minimalHeader/MinimalHeader";
import AdminHeader from "./adminHeader/AdminHeader";

const HeaderWrapper = () => {
  const pathname = usePathname();


  if(pathname === ("/seller/registration")){
    return null;
  }

  if (pathname.startsWith("/admin/")) {
    return <AdminHeader />;
  }

  if (pathname.startsWith("/seller/")) {
    return <SellerHeader />;
  }
  

  if (pathname === "/authen/login" || pathname === "/authen/signup") {
    return <MinimalHeader />;
  }

  if (pathname === "/payment/success" || pathname === "/payment/failure") {
    return null;
  }

  if (pathname === "/user/account/topup") {
    return null;
  }

  if (pathname.startsWith("/sign")) {
    return null;
  }

  if (pathname.startsWith("/registration")) {
    return null;
  }

  if (pathname.startsWith("/review-journey/")) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
