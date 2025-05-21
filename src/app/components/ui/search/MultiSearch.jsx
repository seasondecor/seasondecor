"use client";

import * as React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FootTypo } from "../Typography";
import Divider from "@mui/material/Divider";
import { GiCalendarHalfYear } from "react-icons/gi";
import SearchModal from "./SearchModal";
import { MdDesignServices } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { locations } from "@/app/constant/province";
import { categories } from "@/app/constant/decorCategories";
import { seasons } from "@/app/constant/season";
import { styles } from "@/app/constant/style";
import { useSearchDecorService } from "@/app/queries/service/service.query";
import { IoIosClose } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";

export const MultiSearch = ({ onSearch, onSearchResults }) => {
  const [activeModal, setActiveModal] = React.useState(null);
  const [selectedValues, setSelectedValues] = React.useState({
    sublocation: "",
    category: "",
    season: "",
    design: "",
  });
  const [searchParams, setSearchParams] = React.useState(null);

  // Refs for each search section
  const locationRef = React.useRef(null);
  const categoryRef = React.useRef(null);
  const seasonRef = React.useRef(null);
  const designRef = React.useRef(null);

  // Query for search results
  const {
    data: searchResults,
    isLoading,
  } = useSearchDecorService(searchParams);

  // Effect to handle search results
  React.useEffect(() => {
    if (!isLoading) {
      if (onSearchResults) {
        onSearchResults(searchResults);
      }
    }
  }, [searchResults, isLoading, onSearchResults]);

  const handleOpenModal = (type) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSearch = (label, type, value) => {
    // For season type, handle multiple selections
    if (type === "season") {
      // If multiple seasons are selected, join them with commas
      const seasonLabel = Array.isArray(value) ? value.join(", ") : label;
      setSelectedValues({
        ...selectedValues,
        [type]: seasonLabel,
      });
    } else {
      // For other types, use the label directly
      setSelectedValues({
        ...selectedValues,
        [type]: label,
      });
    }
    handleCloseModal();
  };

  const performSearch = () => {
    // Create API search parameters
    const apiParams = {};
    let hasAnyParam = false;

    // Process selected values for API
    if (selectedValues.sublocation && selectedValues.sublocation !== "All") {
      apiParams.Sublocation = selectedValues.sublocation;
      hasAnyParam = true;
    }

    if (selectedValues.category && selectedValues.category !== "All") {
      apiParams.CategoryName = selectedValues.category;
      hasAnyParam = true;
    }

    if (selectedValues.season && selectedValues.season !== "All") {
      // Split the season string if it contains multiple seasons
      const seasonArray = selectedValues.season.split(",").map((s) => s.trim());
      apiParams.SeasonNames = seasonArray;
      hasAnyParam = true;
    }

    if (selectedValues.design && selectedValues.design !== "All") {
      apiParams.DesignName = selectedValues.design;
      hasAnyParam = true;
    }

    //console.log("Search parameters:", apiParams);

    // Set search parameters for API
    setSearchParams(hasAnyParam ? apiParams : null);

    // If onSearch callback is provided
    if (onSearch) {
      onSearch(selectedValues);
    }
  };

  const resetSearch = () => {
    // Reset all selected values
    setSelectedValues({
      sublocation: "",
      category: "",
      season: "",
      design: "",
    });
    // Reset search parameters
    setSearchParams(null);
    // Clear the active modal if any
    setActiveModal(null);

    // Notify parent components
    if (onSearchResults) {
      onSearchResults(null);
    }
    if (onSearch) {
      onSearch({});
    }
  };

  // Get the current anchor ref based on active modal
  const getCurrentAnchorRef = () => {
    switch (activeModal) {
      case "sublocation":
        return locationRef.current;
      case "category":
        return categoryRef.current;
      case "season":
        return seasonRef.current;
      case "design":
        return designRef.current;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-[60vw] dark:text-black">
      <div className="flex flex-wrap items-stretch justify-between md:justify-center gap-y-1 gap-x-0 bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
        <Divider orientation="vertical" variant="middle" flexItem />
        <div
          ref={locationRef}
          className="w-full sm:w-1/2 md:w-auto flex-1 min-w-[150px] cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal("sublocation")}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <FaMapMarkerAlt size={20} />
            </div>
            <div className="flex flex-col">
              <FootTypo footlabel="Where" />
              <FootTypo
                footlabel={selectedValues.sublocation || "Search by location"}
                className=" truncate max-w-[130px] "
              />
            </div>
          </div>
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div
          ref={categoryRef}
          className="flex-1 w-full md:w-auto relative cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal("category")}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <MdCategory size={20} />
            </div>
            <div className="flex flex-col">
              <FootTypo
                footlabel="Category"
              />
              <FootTypo
                footlabel={selectedValues.category || "Search by category"}
                className="truncate max-w-[130px] "
              />
            </div>
          </div>
        </div>

        <Divider orientation="vertical" variant="middle" flexItem />
        <div
          ref={seasonRef}
          className="flex-1 w-full md:w-auto relative cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal("season")}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <GiCalendarHalfYear size={20} />
            </div>
            <div className="flex flex-col">
              <FootTypo footlabel="Season" />
              <FootTypo
                footlabel={selectedValues.season || "Search by season"}
                className=" truncate max-w-[130px] "
              />
            </div>
          </div>
        </div>

        <Divider orientation="vertical" variant="middle" flexItem />
        <div
          ref={designRef}
          className="flex-1 w-full md:w-auto relative cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal("design")}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <MdDesignServices size={20} />
            </div>
            <div className="flex flex-col">
              <FootTypo footlabel="Design"  />
              <FootTypo
                footlabel={selectedValues.design || "Search by design"}
                className="truncate max-w-[130px] "
              />
            </div>
          </div>
        </div>
        

        <div className="flex w-full sm:w-auto items-center justify-end gap-2 p-2 md:pr-3">
          <div className="w-[36px] flex justify-center">
            {(selectedValues.sublocation ||
              selectedValues.category ||
              selectedValues.season ||
              selectedValues.design) && (
              <button
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={resetSearch}
                title="Clear all"
              >
                <IoIosClose size={20} />
              </button>
            )}
          </div>
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-3 flex items-center justify-center focus:outline-none transition duration-200"
            onClick={performSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading size={24} className="animate-spin" />
            ) : (
              <IoSearchOutline size={24} />
            )}
          </button>
        </div>
      </div>

      <SearchModal
        isOpen={activeModal === "sublocation"}
        onClose={handleCloseModal}
        searchType="sublocation"
        onSearch={(label, type) => handleSearch(label, "sublocation")}
        suggestions={locations}
        title="Search by Province"
        icon={FaMapMarkerAlt}
        anchorEl={getCurrentAnchorRef()}
      />

      <SearchModal
        isOpen={activeModal === "category"}
        onClose={handleCloseModal}
        searchType="category"
        onSearch={handleSearch}
        suggestions={categories}
        title="Search by Category"
        icon={MdCategory}
        anchorEl={getCurrentAnchorRef()}
      />

      <SearchModal
        isOpen={activeModal === "season"}
        onClose={handleCloseModal}
        searchType="season"
        onSearch={handleSearch}
        suggestions={seasons}
        title="Search by Season"
        icon={GiCalendarHalfYear}
        anchorEl={getCurrentAnchorRef()}
      />
      <SearchModal
        isOpen={activeModal === "design"}
        onClose={handleCloseModal}
        searchType="design"
        onSearch={handleSearch}
        suggestions={styles}
        title="Search by Design"
        icon={MdDesignServices}
        anchorEl={getCurrentAnchorRef()}
      />
      
    </div>
  );
};
