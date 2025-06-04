"use client";

import React from "react";
import Button from "@/app/components/ui/Buttons/Button";
import { BodyTypo } from "@/app/components/ui/Typography";
import { UserWrapper } from "../../components/UserWrapper";
import { FaPlus } from "react-icons/fa6";
import useAddressModal from "@/app/hooks/useAddressModal";
import AddressBox from "../../components/AddressBox";
import { useGetAllAddress } from "@/app/queries/user/address.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { Box } from "@mui/material";

const UserAddress = () => {
  const addressModal = useAddressModal();

  const { data: addresses, isFetching, isError } = useGetAllAddress();
  console.log("Addresses Data:", addresses);

  if (isError) return <p>Error loading addresses.</p>;

  const sortedAddresses = Array.isArray(addresses)
    ? [...addresses].sort((a, b) => (b.isDefault ? 1 : -1))
    : [];

  const canAddMoreAddresses = sortedAddresses.length < 3;

  return (
    <UserWrapper>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={2}
        position="relative"
        p={2}
      >
        <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
              <span>
                  <BodyTypo bodylabel="My Addresses" />
                </span>

                {canAddMoreAddresses && (
                  <Button
                    label="Add address"
                    icon={<FaPlus size={20} />}
                    onClick={addressModal.onOpen}
                  />
                )}
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <DataMapper
            data={sortedAddresses}
            Component={AddressBox}
            emptyStateComponent={<EmptyState title="You saved no addresses" />}
            loading={isFetching}
            getKey={(address) => address.id}
          />
        </Box>
      </Box>
    </UserWrapper>
  );
};

export default UserAddress;
