"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { getProvinces } from "vn-provinces";
import { useUpdateUserLocation } from "@/app/queries/user/user.query";
import { IoLocation } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";

const LocationModal = ({ isOpen, onClose, onSuccessUpdate }) => {
  const [provinces, setProvinces] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      code: "",
    },
  });

  // Use the update location API hook
  const { mutate: updateLocation, isPending: loading } =
    useUpdateUserLocation();

  useEffect(() => {
    // Get all provinces from vn-provinces
    const allProvinces = getProvinces();
    setProvinces(allProvinces);
  }, []);

  const onSubmit = (data) => {
    // Find the selected province object to get its code
    const selectedProvince = provinces.find((p) => p.name === data.location);

    // Update backend via API
    updateLocation(
      {
        location: data.location,
        provinceCode: data.code,
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("userProvince", selectedProvince.name);
          localStorage.setItem("userProvinceCode", selectedProvince.code);
          onSuccessUpdate && onSuccessUpdate();
          onClose();
        },
        onError: (error) => {
          console.error("Error updating location:", error);
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          margin: "0 auto",
        },
      }}
    >
      <DialogTitle
        align="center"
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          paddingTop: 3,
          paddingBottom: 2,
        }}
      >
        Welcome to SeasonDecor !
      </DialogTitle>
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: "text.secondary",
          textAlign: "center",
          paddingBottom: 2,
        }}
      >
        Please update your location to continue
      </Typography>
      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Controller
              name="location"
              control={control}
              rules={{ required: "Please select your province" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.location}>
                  <Select
                    {...field}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography sx={{ color: "text.secondary" }}>
                            Choose your location
                          </Typography>
                        );
                      }
                      return (
                        <Typography
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IoLocation size={18} />
                          {selected}
                        </Typography>
                      );
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      // Find the selected province and update the code field
                      const selectedProvince = provinces.find(
                        (p) => p.name === e.target.value
                      );
                      if (selectedProvince) {
                        control._formValues.code = selectedProvince.code;
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 240,
                        },
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      <Typography sx={{ color: "text.secondary" }}>
                        Choose your location
                      </Typography>
                    </MenuItem>
                    {provinces.map((province) => (
                      <MenuItem key={province.code} value={province.name}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.location && (
                    <FormHelperText>{errors.location.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="code"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px 24px" }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "primary.main",
            textTransform: "uppercase",
            fontWeight: 500,
            minWidth: "80px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            textTransform: "uppercase",
            fontWeight: 500,
            minWidth: "80px",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationModal;
