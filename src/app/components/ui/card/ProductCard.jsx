"use client";

import Image from "next/image";
import React from "react";
import { CardContainer, CardBody, CardItem } from "./components/3dCard";
import { FootTypo } from "../Typography";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/app/helpers";
import { Rating, Box } from "@mui/material";

const ProductCard = ({ image, productName, rate, price, totalSold, href }) => {
  const router = useRouter();

  const processedImages = React.useMemo(() => {
    if (!image) return [];
    if (typeof image === "string") return [image];
    if (Array.isArray(image)) return image;
    if (image.imageUrls && Array.isArray(image.imageUrls))
      return image.imageUrls;
    return [];
  }, [image]);

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  // If no images are available, show a placeholder
  if (processedImages.length === 0 && typeof image !== "object") {
    processedImages.push("/placeholder-image.jpg");
  }

  return (
    <div className="w-full">
      <CardContainer className="cursor-pointer" onClick={handleClick}>
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-fit h-full rounded-xl p-2 border">
          <CardItem translateZ="100" className="w-full relative">
            {/* Card thumbnail - show just the first image */}
            {processedImages.length > 0 ? (
              <Image
                src={processedImages[0]}
                width={1000}
                height={1000}
                className="h-[200px] object-cover rounded-xl group-hover/card:shadow-xl"
                alt={productName || "Product image"}
              />
            ) : (
              <div className="h-[200px] w-full bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </CardItem>
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            <CardItem translateZ="50" className="w-full">
              <h3 className="text-lg font-bold text-neutral-600 dark:text-white break-words line-clamp-2 min-h-[48px] text-ellipsis">
                {productName}
              </h3>
            </CardItem>
            <CardItem translateZ="50" className="w-full">
              <Rating
                value={rate || 4.8}
                precision={0.1}
                readOnly
                size="small"
              />
            </CardItem>

            <CardItem
              translateZ="50"
              className="flex flex-row items-center justify-between w-full"
            >
              <FootTypo
                footlabel={formatCurrency(price)}
                fontWeight="bold"
                fontSize="16px"
              />
              <FootTypo footlabel={`${totalSold} sold`} />
            </CardItem>
          </Box>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default ProductCard;
