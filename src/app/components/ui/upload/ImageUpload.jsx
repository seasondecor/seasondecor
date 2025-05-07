"use client";
import { useState, useEffect } from "react";
import { MdOutlineFileUpload, MdOutlineDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import ImageUploading from "react-images-uploading";

const ImageUpload = ({ 
  onImageChange, 
  existingImages = [], 
  onExistingImagesChange, 
  className 
}) => {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  
  const maxNumber = 5;
  const maxFileSize = 5242880; // 5MB

  // Initialize images with existingImages if provided
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const formattedExistingImages = existingImages.map(img => ({
        dataURL: img.url || img.preview || "",
        file: null,
        isExisting: true,
        id: img.id
      }));
      setImages(formattedExistingImages);
    }
  }, [existingImages]);

  const onChange = (imageList, addUpdateIndex) => {
    // Update state with the new images
    setImages(imageList);
    setErrorMessage("");
    
    // Extract file objects for parent component
    const files = imageList
      .filter(img => !img.isExisting && img.file)
      .map(img => img.file);
    
    // Notify parent component
    onImageChange(files);
    
    // If we have a callback for existing images, filter those out
    if (onExistingImagesChange) {
      const existingImgs = imageList.filter(img => img.isExisting);
      onExistingImagesChange(existingImgs);
    }
  };

  const onError = (errors) => {
    if (errors.maxNumber) {
      setErrorMessage(`You can upload up to ${maxNumber} images only.`);
    } else if (errors.maxFileSize) {
      setErrorMessage("File is too large, max size is 5MB.");
    } else if (errors.acceptType) {
      setErrorMessage("Please select valid image files (png, jpg, jpeg).");
    }
  };

  return (
    <div className={`image-upload-container w-full ${className || ""}`}>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        onError={onError}
        maxNumber={maxNumber}
        maxFileSize={maxFileSize}
        acceptType={["jpg", "jpeg", "png"]}
        dataURLKey="dataURL"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
          errors
        }) => (
          <div className="upload__image-wrapper w-full">
            <div 
              className={`p-6 border-2 border-dashed rounded-lg ${
                isDragging ? "border-primary bg-primary/10" : "border-gray-300"
              } min-h-[200px] flex flex-col items-center justify-center relative`}
            >
              {imageList.length === 0 ? (
                <div 
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <MdOutlineFileUpload size={30} className="text-primary mb-2" />
                  <button className="bg-primary text-white rounded-md font-medium cursor-pointer py-2 px-4 hover:bg-indigo-600 transition duration-200">
                    Select Images (0/{maxNumber})
                  </button>
                  <p className="text-gray-500 text-sm mt-2 text-center">
                    Drag & drop or click to upload. Max {maxNumber} images (PNG, JPG)
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mb-4">
                    {imageList.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative group border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all aspect-[16/9]"
                      >
                        <div className="w-full h-full relative">
                          {image.dataURL ? (
                            <Image
                              src={image.dataURL}
                              alt={`Image ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 300px"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">No preview</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onImageUpdate(index);
                            }}
                            className="bg-blue-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onImageRemove(index);
                            }}
                            className="bg-red text-white p-1 rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <MdOutlineDelete size={12} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 text-xs p-1 text-center truncate bg-black/50 text-white">
                          {image.file?.name?.substring(0, 12) || `Image ${index + 1}`}
                          {image.file?.name?.length > 12 && "..."}
                        </div>
                      </div>
                    ))}
                    {imageList.length < maxNumber && (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg aspect-[16/9] flex items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                        onClick={onImageUpload}
                      >
                        <div className="flex flex-col items-center">
                          <MdOutlineFileUpload size={24} className="text-primary" />
                          <span className="text-xs text-gray-500 mt-1">Add More</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <button
                      type="button"
                      onClick={onImageUpload}
                      className="text-primary text-sm hover:underline font-medium"
                    >
                      Select Images ({imageList.length}/{maxNumber})
                    </button>
                    <button
                      type="button"
                      onClick={onImageRemoveAll}
                      className="text-red text-sm hover:underline"
                    >
                      Remove all images
                    </button>
                  </div>
                </>
              )}
            </div>

            {errorMessage && (
              <div className="text-red text-sm mt-2">{errorMessage}</div>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUpload;
