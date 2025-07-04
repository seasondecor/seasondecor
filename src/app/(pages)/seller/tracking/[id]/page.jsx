"use client";

import React, { useState, useEffect } from "react";
import SellerWrapper from "../../components/SellerWrapper";
import {
  useAddTracking,
  useUpdateTracking,
  useGetTrackingByBookingCode,
} from "@/app/queries/tracking/tracking.query";
import { useParams, useRouter } from "next/navigation";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { TbArrowLeft, TbEdit, TbEye } from "react-icons/tb";
import { toast } from "sonner";
import TrackingForm from "../components/TrackingForm";
import DataMapper from "@/app/components/DataMapper";
import TrackingCard from "@/app/components/ui/card/TrackingCard";
import Button from "@/app/components/ui/Buttons/Button";
import EmptyState from "@/app/components/EmptyState";
import useDeleteConfimModal from "@/app/hooks/useDeleteConfirmModal";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import { LuFileCheck } from "react-icons/lu";
import { useChangeBookingStatus } from "@/app/queries/book/book.query";

const TrackingPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const deleteConfirmModal = useDeleteConfimModal();

  // React states
  const [isEditMode, setIsEditMode] = useState(false);
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // API hooks
  const {
    data: trackingData,
    isPending: trackingLoading,
    isError,
  } = useGetTrackingByBookingCode(id);
  const { mutate: updateTracking, isPending } = useUpdateTracking();
  const { mutate: addTracking, isPending: addPending } = useAddTracking();
  const { mutate: changeBookingStatus, isPending: statusChangePending } =
    useChangeBookingStatus();

  // Set edit mode if no tracking data
  useEffect(() => {
    if (!trackingData) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [trackingData]);

  if (isError) {
    console.log("Failed to fetch tracking data");
  }

  // Handle image uploads
  const handleImageUpload = (e) => {
    // Check if the event is coming from the ImageUpload component
    if (Array.isArray(e)) {
      // Direct array of files from ImageUpload
      if (images.length + e.length > 5) {
        toast.error("You can only upload a maximum of 5 images");
        return;
      }

      const newImages = e.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      }));
      setImages((prev) => [...prev, ...newImages]);
    } else if (e.target && e.target.files) {
      // Traditional file input
      const files = Array.from(e.target.files);

      // Check if adding new images would exceed the limit of 5
      if (images.length + files.length > 5) {
        toast.error("You can only upload a maximum of 5 images");
        return;
      }

      if (files.length > 0) {
        const newImages = files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          isNew: true,
        }));
        setImages((prev) => [...prev, ...newImages]);
      }
    }
  };

  // Remove an image from the list
  const removeImage = (index) => {
    // If we received updated list of images instead of an index
    if (Array.isArray(index)) {
      // Replace entire images array with the new filtered list
      setImages(index);
      return;
    }

    // Traditional index-based removal
    const imageToRemove = images[index];

    // If it's an existing image with an ID, add it to the removedImageIds array
    if (imageToRemove && imageToRemove.id) {
      setRemovedImageIds((prev) => [...prev, imageToRemove.id]);
    }

    // Release URL object if it's a blob URL
    if (
      imageToRemove &&
      imageToRemove.preview &&
      typeof imageToRemove.preview === "string" &&
      imageToRemove.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Remove the image from the images array
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  // Form submission handler
  const onSubmit = async (formData) => {
    try {
      //console.log("Form submission with data:", formData);
      //console.log("Current images:", images);
      //console.log("Removed image IDs:", removedImageIds);

      const apiFormData = new FormData();

      // Handle task and note text - coming from TipTap editors
      apiFormData.append("task", formData.task || "");
      apiFormData.append("note", formData.note || "");

      // Handle image IDs to remove
      if (removedImageIds.length > 0) {
        removedImageIds.forEach((id) => {
          apiFormData.append(`ImageIds`, id);
        });
      }

      // Handle new image uploads - only include images that have file property
      const newImages = images.filter((img) => img.isNew && img.file);
      if (newImages.length > 0) {
        newImages.forEach((image) => {
          apiFormData.append(`Images`, image.file);
        });
      }

      if (selectedTracking) {
        // Update existing tracking
        updateTracking(
          {
            trackingId: selectedTracking.id,
            formData: apiFormData,
          },
          {
            onSuccess: () => {
              setModalOpen(false);
              setSelectedTracking(null);
              setRemovedImageIds([]);
              setImages([]);
            },
            onError: (error) => {
              //console.error("Error updating tracking:", error);
              toast.error(
                error.message || "Failed to update tracking information"
              );
            },
          }
        );
      } else {
        // Add new tracking
        addTracking(
          {
            formData: apiFormData,
            bookingCode: id,
          },
          {
            onSuccess: () => {
              setIsEditMode(false);
              setImages([]);
              toast.success("Tracking added successfully");
            },
            onError: (error) => {
              //console.error("Error handling tracking:", error);
              toast.error(
                error.message || "Failed to process tracking information"
              );
            },
          }
        );
      }
    } catch (error) {
      //console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Reset images when entering edit mode
      setImages([]);
      setRemovedImageIds([]);
    }
  };

  const handleEditClick = (tracking) => {
    setSelectedTracking(tracking);
    setRemovedImageIds([]);

    if (tracking.images && tracking.images.length > 0) {
      // Properly format images with IDs for editing
      const formattedImages = tracking.images
        .map((image) => {
          // Check if image is an object with required properties
          if (typeof image === "object" && image !== null) {
            // First attempt to get imageUrl from the image object
            const imageUrl =
              image.imageURL || image.imageUrl || image.url || "";
            // console.log("Processing image object:", image, "Found URL:", imageUrl);

            return {
              id: image.id,
              url: imageUrl,
              preview: imageUrl,
              file: null,
              isExisting: true,
            };
          } else if (typeof image === "string") {
            // If image is a direct URL string
            // console.log("Processing image string:", image);
            return {
              url: image,
              preview: image,
              file: null,
              isExisting: true,
            };
          }

          // Fallback
          return null;
        })
        .filter(Boolean); // Remove any null entries

      //console.log("Formatted images for edit:", formattedImages);
      setImages(formattedImages);
    } else {
      setImages([]);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTracking(null);
    setImages([]);
    setRemovedImageIds([]);
  };

  const handleCompleteTrackingClick = () => {
    setCompleteDialogOpen(true);
  };

  const handleCompleteTrackingConfirm = () => {
    if (!agreedToTerms) {
      toast.error("You must agree to the regulations to proceed");
      return;
    }

    changeBookingStatus(
      id,

      {
        onSuccess: () => {
          setCompleteDialogOpen(false);
          setAgreedToTerms(false);
          router.push("/seller/request");
        },
        onError: (error) => {
          //console.error("Error completing tracking:", error);
          toast.error(error.message || "Failed to complete tracking");
        },
      }
    );
  };

  return (
    <SellerWrapper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <button
          className="flex items-center gap-1 w-fit"
          onClick={() => router.back()}
        >
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" />
        </button>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <BodyTypo
            bodylabel={
              isEditMode
                ? "Update Tracking Information"
                : "Tracking Information"
            }
            className="text-xl"
          />
          <Box
            display="flex"
            alignItems="center"
            bg="primary.100"
            px={3}
            py={1}
            borderRadius="full"
          >
            <FootTypo
              footlabel={`Booking: ${id}`}
              fontWeight="bold"
              fontSize="1rem"
              className="bg-primary rounded-lg p-2"
            />
          </Box>
        </Box>

        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <Button
            label="Complete Tracking"
            icon={<LuFileCheck size={18} />}
            onClick={handleCompleteTrackingClick}
            className="bg-action text-white"
            disabled={
              statusChangePending ||
              !trackingData ||
              trackingData.length === 0 ||
              isEditMode
            }
          />
          <Button
            label={isEditMode ? "View" : "Add New Tracking"}
            icon={isEditMode ? <TbEye size={18} /> : <TbEdit size={18} />}
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-full ${
              isEditMode ? "bg-blue-500" : "bg-primary"
            }`}
          />
        </Box>
      </Box>

      <div className="w-full">
        {isEditMode ? (
          <TrackingForm
            onSubmit={onSubmit}
            defaultValues={{
              task: trackingData?.task || "",
              note: trackingData?.note || "",
            }}
            images={images}
            isPending={isPending || addPending}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <DataMapper
              data={trackingData}
              Component={TrackingCard}
              getKey={(item) => item.id}
              loading={trackingLoading}
              emptyStateComponent={
                <EmptyState
                  title="No tracking data"
                  subtitle="Start create one"
                />
              }
              componentProps={(tracking) => ({
                note: tracking.note || "",
                task: tracking.task || "",
                imageUrls: tracking.images
                  ? tracking.images.map((img) => {
                      // Handle different possible image formats
                      if (typeof img === "object") {
                        return img.imageUrl || img.imageURL || img.url || "";
                      }
                      return img;
                    })
                  : [],
                createdAt: tracking.createdAt,
                editClick: () => handleEditClick(tracking),
                removeClick: () =>
                  deleteConfirmModal.onOpen(
                    "tracking",
                    tracking.id,
                    "tracking"
                  ),
              })}
            />
          </div>
        )}
      </div>

      {/* MUI Modal for editing tracking */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        disableScrollLock={true}
      >
        <DialogTitle className="flex justify-between items-center">
          <FootTypo footlabel="Edit Tracking Information" className="text-xl" />
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTracking && (
            <TrackingForm
              onSubmit={onSubmit}
              defaultValues={{
                task: selectedTracking.task || "",
                note: selectedTracking.note || "",
              }}
              images={images}
              isPending={isPending}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Tracking Confirmation Dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center bg-action text-white">
          <FootTypo footlabel="Complete Tracking Process" className="text-xl" />
          <IconButton
            onClick={() => setCompleteDialogOpen(false)}
            size="small"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="py-4 space-y-5">
            <BodyTypo
              bodylabel="Important Information About Completing Your Tracking"
              className="text-lg font-bold"
            />

            <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-action space-y-3">
              <FootTypo
                footlabel="By completing the tracking process, you acknowledge that:"
                className="font-semibold"
              />
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All services have been completed successfully as specified in
                  the booking agreement.
                </li>
                <li>
                  All required evidence (images, documents, etc.) has been
                  uploaded.
                </li>
                <li>
                  The client will be notified that the service is complete and
                  ready for payment.
                </li>
                <li>
                  You will not be able to add more tracking information after
                  completion.
                </li>
                <li>
                  Upon payment, the system will process your payout according to
                  the platform's terms.
                </li>
              </ul>
            </div>

            <Alert severity="warning">
              <FootTypo footlabel="Important Notice" fontWeight="bold" />
              Marking a service as complete without fulfilling all requirements
              may result in disputes, delayed payments, or account penalties.
              Make sure all work is properly documented before proceeding.
            </Alert>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label="I confirm that I have completed all services and understand the terms outlined above."
              />
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions className="p-4 flex justify-between">
          <Button
            label="Cancel"
            onClick={() => {
              setCompleteDialogOpen(false);
              setAgreedToTerms(false);
            }}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          />
          <Button
            label="Complete Tracking"
            icon={<LuFileCheck size={18} />}
            onClick={handleCompleteTrackingConfirm}
            className="bg-action text-white"
            disabled={!agreedToTerms || statusChangePending}
          />
        </DialogActions>
      </Dialog>
    </SellerWrapper>
  );
};

export default TrackingPage;
