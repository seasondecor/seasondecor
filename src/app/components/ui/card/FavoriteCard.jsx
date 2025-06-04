"use client";

import { BorderBox } from "../BorderBox";
import Image from "next/image";
import { FcLike } from "react-icons/fc";
import { IoIosStar } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FootTypo } from "../Typography";
import { MdLocationOn } from "react-icons/md";
import { getSeasonConfig } from "@/app/helpers";
import { CiSquareRemove } from "react-icons/ci";
import { seasons } from "@/app/constant/season";
import { TbShoppingBagCheck } from "react-icons/tb";
import { IoIosPricetag } from "react-icons/io";
import { formatCurrency } from "@/app/helpers";
import { Box } from "@mui/material";

const FavoriteCard = ({
  image,
  name,
  location,
  price,
  rating,
  id,
  slug,
  onRemove,
  isService,
  season,
  onRemoveFavorite,
  onClick,
  madeIn,
  totalSold,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Get the first image URL from the array, or default image if not available
  const imageUrl = (() => {
    if (!image) return "/user-ava.jpg";

    if (Array.isArray(image)) {
      if (image.length === 0) return "/user-ava.jpg";

      // Case 1: Array of objects with imageURL property
      if (image[0].imageURL) return image[0].imageURL;

      // Case 2: Array of direct URL strings
      if (typeof image[0] === "string") return image[0];

      // Case 3: Array with other structure (probably URLs in numbered properties)
      if (typeof image[0] === "object" && image[0]["0"]) return image[0]["0"];

      // Fallback to first item regardless of structure
      return typeof image[0] === "object"
        ? Object.values(image[0])[0]
        : image[0];
    }

    // Case 4: Single string URL
    if (typeof image === "string") return image;

    return "/user-ava.jpg";
  })();

  const handleClick = () => {
    if (slug) {
      router.push(`/`);
    }
  };

  return (
    <BorderBox
      className="relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer dark:hover:shadow-lg dark:shadow-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box position="absolute" top={0} left={5}>
          <CiSquareRemove
            size={30}
            className="hover:bg-rose-500 hover:text-white transition-all duration-300 rounded-lg"
            onClick={onRemoveFavorite}
          />
        </Box>
        {isService ? (
          <Box
            position="absolute"
            top={0}
            right={0}
            width="fit-content"
            borderRadius="10px"
            p={1}
            className="bg-yellow"
          >
            <FootTypo footlabel="Service" fontWeight="bold" />
          </Box>
        ) : (
          <Box
            position="absolute"
            top={0}
            right={0}
            width="fit-content"
            borderRadius="10px"
            p={1}
            className="bg-yellow"
          >
            <FootTypo footlabel="Product" fontWeight="bold" />
          </Box>
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        onClick={onClick}
      >
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name || "Favorite item"}
            fill
            className={`object-cover transition-transform duration-300 rounded-xl ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onClick={handleClick}
          />
          <button
            className="absolute top-2 right-2 bg-white dark:bg-black p-2 rounded-full shadow-md z-10"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(id);
            }}
          >
            <FcLike size={20} />
          </button>
        </div>

        {/* Content */}
        {isService ? (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap={2}
            onClick={handleClick}
          >
            <FootTypo
              footlabel={name}
              fontWeight="bold"
              fontSize="20px"
              mb={1}
            />
            <div className="flex flex-wrap gap-2 items-center">
              {Array.isArray(season) && season.length > 0 ? (
                season.map((seasonItem, index) => {
                  if (!seasonItem || !seasonItem.seasonName) return null;
                  const { icon, bgColor } = getSeasonConfig(
                    seasonItem.seasonName,
                    seasons
                  );
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
                    >
                      {icon}
                      <span>{seasonItem.seasonName}</span>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-500 text-sm">All seasons</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <MdLocationOn size={20} />
              <FootTypo footlabel={location} className="line-clamp-2" />
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-1 mb-2">
                <IoIosStar size={20} />
                <span className="text-sm">{rating || "No ratings"}</span>
              </div>
            </div>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap={2}
            onClick={handleClick}
          >
            <FootTypo
              footlabel={name}
              fontWeight="bold"
              fontSize="20px"
              className="line-clamp-1"
              mb={1}
            />

            <div className="flex items-center gap-2">
              <MdLocationOn size={20} />
              <FootTypo
                footlabel="Made in"
                className="!m-0 text-sm font-semibold"
              />
              <FootTypo
                footlabel={madeIn}
                className="!m-0 text-lg font-semibold "
              />
            </div>

            <div className="flex items-center gap-2">
              <TbShoppingBagCheck size={20} />
              <FootTypo
                footlabel="Total sold"
                className="!m-0 text-sm font-semibold"
              />

              <FootTypo
                footlabel={totalSold}
                className="!m-0 text-lg font-semibold "
              />
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-1 mb-2">
                <IoIosStar size={20} />
                <span className="text-sm">{rating || "No ratings"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IoIosPricetag size={20} />
              <FootTypo
                footlabel="Price"
                className="!m-0 text-sm font-semibold"
              />

              <FootTypo
                footlabel={formatCurrency(price)}
                className="!m-0 text-lg font-semibold "
              />
            </div>
          </Box>
        )}
      </Box>
    </BorderBox>
  );
};

export default FavoriteCard;
