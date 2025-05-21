"use client";

import React, { useState, useEffect } from "react";
import AuroraBg from "@/app/components/ui/animated/AuroraBg";
import { useGetListDecorService } from "@/app/queries/list/service.list.query";
import DataMapper from "@/app/components/DataMapper";
import ServiceCard from "@/app/components/ui/card/ServiceCard";
import EmptyState from "@/app/components/EmptyState";
import RollingGallery from "@/app/components/ui/animated/RollingGallery";
import Container from "@/app/components/layouts/Container";
import { MultiSearch } from "@/app/components/ui/search/MultiSearch";
import { generateSlug } from "@/app/helpers";
import { Skeleton } from "@mui/material";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

// ServiceCardSkeleton component to display while loading
const ServiceCardSkeleton = () => {
  return (
    <div className="mb-10 grid w-full grid-cols-1 md:grid-cols-4 gap-4 px-4 xl:px-0 hover:shadow-lg transition-shadow duration-300 rounded-lg p-4">
      <div className="order-last md:order-first flex flex-col gap-2 space-y-4 p-4">
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="rounded" width="40%" height={36} />

        <div className="flex flex-col gap-2">
          <Skeleton variant="text" width="50%" height={20} />
          <div className="flex flex-wrap gap-2">
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={80} height={28} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </div>

        <Skeleton variant="rounded" width={120} height={40} />
      </div>

      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        </div>
      ))}
    </div>
  );
};

const BookingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: listDecorService,
    isLoading: isInitialLoading,
  } = useGetListDecorService({
    pageIndex: currentPage,
    pageSize: pageSize,
    // Force pagination to be used for all requests
    forcePagination: true,
  });

  // State to hold search results
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Calculate correct total pages based on totalCount and pageSize
  const totalCount = listDecorService?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search results
  const handleSearchResults = (results) => {
    setIsSearching(false);
    if (results === null) {
      setHasSearched(false);
      setSearchResults(null);
      setCurrentPage(1); // Reset to page 1
      return;
    }
    setSearchResults(results);
    setHasSearched(true);
  };

  // Handle pagination change
  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Data to display (either search results or current page data)
  const displayData = hasSearched
    ? searchResults?.data
    : listDecorService?.data || [];

  const isLoading = isInitialLoading || isSearching;

  return (
    <>
      <AuroraBg
        colorStops={["#5fc1f1", "#5fc1f1", "#5fc1f1"]}
        blend={1}
        amplitude={0}
        speed={0}
      >
        <div className="absolute pb-40 pt-10 md:pt-20 px-2 w-full md:px-4 lg:px-8">
          <div className="relative pb-4 md:pb-20 flex flex-col items-center justify-center px-8 md:px-8 w-full">
            <div className="relative flex flex-col items-center justify-center w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 mt-20 relative text-center max-w-6xl mx-auto !leading-snug dark:text-white">
                Explore All Decor Services
                <span>
                  <br className="hidden md:block" />
                </span>
              </h1>
              <h2 className="relative font-regular text-base md:text-xl tracking-wide mb-8 text-center max-w-3xl mx-auto antialiased">
                With an intuitive interface, users can browse through a range of
                services, view detailed provider profiles, and check
                availability in real-time. The page includes essential features
                such as search and filtering options, provider ratings and
                reviews, and secure payment integrations for a smooth booking
                experience
              </h2>
              <div className="flex relative sm:flex-row flex-col space-y-2 justify-center dark:text-white sm:space-y-0 sm:space-x-4 sm:justify-center mb-4 w-full"></div>

              <div
                className={`flex items-center justify-center w-full max-w-[1000px] mx-auto pb-5 transition-all duration-300 ease-in-out ${
                  isSticky
                    ? "fixed top-1 left-0 right-0 z-[50] max-w-[55vw] !p-0"
                    : ""
                }`}
              >
                <MultiSearch
                  onSearchResults={handleSearchResults}
                  onSearch={() => {
                    setIsSearching(true);
                    setHasSearched(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </AuroraBg>

      <RollingGallery autoplay={true} pauseOnHover={false} />
      <div className="bg-[linear-gradient(to_right,transparent_1%,var(--gray-50)_10%,var(--gray-50)_90%,transparent_99%)] pb-20 dark:bg-[linear-gradient(to_right,transparent_0%,var(--neutral-900)_10%,var(--neutral-900)_90%,transparent_100%)]">
        <Container>
          <div className="flex flex-col gap-10 md:gap-20">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ServiceCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <>
                {!displayData || displayData.length === 0 ? (
                  <EmptyState
                    title={
                      hasSearched
                        ? "No services found matching your search"
                        : "No decor services available"
                    }
                    description={
                      hasSearched
                        ? "Try adjusting your search criteria"
                        : "Please check back later"
                    }
                  />
                ) : (
                  <>
                    <DataMapper
                      data={displayData}
                      Component={ServiceCard}
                      getKey={(service) => service.id}
                      componentProps={(service) => ({
                        style: service.style,
                        description: service.description,
                        images: service.images,
                        id: service.id,
                        seasons: service.seasons,
                        category: service.categoryName,
                        province: service.sublocation,
                        href: `/booking/${generateSlug(service.style)}`,
                        designStyle: service.designs,
                      })}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      enforcePagination={true}
                    />
                  </>
                )}
              </>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  currentPage > 1 && handlePaginationChange(currentPage - 1)
                }
                disabled={currentPage <= 1}
                className="p-1 border rounded-full disabled:opacity-50"
              >
                <IoIosArrowBack size={20} />
              </button>
              <span className="flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  currentPage < totalPages &&
                  handlePaginationChange(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
                className="p-1 border rounded-full disabled:opacity-50"
              >
                <IoIosArrowForward size={20} />
              </button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default BookingPage;
