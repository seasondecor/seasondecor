"use client";

import React from "react";
import { motion } from "framer-motion";
import { FootTypo } from "@/app/components/ui/Typography";
import { formatDateTime } from "@/app/helpers";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { LuDot } from "react-icons/lu";

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const TrackingDialog = ({ isOpen, onClose, trackingData }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            backgroundImage: "none",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <FootTypo
          footlabel="Tracking Progress"
          fontWeight="bold"
          fontSize="20px"
        />
        <IconButton
          onClick={onClose}
          sx={{
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <IoClose size={24} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3, mt: 2, maxHeight: "70vh" }}>
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {trackingData && trackingData.length > 0 ? (
            <div className="space-y-8">
              {trackingData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline connector */}
                  {index !== trackingData.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}

                  <Box display="flex" gap={4}>
                    {/* Timeline dot */}
                    <Box className="relative flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <FootTypo
                        footlabel={`${index + 1}`}
                        className="text-white font-bold"
                      />
                    </Box>

                    {/* Content */}
                    <Box display="flex" flex={1} flexDirection="column" gap={1}>
                      {/* Timestamp */}
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Alert severity="info" color="success">
                          <Box display="flex" alignItems="center">
                            <FootTypo
                              footlabel="Updated at"
                              className="text-gray-600 dark:text-gray-400"
                              fontWeight="bold"
                              mr={1}
                            />

                            <FootTypo
                              footlabel={formatDateTime(item.createdAt).date}
                              className="text-gray-600 dark:text-gray-400"
                            />
                            <LuDot size={18} />
                            <FootTypo
                              footlabel={formatDateTime(item.createdAt).time}
                              className="text-gray-600 dark:text-gray-400"
                            />
                          </Box>
                        </Alert>
                      </Box>

                      {/* Task */}
                      <Box>
                        <FootTypo footlabel="Main Task" className="mb-2" />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={item.task}
                          placeholder="No task available"
                          disabled
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "grey.100",
                              borderRadius: 4,
                              "& fieldset": {
                                border: "none",
                              },
                              "&.Mui-disabled": {
                                bgcolor: "grey.100",
                                "& .MuiOutlinedInput-input": {
                                  color: "text.primary",
                                  WebkitTextFillColor: "inherit",
                                },
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Note */}
                      <Box>
                        <FootTypo footlabel="Note" className="mb-2" />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={item.note}
                          placeholder="No notes available"
                          disabled
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "grey.100",
                              borderRadius: 4,
                              "& fieldset": {
                                border: "none",
                              },
                              "&.Mui-disabled": {
                                bgcolor: "grey.100",
                                "& .MuiOutlinedInput-input": {
                                  color: "text.primary",
                                  WebkitTextFillColor: "inherit",
                                },
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Images */}
                      {item.images && item.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {item.images.map((img, imgIndex) => (
                            <motion.div
                              key={imgIndex}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: index * 0.1 + imgIndex * 0.1,
                              }}
                              className="relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                              <Image
                                src={img.imageUrl}
                                alt={`Tracking image ${imgIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </div>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={200}
            >
              <FootTypo footlabel="No tracking data available" />
            </Box>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingDialog;
