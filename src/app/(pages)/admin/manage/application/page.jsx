"use client";

import React, { useState, useCallback, useEffect } from "react";
import AdminWrapper from "../../components/AdminWrapper";
import { 
  useGetPendingApplicationList, 
  useApproveApplication,
  useRejectApplication
} from "@/app/queries/user/provider.query";
import DataTable from "@/app/components/ui/table/DataTable";
import Button from "@/app/components/ui/Buttons/Button";
import {
  Skeleton,
  Modal,
  Box,
  Typography,
  Divider,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import RoleChip from "../../components/RoleChip";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import {
  IoFilterOutline,
  IoEyeSharp,
  IoClose,
  IoCheckmarkCircle,
  IoCloseCircle,
} from "react-icons/io5";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { Textarea } from "@headlessui/react";

const ManageApplication = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    status: "",
    isVerified: "",
  });

  const [filters, setFilters] = useState({
    status: 0,
    gender: "",
    isVerified: "",
    isDisabled: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const {
    data: applicationList,
    isLoading,
    error,
  } = useGetPendingApplicationList();

  const { mutate: approveApplication, isPending: isApproving } = useApproveApplication();
  const { mutate: rejectApplication, isPending: isRejecting } = useRejectApplication();

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      gender: filters.gender,
      isVerified: filters.isVerified,
      isDisabled: filters.isDisabled,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const filterOptions = [
    {
      label: "Status",
      type: "boolean",
      options: [
        { id: "true", name: "Disabled" },
        { id: "false", name: "Active" },
      ],
      onChange: (value) => handleFilterChange("isDisabled", value),
      value: filters.isDisabled,
    },
  ];

  const handleViewApplication = (applicationData) => {
    setSelectedApplication(applicationData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedApplication(null);
    setActiveTab(0);
  };

  const totalCount = applicationList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const columns = [
    {
      header: "Image",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-16 h-16">
          {row.original.avatar ? (
            <Avatar
              userImg={row.original.avatar}
              alt={row.original.email}
              w={64}
              h={64}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Bussiness Name",
      accessorKey: "businessName",
    },
    {
      header: "Phone Number",
      accessorKey: "phone",
    },
    {
      header: "Status",
      accessorKey: "isDisable",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-white text-sm text-center font-bold ${
              row.original.isDisable ? "bg-red" : "bg-green"
            }`}
          >
            {row.original.isDisable ? "Disabled" : "Active"}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "roleId",
      cell: ({ row }) => <RoleChip status={row.original.roleId} />,
    },
    {
      header: "Address",
      accessorKey: "businessAddress",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            label="View"
            onClick={() => handleViewApplication(row.original)}
            icon={<IoEyeSharp size={20} />}
          />
        </div>
      ),
    },
  ];

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => {
      const updated = {
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      };
      console.log("Updated pagination state:", updated);
      return updated;
    });
  }, []);

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-4 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      {filterOptions.map((filter) => (
        <FormControl
          key={filter.label}
          variant="outlined"
          size="small"
          className="w-full max-w-[200px] dark:text-white"
        >
          <InputLabel id={`${filter.label}-label`} className="dark:text-white">
            {filter.label}
          </InputLabel>
          <Select
            MenuProps={{
              disableScrollLock: true,
            }}
            labelId={`${filter.label}-label`}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            label={filter.label}
            className="bg-white dark:bg-gray-700 dark:text-white"
          >
            {filter.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Button
        label="Reset Filters"
        onClick={() =>
          setFilters({
            status: 0,
            gender: "",
            isVerified: "",
            isDisabled: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

  // Application modal component
  const ApplicationModal = () => {
    if (!selectedApplication) return null;

    const {
      accountId,
      avatar,
      email,
      phone,
      fullName,
      businessName,
      businessAddress,
      bio,
      skillName,
      decorationStyleName,
      yearsOfExperience,
      pastWorkPlaces,
      pastProjects,
      certificateImageUrls,
      isVerified,
      isDisable,
    } = selectedApplication;

    console.log(accountId);

    const handleApprove = () => {
      // Set processing ID
      setProcessingId(accountId);

      
      // Call approve API
      approveApplication(accountId, {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: () => {
          setProcessingId(null);
        }
      });
    };

    const handleReject = () => {
      // Open reject confirmation modal
      setProcessingId(accountId);
      setRejectModalOpen(true);
    };

    return (
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="application-details-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%",
            maxWidth: "1000px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            overflowY: "auto",
          }}
        >
          {/* Header with close button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              Provider Application Details
            </Typography>
            <IconButton onClick={handleCloseModal} aria-label="close">
              <IoClose />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Tabs for different sections */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Basic Info" />
            <Tab label="Business Details" />
            <Tab label="Certificates" />
          </Tabs>

          {/* Basic Info Tab */}
          {activeTab === 0 && (
            <Box>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: { xs: "100%", md: "33%" },
                  }}
                >
                  <Box sx={{ width: 200, height: 200, mb: 2 }}>
                    {avatar ? (
                      <Avatar userImg={avatar} alt={email} w={200} h={200} />
                    ) : (
                      <Paper
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "grey.200",
                          borderRadius: "50%",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No Image
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Chip
                      icon={
                        isVerified ? <IoCheckmarkCircle /> : <IoCloseCircle />
                      }
                      label={isVerified ? "Verified" : "Unverified"}
                      color={isVerified ? "success" : "warning"}
                    />
                    <Chip
                      icon={
                        isDisable ? <IoCloseCircle /> : <IoCheckmarkCircle />
                      }
                      label={isDisable ? "Disabled" : "Active"}
                      color={isDisable ? "error" : "success"}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: { xs: "100%", md: "67%" } }}>
                  <Paper
                    elevation={0}
                    sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Personal Information
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                            gap: 1,
                          }}
                        >
                          <FaUser style={{ marginRight: 8 }} />
                          <Typography variant="body1" fontWeight="bold">
                            {fullName || "N/A"}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1.5,
                            }}
                          >
                            <FaEnvelope style={{ marginRight: 8 }} />
                            <Typography variant="body2" fontWeight="bold">
                              {email || "N/A"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1.5,
                            }}
                          >
                            <FaPhone style={{ marginRight: 8 }} />
                            <Typography variant="body2" fontWeight="bold">
                              {phone || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Skills
                        </Typography>
                        <Chip
                          label={skillName || "N/A"}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Decoration Style
                        </Typography>
                        <Chip
                          label={decorationStyleName || "N/A"}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Experience
                        </Typography>
                        <Chip
                          label={`${yearsOfExperience || "0"} years`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Past Work Places
                        </Typography>
                        <Typography variant="body2">
                          {pastWorkPlaces || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Background Details Tab */}
          {activeTab === 1 && (
            <Box>
              <Paper
                elevation={0}
                sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2, mb: 3 }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Background Information
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <FaBuilding style={{ marginRight: 8 }} />
                      <Typography variant="body1" fontWeight="medium" marginRight={1}>
                        Business Name
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {businessName || "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <FaMapMarkerAlt style={{ marginRight: 8 }} />
                      <Typography variant="body2" fontWeight="medium" marginRight={1}>
                        Business Address
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {businessAddress || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Bio
                </Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: bio || "No bio provided.",
                  }}
                  className="text-sm"
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2, mt: 3 }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Past Projects
                </Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: pastProjects || "No past projects provided.",
                  }}
                  className="text-sm"
                />
              </Paper>
            </Box>
          )}

          {/* Certificates Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Certificates
              </Typography>
              
              {certificateImageUrls && certificateImageUrls.length > 0 ? (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {certificateImageUrls.map((url, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: { xs: "100%", sm: "calc(50% - 8px)", md: "calc(33.33% - 10.67px)" },
                          height: 200,
                          borderRadius: 2,
                          overflow: "hidden",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedCertificate(url);
                          setShowCertificateModal(true);
                        }}
                      >
                        <img
                          src={url}
                          alt={`Certificate ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 1,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                          }}
                        >
                          <Typography variant="caption">
                            Certificate {index + 1}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No certificates provided
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Action buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button
              label="Reject"
              onClick={handleReject}
              className="bg-red text-white"
              disabled={processingId === accountId && (rejectModalOpen || isRejecting)}
            />
            <Button
              label={processingId === accountId && isApproving ? "Approving..." : "Approve"}
              onClick={handleApprove}
              className="bg-green text-white"
              disabled={processingId === accountId && (isApproving || rejectModalOpen)}
            />
          </Box>
        </Box>
      </Modal>
    );
  };

  const CertificateModal = () => {
    if (!selectedCertificate) return null;
    
    return (
      <Modal
        open={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        aria-labelledby="certificate-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90%",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
          }}
        >
          <IconButton
            onClick={() => setShowCertificateModal(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
              zIndex: 1,
            }}
          >
            <IoClose />
          </IconButton>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedCertificate}
              alt="Certificate"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
      </Modal>
    );
  };

  // Rejection confirmation modal
  const RejectConfirmationModal = () => {
    const formRef = React.useRef(null);
    
    const handleSubmitReject = (e) => {
      e.preventDefault();
      
      // Create FormData from the form
      const formData = new FormData(formRef.current);
      const reason = formData.get('reason');
      
      if (!reason || reason.trim() === '') {
        alert("Please provide a reason for rejection");
        return;
      }
      
      // Call reject API with ID and reason
      rejectApplication(
        { accountId: processingId, reason: reason.trim() },
        {
          onSuccess: () => {
            // Close modals
            setRejectModalOpen(false);
            handleCloseModal();
            
            // Reset form
            if (formRef.current) {
              formRef.current.reset();
            }
          },
          onError: (error) => {
            console.error("Error rejecting application:", error);
          },
          onSettled: () => {
            setProcessingId(null);
          }
        }
      );
    };
    
    return (
      <Modal
        open={rejectModalOpen}
        onClose={() => {
          if (!isRejecting) {
            setRejectModalOpen(false);
            setProcessingId(null);
          }
        }}
        aria-labelledby="reject-confirmation-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "400px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
            Confirm Rejection
          </Typography>
          
          <Typography variant="body2" mb={3}>
            Please provide a reason for rejecting this application:
          </Typography>
          
          <form ref={formRef} onSubmit={handleSubmitReject} noValidate>
            <Textarea
              id="reject-reason"
              name="reason"
              placeholder="Enter rejection reason..."
              className="w-full min-h-[120px] p-3 mb-4 rounded border border-gray-300 bg-gray-50 resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                label="Cancel"
                type="button"
                onClick={() => {
                  if (!isRejecting) {
                    setRejectModalOpen(false);
                    setProcessingId(null);
                  }
                }}
                disabled={isRejecting}
              />
              <Button
                label={isRejecting ? "Rejecting..." : "Confirm Reject"}
                type="submit"
                className="bg-red text-white"
                disabled={isRejecting}
              />
            </Box>
          </form>
        </Box>
      </Modal>
    );
  };

  return (
    <AdminWrapper>
      <div className="w-full">
        <FilterSelectors />

        <div className="w-full">
          {isLoading ? (
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={40}
            />
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              Error loading accounts: {error.message}
            </div>
          ) : applicationList.length === 0 && !isLoading ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                No Applications Found
              </h2>
              <p>
                No applications match your filter criteria. Try adjusting your
                filters.
              </p>
            </div>
          ) : (
            <DataTable
              data={applicationList}
              columns={columns}
              isLoading={isLoading}
              showPagination={true}
              pageSize={pagination.pageSize}
              initialPageIndex={tablePageIndex}
              manualPagination={true}
              manualSorting={false}
              pageCount={totalPages}
              onPaginationChange={handlePaginationChange}
              totalCount={totalCount}
            />
          )}
        </div>

        {/* Render the application details modal */}
        <ApplicationModal />
        
        {/* Render certificate modal */}
        <CertificateModal />
        
        {/* Render rejection confirmation modal */}
        <RejectConfirmationModal />
      </div>
    </AdminWrapper>
  );
};

export default ManageApplication;
