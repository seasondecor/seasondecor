"use client";

import React, { useState, useEffect } from "react";
import AdminWrapper from "../components/AdminWrapper";
import {
  useGetListSetting,
  useUpdateSetting,
} from "@/app/queries/setting/setting.query";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { PercentOutlined, SaveOutlined, EditOutlined } from "@mui/icons-material";

const SystemSetting = () => {
  const { data, isLoading } = useGetListSetting();
  const { mutate: updateSetting, isLoading: isUpdating } = useUpdateSetting();
  const [commission, setCommission] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (data?.data?.[0]?.commission) {
      setCommission(data.data[0].commission * 100);
    }
  }, [data]);

  // Handle commission change from slider
  const handleCommissionChange = (event, newValue) => {
    setCommission(newValue);
  };

  // Handle save settings
  const handleSave = () => {
    if (!data?.data?.[0]?.id) {
      return;
    }

    updateSetting(
      { 
        id: data.data[0].id,
        commission: commission / 100 
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setIsEditing(false);
          setTimeout(() => setShowSuccess(false), 3000);
        },
      }
    );
  };

  return (
    <AdminWrapper>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <Box>
        {showSuccess && (
          <Alert severity="success" className="mb-4">
            Settings updated successfully!
          </Alert>
        )}

        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
          className="dark:text-white"
        >
          <CardContent>
            <Box className="flex items-center justify-between mb-6">
              <Box className="flex items-center gap-2">
                <PercentOutlined color="primary" />
                <Typography variant="h6" className="dark:text-white">
                  Commission Settings
                </Typography>
              </Box>
              {!isEditing && (
                <Button
                  startIcon={<EditOutlined />}
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
              )}
            </Box>

            <Divider className="mb-6" />

            <Box className="space-y-6">
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  className="dark:text-white"
                >
                  Platform Commission Rate
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-4 dark:text-gray-400"
                >
                  The percentage of commission that the platform takes from each transaction
                </Typography>

                {isEditing ? (
                  <Box my={4}>
                    <Slider
                      value={commission}
                      onChange={handleCommissionChange}
                      aria-labelledby="commission-slider"
                      valueLabelDisplay="on"
                      valueLabelFormat={(value) => `${value}%`}
                      step={0.1}
                      min={0}
                      max={100}
                      disabled={isLoading || isUpdating}
                    />
                  </Box>
                ) : (
                  <Box my={4}>
                    <Typography variant="h3" className="dark:text-white font-bold">
                      {commission.toFixed(1)}%
                    </Typography>
                  </Box>
                )}

                <Box className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Typography variant="body2" className="dark:text-white">
                    Current Commission Rate: {commission.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Example: For a 1.000.000 VND transaction, the platform will
                    receive {((1000000 * commission) / 100).toLocaleString('de-DE')} VND
                  </Typography>
                </Box>
              </Box>

              {isEditing && (
                <Box className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setCommission(data?.data?.[0]?.commission * 100 || 0);
                    }}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      isUpdating ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveOutlined />
                      )
                    }
                    onClick={handleSave}
                    disabled={isLoading || isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AdminWrapper>
  );
};

export default SystemSetting;
