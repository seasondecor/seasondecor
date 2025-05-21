"use client";

import React, { useState } from "react";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Box,
  FormControl,
  Divider,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Button from "@/app/components/ui/Buttons/Button";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegTimesCircle } from "react-icons/fa";
import { MdErrorOutline, MdArrowBack } from "react-icons/md";
import { useRouter, useParams } from "next/navigation";
import Container from "@/app/components/layouts/Container";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { TbFileText } from "react-icons/tb";
import { useGetCancelType } from "@/app/queries/type/cancel.type.query";
import {
  useRequestToChangeQuotation,
  useRequestToCancelQuotation,
} from "@/app/queries/quotation/quotation.query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetQuotationDetailByCustomerId } from "@/app/queries/quotation/quotation.query";

// Define validation schema
const schema = yup.object().shape({
  reason: yup.string().required("Please select a reason"),
  comment: yup.string().required("Please provide details about your request"),
  cancelTypeId: yup.string().when("reason", {
    is: "cancel",
    then: () => yup.string().required("Please select a cancellation reason"),
    otherwise: () => yup.string(),
  }),
});

const QuotationChangeRequestView = ({ onClose }) => {
  const router = useRouter();
  const params = useParams();
  const quotationCode = params.slug;

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    handleSubmit: submitForm,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: "disagree",
      comment: "",
      cancelTypeId: "",
    },
  });

  const reason = watch("reason");

  const { data: quotationDetail, isLoading: isQuotationDetailLoading } =
    useGetQuotationDetailByCustomerId(quotationCode);

  const {
    mutate: requestToChangeQuotation,
    isPending: isRequestingToChangeQuotation,
  } = useRequestToChangeQuotation();

  const {
    mutate: requestToCancelQuotation,
    isPending: isRequestingToCancelQuotation,
  } = useRequestToCancelQuotation();

  // Fetch cancel types
  const { data: cancelTypes, isLoading: isLoadingCancelTypes } =
    useGetCancelType(true);

  // Handle reason change
  const handleReasonChange = (e) => {
    setValue("reason", e.target.value);
    // Reset cancel type when changing away from cancel
    if (e.target.value !== "cancel") {
      setValue("cancelTypeId", "");
    }
  };

  // Handle cancel type change
  const handleCancelTypeChange = (e) => {
    setValue("cancelTypeId", e.target.value);
  };

  // Handle form submission
  const onSubmit = (data) => {

    try {
      if (data.reason === "disagree") {
        // Call API to request change
        requestToChangeQuotation(
          {
            quotationCode: quotationCode,
            changeReason: data.comment,
          },
          {
            onSuccess: () => {
              if (onClose) {
                onClose();
              } else {
                router.push(`/quotation/${quotationCode}`);
              }
            },
            onError: (error) => {
              console.error("Error requesting changes:", error);
            },
          }
        );
      } else if (data.reason === "cancel") {
        // Call API to request cancellation
        requestToCancelQuotation(
          {
            quotationCode: quotationCode,
            cancelReason: data.comment,
            cancelTypeId: data.cancelTypeId,
          },
          {
            onSuccess: () => {
              if (onClose) {
                onClose();
              } else {
                router.push(`/quotation/${quotationCode}`);
              }
            },
            onError: (error) => {
              console.error("Error requesting cancellation:", error);
            },
          }
        );
      }
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  return (
    <Container>
      <MuiBreadcrumbs />

      <div className="flex items-center my-6">
        <TbFileText
          className="text-blue-600 dark:text-blue-400 mr-2"
          size={28}
        />
        <BodyTypo
          bodylabel="Request Changes on Quotation"
          className="text-xl"
        />
      </div>

      <Paper
        elevation={0}
        className="p-6 mb-8 rounded-xl shadow-sm border border-gray-100 dark:bg-transparent dark:text-white"
      >
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
            <MdErrorOutline className="text-blue-500" size={36} />
          </div>
          <div className="flex flex-col gap-1">
            <FootTypo
              footlabel={`Quotation #${quotationCode}`}
              className="mb-1"
              fontWeight="medium"
            />
            <FootTypo
              footlabel={`Created on: ${
                quotationDetail?.createdAt
                  ? new Date(quotationDetail.createdAt).toLocaleDateString()
                  : "N/A"
              }`}
            />
          </div>
        </div>
      </Paper>

      <form onSubmit={submitForm(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              className="p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Why are you requesting changes?
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                className="pb-6"
              >
                Your feedback helps providers improve their service. Please
                provide specific details about what you'd like changed in the
                quotation or why you want to cancel.
              </Typography>

              <FormControl component="fieldset" className="w-full">
                <RadioGroup
                  value={reason}
                  onChange={handleReasonChange}
                  className="space-y-4"
                >
                  <FormControlLabel
                    value="disagree"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#4f46e5",
                          },
                        }}
                        {...register("reason")}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <AiOutlineEdit
                          className="mr-2 text-indigo-600"
                          size={20}
                        />
                        <Typography fontWeight="medium">
                          I don't agree with this quotation
                        </Typography>
                      </Box>
                    }
                    className={`border rounded-xl p-4 w-full transition-all duration-200 hover:bg-indigo-50 ${
                      reason === "disagree"
                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                        : "border-gray-200"
                    }`}
                  />

                  <FormControlLabel
                    value="cancel"
                    control={
                      <Radio
                        sx={{
                          "&.Mui-checked": {
                            color: "#ef4444",
                          },
                        }}
                        {...register("reason")}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        <FaRegTimesCircle
                          className="mr-2 text-rose-500"
                          size={18}
                        />
                        <Typography fontWeight="medium">
                          I want to cancel this quotation
                        </Typography>
                      </Box>
                    }
                    className={`border rounded-xl p-4 w-full transition-all duration-200 hover:bg-rose-50 ${
                      reason === "cancel"
                        ? "bg-rose-50 border-rose-200 shadow-sm"
                        : "border-gray-200"
                    }`}
                  />
                </RadioGroup>
              </FormControl>

              <Divider className="py-6" />

              <Typography variant="h6" gutterBottom fontWeight="medium">
                Please provide details
              </Typography>

              {reason === "cancel" && (
                <div className="mt-4 mb-6">
                  <FormControl fullWidth variant="outlined" className="mb-4">
                    <Typography
                      variant="subtitle1"
                      className="mb-2"
                      fontWeight="medium"
                    >
                      Select cancellation reason:
                    </Typography>
                    {isLoadingCancelTypes ? (
                      <div className="py-2 px-4 border border-gray-300 rounded-lg bg-gray-50">
                        <Typography variant="body2" color="text.secondary">
                          Loading cancellation types...
                        </Typography>
                      </div>
                    ) : cancelTypes && cancelTypes.length > 0 ? (
                      <select
                        {...register("cancelTypeId")}
                        onChange={handleCancelTypeChange}
                        className={`w-full py-3 px-4 border ${
                          errors.cancelTypeId
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white`}
                      >
                        <option value="" disabled>
                          -- Select a reason --
                        </option>
                        {cancelTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.type}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="py-2 px-4 border border-gray-300 rounded-lg bg-gray-50">
                        <Typography variant="body2" color="text.secondary">
                          No cancellation types available
                        </Typography>
                      </div>
                    )}
                    {errors.cancelTypeId && (
                      <Typography
                        variant="caption"
                        color="error"
                        className="mt-1 ml-3"
                      >
                        {errors.cancelTypeId.message}
                      </Typography>
                    )}
                  </FormControl>
                </div>
              )}

              <TextField
                label="Your feedback"
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                {...register("comment")}
                placeholder={
                  reason === "disagree"
                    ? "What specific parts of the quotation do you want changed? (price, materials, etc.)"
                    : "Please let us know why you want to cancel this quotation."
                }
                InputProps={{
                  sx: {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.comment
                        ? "#ef4444"
                        : "rgba(0, 0, 0, 0.23)",
                    },
                  },
                }}
                error={!!errors.comment}
                helperText={errors.comment?.message || ""}
                className="mb-6"
              />

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  label="Cancel"
                  onClick={onClose}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                  type="button"
                />

                <Button
                  label={
                    isRequestingToChangeQuotation ||
                    isRequestingToCancelQuotation
                      ? "Submitting..."
                      : reason === "disagree"
                      ? "Submit Request"
                      : "Submit Request"
                  }
                  className={
                    reason === "disagree"
                      ? "bg-indigo-600 text-white"
                      : "bg-red text-white"
                  }
                  isLoading={
                    isRequestingToChangeQuotation ||
                    isRequestingToCancelQuotation
                  }
                  disabled={
                    isRequestingToChangeQuotation ||
                    isRequestingToCancelQuotation
                  }
                  type="submit"
                />
              </div>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5}}>
            <Paper
              elevation={0}
              className="p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <Typography variant="h6" gutterBottom fontWeight="medium">
                What happens next?
              </Typography>

              {reason === "disagree" ? (
                <ul className="space-y-4 my-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-indigo-700 font-bold">
                        1
                      </span>
                    </div>
                    <Typography variant="body2">
                      Your request will be sent to the provider
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-indigo-700 font-bold">
                        2
                      </span>
                    </div>
                    <Typography variant="body2">
                      The provider will review your feedback and revise the
                      quotation
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-indigo-700 font-bold">
                        3
                      </span>
                    </div>
                    <Typography variant="body2">
                      You'll receive a notification when the updated quotation
                      is ready
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-indigo-700 font-bold">
                        4
                      </span>
                    </div>
                    <Typography variant="body2">
                      You can then review and accept the revised quotation
                    </Typography>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-4 mt-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-red font-bold">
                        1
                      </span>
                    </div>
                    <Typography variant="body2">
                      Your cancellation request will be reviewed
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-red font-bold">
                        2
                      </span>
                    </div>
                    <Typography variant="body2">
                      You'll receive a confirmation once the cancellation is
                      processed
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                      <span className="flex items-center justify-center w-5 h-5 text-red font-bold">
                        3
                      </span>
                    </div>
                    <Typography variant="body2">
                      Any deposit made for this quotation may be subject to our
                      refund policy
                    </Typography>
                  </li>
                </ul>
              )}

              <Divider className="my-6" />

              <div className="bg-gray-50 p-4 rounded-lg">
                <Typography variant="body2" color="text.secondary">
                  Need help? Contact our support team at{" "}
                  <span className="text-blue-600">support@seasondecor.com</span>
                </Typography>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default QuotationChangeRequestView;
