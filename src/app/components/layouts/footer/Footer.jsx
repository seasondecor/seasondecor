"use client"
import Logo from "../../Logo";
import Link from "next/link";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isSeller= pathname.startsWith("/seller/");
  const isAdmin= pathname.startsWith("/admin/");
  const isPay= pathname === "/user/account/topup" || pathname === "/payment/success" || pathname === "/payment/failure";
  const isSign= pathname.startsWith("/sign");
  const isRegistration= pathname.startsWith("/registration");
  const isReviewJourney= pathname.startsWith("/review-journey/");

  if (isSeller) {
    return null;
  }

  if (isPay) {
    return null;
  }

  if (isSign) {
    return null;
  }

  if (isRegistration) {
    return null;
  }

  if (isAdmin) {
    return null;
  }

  if (isReviewJourney) {
    return null;
  }

  return (
    <footer className="relative z-10 border-t border-neutral-100 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="px-8 py-20">
        <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start">
          <div>
            <div className="mr-4 md:flex mb-4 flex flex-col">
              <Logo />
              <p className="text-slate-500 my-4 text-sm font-light text-left">
                © 2025 Seasonal House Decor <br />
                All rights reserved.
              </p>
              <Link
                href="#"
                className="text-slate-500 mb-4 text-sm font-light text-left hover:text-[#38bdf8] transition-colors"
              >
                contact@seasonhousedecor.com
              </Link>
              <div className="text-sm flex space-x-4 items-center font-light text-left text-slate-500 mb-8 lg:mb-0">
                <Link href="#" className="hover:text-[#38bdf8] transition-colors">
                  <FaFacebook size={20} />
                </Link>
                <Link href="#" className="hover:text-[#38bdf8] transition-colors">
                  <FaInstagram size={20} />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
            <div className="flex justify-center space-y-4 flex-col mt-4">
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Pricing
              </Link>
              <Link href="/provider" className="transition-colors hover:text-[#38bdf8]">
                Providers
              </Link>
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Categories
              </Link>
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Blog
              </Link>
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Showcase
              </Link>
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Facebook
              </Link>
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Instagram
              </Link>
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Pro
              </Link>
              <Link href="#" className="transition-colors hover:text-[#38bdf8]">
                Execlusive
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
