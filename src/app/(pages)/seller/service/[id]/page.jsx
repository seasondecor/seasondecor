"use client";

import React from "react";
import { useParams } from "next/navigation";
import SellerWrapper from "../../components/SellerWrapper";
import { useGetDecorServiceById } from "@/app/queries/service/service.query";
import { useGetListReviewByService } from "@/app/queries/list/review.list.query";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { getSeasonConfig } from "@/app/helpers";
import { seasons } from "@/app/constant/season";
import Image from "next/image";
import {
  Box,
  Paper,
  Chip,
  Rating,
  Alert,
  Typography,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  MdCategory,
  MdLocationOn,
  MdOutlineDescription,
  MdPalette,
  MdFavorite,
} from "react-icons/md";
import { LuLayoutList } from "react-icons/lu";
import ThemePalette from "@/app/components/ui/themePalette/ThemePalatte";
import DesignStyle from "@/app/components/ui/designStyle/DesignStyle";
import AmenityOfferings from "@/app/(pages)/booking/components/AmenityOffering";
import ReviewCard from "@/app/components/ui/card/ReviewCard";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import OverallRating from "@/app/components/ui/review/OverallRating";
import { TbArrowLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";

// Service Detail Skeleton Component
const ServiceDetailSkeleton = () => (
  <Box className="space-y-6">
    <Skeleton variant="text" width={300} height={40} />
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" height={400} className="rounded-lg" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 6, md: 6 }} key={i}>
              <Skeleton
                variant="rectangular"
                height={195}
                className="rounded-lg"
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
    <Box className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={60}
          className="rounded-lg"
        />
      ))}
    </Box>
  </Box>
);

const ServiceDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: serviceData, isLoading } = useGetDecorServiceById(id);
  const { data: review, isLoading: isReviewsLoading } =
    useGetListReviewByService(id);

  const reviewData = review?.data || [];

  if (isLoading) {
    return (
      <SellerWrapper>
        <ServiceDetailSkeleton />
      </SellerWrapper>
    );
  }

  if (!serviceData) {
    return (
      <SellerWrapper>
        <Alert severity="error">Service not found</Alert>
      </SellerWrapper>
    );
  }

  return (
    <SellerWrapper>
      <Box>
        <button
          className="flex items-center gap-1 mb-5"
          onClick={() => router.back()}
        >
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" />
        </button>

        <Box className="space-y-6">
          {/* Header Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            px={2}
          >
            <Box>
              <BodyTypo
                bodylabel={serviceData.style}
                className="text-2xl font-bold mb-2"
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Rating
                  value={review?.averageRate || 0}
                  readOnly
                  precision={0.5}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({review?.totalCount || 0} reviews)
                </Typography>
              </Box>
            </Box>
            <StatusChip status={serviceData.status} isService={true} />
          </Box>

          {/* Image Gallery */}
          <Paper
            elevation={0}
            className="p-4 rounded-xl dark:bg-transparent dark:text-white "
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="relative h-[400px] overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  {serviceData.images?.[0] && (
                    <Image
                      src={serviceData.images[0].imageURL}
                      alt="Primary service image"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  {serviceData.images?.slice(1, 5).map((img, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Box className="relative h-[195px] overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <Image
                          src={img.imageURL}
                          alt={`Service image ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                          sizes="25vw"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Service Stats */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                variant="outlined"
                className="hover:shadow-md transition-shadow duration-300"
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box className="p-2 rounded-full bg-rose-50 dark:bg-rose-900/20">
                      <MdFavorite size={24} className="text-rose-500" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Favorites
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        {serviceData.favoriteCount || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                variant="outlined"
                className="hover:shadow-md transition-shadow duration-300"
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                      <Rating
                        value={review?.averageRate || 0}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Reviews
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        {review?.totalCount || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Service Details */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Basic Info */}
              <Paper
                elevation={0}
                className="p-6 rounded-xl space-y-4 mb-4 dark:bg-transparent dark:text-white "
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box className="p-2 rounded-full bg-primary/10">
                    <MdCategory size={24} />
                  </Box>
                  <Typography variant="subtitle1" className="font-medium">
                    Category:
                  </Typography>
                  <Chip
                    label={serviceData.categoryName || "Uncategorized"}
                    variant="outlined"
                    className="bg-white dark:bg-transparent dark:text-white"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Box className="p-2 rounded-full bg-primary/10">
                    <MdLocationOn size={24} />
                  </Box>
                  <Typography variant="subtitle1" className="font-medium">
                    Service Location:
                  </Typography>
                  <Chip
                    label={serviceData.sublocation || "Not specified"}
                    variant="outlined"
                    className="bg-white dark:bg-transparent dark:text-white"
                  />
                </Box>

                <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" className="font-medium">
                    Seasons:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {serviceData.seasons?.map((season, index) => {
                      const { icon, bgColor } = getSeasonConfig(
                        season.seasonName,
                        seasons
                      );
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
                        >
                          {icon}
                          {season.seasonName}
                        </div>
                      );
                    })}
                  </Box>
                </Box>
              </Paper>

              {/* Description */}
              <Paper
                elevation={0}
                className="p-6 rounded-xl mb-4 dark:bg-transparent dark:text-white "
              >
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Box className="p-2 rounded-full ">
                    <MdOutlineDescription size={24} />
                  </Box>
                  <Typography variant="h6" className="font-bold">
                    Description
                  </Typography>
                </Box>
                <div
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: serviceData.description || "",
                  }}
                />
              </Paper>

              {/* Design Styles */}
              <Paper
                elevation={0}
                className="p-6 rounded-xl mb-4 dark:bg-transparent dark:text-white "
              >
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box className="p-2 rounded-full ">
                    <LuLayoutList size={24} />
                  </Box>
                  <Typography variant="h6" className="font-bold">
                    Design Styles
                  </Typography>
                </Box>
                {serviceData.designs && serviceData.designs.length > 0 ? (
                  <DesignStyle styles={serviceData.designs} />
                ) : (
                  <Alert severity="info">No design styles specified</Alert>
                )}
              </Paper>

              {/* Theme Colors */}
              <Paper
                elevation={0}
                className="p-6 rounded-xl mb-4 dark:bg-transparent dark:text-white "
              >
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box className="p-2 rounded-full ">
                    <MdPalette size={24} />
                  </Box>
                  <Typography variant="h6" className="font-bold">
                    Color Palette
                  </Typography>
                </Box>
                {serviceData.themeColors &&
                serviceData.themeColors.length > 0 ? (
                  <ThemePalette colors={serviceData.themeColors} />
                ) : (
                  <Alert severity="info">No color palette specified</Alert>
                )}
              </Paper>

              {/* Offerings */}
              <Paper
                elevation={0}
                className="p-6 rounded-xl dark:bg-transparent dark:text-white "
              >
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box className="p-2 rounded-full ">
                    <LuLayoutList size={24} />
                  </Box>
                  <Typography variant="h6" className="font-bold">
                    Service Offerings
                  </Typography>
                </Box>
                <AmenityOfferings offerings={serviceData.offerings} />
              </Paper>
            </Grid>

            {/* Reviews Section */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                className="p-6 rounded-xl sticky top-20 dark:bg-transparent dark:text-white "
              >
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                  <Box className="p-2 rounded-full ">
                    <MdOutlineDescription size={24} />
                  </Box>
                  <Typography variant="h6" className="font-bold">
                    Reviews & Ratings
                  </Typography>
                </Box>

                {isReviewsLoading ? (
                  <Box className="space-y-4">
                    <Skeleton variant="rectangular" height={100} />
                    <Skeleton variant="rectangular" height={100} />
                  </Box>
                ) : (
                  <>
                    <OverallRating
                      overallRating={review?.averageRate || 0}
                      rateCount={
                        review?.rateCount || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                      }
                      totalReviews={review?.totalCount || 0}
                    />

                    <Box className="space-y-4 max-h-[600px] overflow-y-auto mt-6 pr-2">
                      <DataMapper
                        data={reviewData}
                        Component={ReviewCard}
                        emptyStateComponent={
                          <EmptyState title="No reviews yet" />
                        }
                        getKey={(review) => review.id}
                        componentProps={(review) => ({
                          id: review.id,
                          comment: review.comment,
                          rate: review.rate,
                          createAt: review.createAt,
                          images: review.images?.map((img) => img) || [],
                          username: review.name || "User",
                          userAvatar: review.avatar || "",
                        })}
                        useGrid={false}
                        containerClassName="space-y-4"
                      />
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </SellerWrapper>
  );
};

export default ServiceDetailPage;
