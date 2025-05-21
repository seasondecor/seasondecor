"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useGetAccountDetails } from "../queries/user/user.query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  setUserSlug,
  setUserLocationCode,
  setUserLocationProvince,
} from "../lib/redux/reducers/userSlice";
import Image from "next/image";
import LocationModal from "../components/ui/Modals/LocationModal";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const accountId = session?.accountId;
  const router = useRouter();
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { data: user, isLoading, isError } = useGetAccountDetails(accountId);

  useEffect(() => {
    if (session?.error) {
      toast.error(session.error, {
        id: "session-error",
      });
    }
  }, [session?.error]);

  useEffect(() => {
    if (isError) {
      toast.error("Session expired or server is unavailable. Logging out...", {
        id: "session-expired",
      });

      // Sign out and redirect
      signOut({ redirect: false }).then(() => {
        router.push("/authen/login");
      });
    }
  }, [isError, router]);

  useEffect(() => {
    if (!user) return;

    const isUserSelf = Number(user.id) === Number(accountId);

    //const isProvider = user.providerVerified;

    if (isUserSelf) {
      dispatch(setUserSlug(user.slug));
    }

    if (user.location === "") {
      setLocationModalOpen(true);
    }

    if (user.location && user.provinceCode) {
      dispatch(setUserLocationProvince(user.location));
      dispatch(setUserLocationCode(user.provinceCode));
    }

    // Routing logic moved to middleware.js
  }, [user, dispatch, accountId]);

  const handleLocationModalClose = () => {
    setLocationModalOpen(false);
  };

  const handleLocationUpdateSuccess = () => {
    // Refresh the user data or update state as needed
    if (user && user.location) {
      dispatch(setUserLocationProvince(user.location));
      dispatch(setUserLocationCode(user.provinceCode));
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Image
          src="/gif/loading.gif"
          alt="loading"
          width={150}
          height={150}
          priority
          unoptimized
        />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, isError }}>
      {children}
      <LocationModal 
        isOpen={locationModalOpen}
        onClose={handleLocationModalClose}
        onSuccessUpdate={handleLocationUpdateSuccess}
      />
    </UserContext.Provider>
  );
}

//Custom Hook to Access User Data
export function useUser() {
  return useContext(UserContext);
}
