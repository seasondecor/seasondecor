"use client";
import * as React from "react";

import Avatar from "../ui/Avatar/Avatar";
import { MdEdit } from "react-icons/md";
import clsx from "clsx";
import { UserProfileUpdate } from "@/app/api/upload";
import Button from "../ui/Buttons/Button";

export const EditAvatar = ({ userImg, className, childStyle }) => {
  const [preview, setPreview] = React.useState(userImg);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const { uploadAvatar, loading } = UserProfileUpdate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      setIsLoading(true);

      const response = await uploadAvatar(selectedFile);
      if (response) {
        setPreview(response.avatarUrl);
        setSelectedFile(null);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={clsx("relative flex gap-3 items-center", className)}>
      <div className="relative">
        <Avatar userImg={preview} h={80} w={80} className="cursor-pointer" />
        <label
          className={clsx(
            "absolute bottom-0 right-0 inline-flex items-center gap-1 rounded bg-action px-[2px] py-[1px] text-sm text-white dark:bg-white dark:text-black cursor-pointer hover:bg-primary",
            childStyle
          )}
        >
          <MdEdit />
          Edit
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
      {selectedFile && (
        <Button
          label="Update"
          className="h-10"
          onClick={handleUpload}
          isLoading={isLoading}
        >
          {loading ? "Updating..." : "Update Avatar"}
        </Button>
      )}
    </div>
  );
};
