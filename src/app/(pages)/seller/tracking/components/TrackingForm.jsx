"use client";

import React, { useState, useEffect } from "react";
import Button from "@/app/components/ui/Buttons/Button";
import { LuPencil, LuImage, LuSend, LuSave, LuPlus } from "react-icons/lu";
import { MdNotes } from "react-icons/md";
import { Field, Textarea } from "@headlessui/react";
import { FootTypo } from "@/app/components/ui/Typography";
import Image from "next/image";
import { BiTask } from "react-icons/bi";
import { useForm, Controller } from "react-hook-form";
import ImageUploading from "react-images-uploading";
import { toast } from "sonner";


const TrackingForm = ({
  onSubmit,
  defaultValues = { task: "", note: "" },
  images: propImages = [],
  handleImageUpload: propHandleImageUpload,
  removeImage: propRemoveImage,
  isPending,
  isEdit = false,
}) => {
  const [images, setImages] = useState(propImages);
  
  useEffect(() => {
    setImages(propImages);
  }, [propImages]);
  
  const { 
    control, 
    handleSubmit,
    formState: { errors } 
  } = useForm({
    defaultValues
  });

  const onChange = (imageList) => {
    setImages(imageList);
  };

  // 5MB file size limit
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const onImageInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Check file sizes before uploading
      const files = Array.from(e.target.files);
      const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
      
      if (oversizedFiles.length > 0) {
        toast.error(`File size exceeds 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        // Clear the input
        e.target.value = '';
        return;
      }
      
      if (propHandleImageUpload) {
        propHandleImageUpload(e);
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    if (propRemoveImage) {
      propRemoveImage(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <BiTask className="text-primary mr-2" size={20} />
          <FootTypo footlabel="Task" className="font-medium text-lg" />
        </div>
        <Controller
          name="task"
          control={control}
          rules={{ required: "Task is required" }}
          render={({ field }) => (
            <Field>
              <Textarea
                id="task"
                {...field}
                placeholder="Main Task"
                className={`
                  mt-3 block w-full resize-none rounded-lg border-[1px] 
                  ${errors.task ? 'border-red' : 'border-black dark:border-gray-600'} 
                  py-1.5 px-3 text-sm/6 
                  bg-white dark:bg-gray-800 text-black dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                  transition duration-200
                `}
                rows={2}
              />
              {errors.task && (
                <p className="mt-1 text-sm text-red">{errors.task.message}</p>
              )}
            </Field>
          )}
        />
      </div>

      {/* Note Section */}
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <MdNotes className="text-primary mr-2" size={20} />
          <FootTypo
            footlabel="Progress Notes"
            className="font-medium text-lg"
          />
        </div>
        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <Field>
              <Textarea
                id="note"
                {...field}
                placeholder="Notes about the task ..."
                className={`
                  mt-3 block w-full resize-none rounded-lg border-[1px] 
                  border-black dark:border-gray-600 py-1.5 px-3 text-sm/6 
                  bg-white dark:bg-gray-800 text-black dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                  transition duration-200
                `}
                rows={7}
              />
            </Field>
          )}
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <div className="flex items-center mb-4">
          <LuImage className="text-primary mr-2" size={20} />
          <FootTypo
            footlabel="Progress Images"
            className="font-medium text-lg"
          />
          <span className="text-sm text-gray-500 ml-2">
            ({images.length}/5 images)
          </span>
        </div>

        {/* Regular file input that directly calls the parent's handler */}
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          id="image-upload-input"
          onChange={onImageInputChange}
          disabled={images.length >= 5}
        />

        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={5}
          dataURLKey="preview"
          acceptType={["jpg", "jpeg", "png"]}
          maxFileSize={MAX_FILE_SIZE}
          onSizeError={(errorInfo) => {
            toast.error(`File size exceeds 5MB limit: ${errorInfo.file.name}`);
          }}
        >
          {({
            imageList,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
            errors: uploadErrors
          }) => (
            <div>
              <div className="flex flex-wrap gap-4 mb-5">
                {/* Image Previews */}
                {imageList.map((image, index) => (
                  <div key={index} className="relative w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] group">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
                      <Image
                        src={image.preview || image.url || ''}
                        alt={`Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized={true}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {!image.isExisting && (
                          <button
                            type="button"
                            className="bg-primary text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                            onClick={() => onImageUpdate(index)}
                          >
                            <LuPencil size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="bg-red text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red"
                          onClick={() => {
                            onImageRemove(index);
                            handleRemoveImage(index);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upload Button */}
                {images.length < 5 && (
                  <div className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]">
                    <label
                      htmlFor="image-upload-input"
                      className={`
                        flex flex-col items-center justify-center 
                        border-2 border-dashed rounded-xl cursor-pointer
                        h-full aspect-[4/3]
                        ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"} 
                        ${images.length >= 5 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800/30"}
                        bg-white dark:bg-gray-800/10 dark:border-gray-700
                        transition-all
                      `}
                      {...dragProps}
                    >
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="bg-primary p-2 rounded-full mb-2">
                          <LuPlus color="blue" size={24} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Add Image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG, JPEG (MAX. 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {uploadErrors && (
                <div className="mt-2 text-center">
                  {uploadErrors.maxNumber && (
                    <p className="text-sm text-red">You can upload up to 5 images</p>
                  )}
                  {uploadErrors.acceptType && (
                    <p className="text-sm text-red">Only JPG, JPEG and PNG files are allowed</p>
                  )}
                  {uploadErrors.maxFileSize && (
                    <p className="text-sm text-red">File size exceeds the 5MB limit</p>
                  )}
                </div>
              )}
            </div>
          )}
        </ImageUploading>
      </div>

      {/* Submit Button */}
      <div className="flex justify-start mt-8">
        <Button
          type="submit"
          label={isEdit ? "Update Tracking" : "Add Tracking"}
          icon={isEdit ? <LuSave /> : <LuSend />}
          className="bg-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-md"
          isLoading={isPending}
          disabled={isPending}
        />
      </div>
    </form>
  );
};

export default TrackingForm;