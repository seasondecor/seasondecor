"use client";
import React from "react";
import { FootTypo, BodyTypo } from "../Typography";
import Button from "../Buttons/Button";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { seasons } from "@/app/constant/season";
import { getSeasonConfig } from "@/app/helpers";
import StatusChip from "../statusChip/StatusChip";
import DesignStyle from "../designStyle/DesignStyle";
import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

const ServiceCard = ({
  href = "",
  style,
  province,
  images = [],
  seasons: serviceSeasons = [],
  category,
  isAvailable = false,
  designStyle = [],
}) => {
  const displayedImages = [...images, ...images, ...images].slice(0, 3);

  return (
    <Link href={href}>
      <Paper
        elevation={0}
        className="dark:text-white"
        sx={{
          p: 2,
          backgroundColor: "transparent",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 3,
          },
        }}
      >
        <Grid container spacing={3}>
          {/* Content Section */}
          <Grid xs={12} width="100%">
            <Box display="flex">
              <Box display="flex" flexDirection="column" gap={2} width="100%">
                {/* Title and Category */}
                <Box display="flex" justifyContent="space-between">
                  <FootTypo
                    footlabel={category}
                    sx={{
                      bgcolor: "grey.800",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      display: "inline-block",
                    }}
                  />
                  {/* Action Button */}
                  {isAvailable ? (
                    <StatusChip status={isAvailable} isService={true} />
                  ) : (
                    <Button
                      className="w-fit h-fit"
                      label="View details"
                      icon={<IoIosArrowForward size={20} />}
                    />
                  )}
                </Box>
                <Box>
                  <BodyTypo
                    bodylabel={style}
                    className="truncate max-w-[50vh] tracking-tight"
                    fontSize="24px"
                  />
                </Box>

                {/* Seasons */}
                <Box
                  display="flex"
                  flexDirection="column"
                  flexWrap="wrap"
                  gap={1}
                  alignItems="start"
                >
                  <FootTypo footlabel="Suitable for" fontWeight="bold" />
                  <Box
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                    gap={1}
                    alignItems="center"
                  >
                    {serviceSeasons.map((season, index) => {
                      const { icon, bgColor } = getSeasonConfig(
                        season.seasonName,
                        seasons
                      );
                      return (
                        <Box
                          key={index}
                          className={`${bgColor}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 4,
                            color: "white",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          }}
                        >
                          {icon}
                          {season.seasonName}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Design Styles */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  flexWrap="wrap"
                  gap={1}
                >
                  <FootTypo footlabel="Design Style" fontWeight="bold" />
                  <Box width="100%">
                    <DesignStyle styles={designStyle} compact />
                  </Box>
                </Box>

                {/* Location */}
                <Box display="flex" alignItems="center" gap={1}>
                  <MdLocationOn size={20} />
                  <FootTypo footlabel={province} fontWeight="bold" />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Images Gallery */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
              {displayedImages.map((img, index) => (
                <Grid size={{ xs: 12, sm: 4 }} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "4/3",
                      width: "100%",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <Image
                      src={img.imageURL}
                      alt={`service-${index}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      className="object-cover transition-transform duration-300"
                      priority={index === 0}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
};

export default ServiceCard;
