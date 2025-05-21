"use client";

import Image from "next/image";
import { BodyTypo, FootTypo } from "../Typography";

const ReviewSection = ({ averageRating = 0, totalReviews = 0 }) => {
  return (
    <section className="flex flex-col w-full mt-10 gap-1">
      <div className="flex self-center items-center justify-center mt-10 gap-6">
        <div className="w-auto h-[132px]">
          <Image
            src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png"
            alt="review"
            width={87}
            height={132}
            className="object-cover"
          />
        </div>
        <FootTypo footlabel={averageRating || "0"} className="pb-5" fontSize="100px" fontWeight="bold" />
        <div className="w-auto h-[132px]">
          <Image
            src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png"
            alt="review"
            width={87}
            height={132}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex self-center mt-5">
        <BodyTypo
          bodylabel={`Customer Reviews (${totalReviews})`}
          fontWeight="bold"
        />
      </div>
      <div className="flex flex-col self-center mt-5 max-w-[400px] text-gray-700 dark:text-gray-300">
        <FootTypo
          footlabel="Reviews is a guest favorite based on"
          className=" break-words"
          fontWeight="bold"
        />
        <FootTypo
          footlabel="ratings, reviews, and reliability"
          className=" break-words self-center"
          fontWeight="bold"
        />
      </div>
    </section>
  );
};

export default ReviewSection;
