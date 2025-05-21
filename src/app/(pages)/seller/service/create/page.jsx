"use client";

import * as React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import Stepper, { Step } from "@/app/components/ui/animated/Stepper";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import ImageUpload from "@/app/components/ui/upload/ImageUpload";
import Input from "@/app/components/ui/Inputs/Input";
import { useForm } from "react-hook-form";
import { Field } from "@headlessui/react";
import { useGetListDecorCategory } from "@/app/queries/list/category.list.query";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { useCreateDecorService } from "@/app/queries/service/service.query";
import { useRouter } from "next/navigation";
import ProvinceDistrictWardSelect from "@/app/(pages)/user/components/ProvinceDropdown";
import { useGetListSeason } from "@/app/queries/list/category.list.query";
import MultiSelectChip from "@/app/components/ui/chip/Chip";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";
import { toast } from "sonner";
import { Divider, TextField, Autocomplete, MenuItem } from "@mui/material";
import { FaCheck, FaTrash, FaPlus, FaCircleInfo } from "react-icons/fa6";
import { HexColorPicker } from "react-colorful";
import Button from "@/app/components/ui/Buttons/Button";
import { useGetOfferingNStyle } from "@/app/queries/list/offeringNstyle.query";
import { getOfferingIcon } from "@/app/constant/offering";

const ServiceCreate = () => {
  const router = useRouter();

  const { data: dataCategory } = useGetListDecorCategory();

  const { data: dataSeason } = useGetListSeason();

  const [images, setImages] = React.useState([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [selectedServiceOffers, setSelectedServiceOffers] = React.useState([]);
  const [editorContent, setEditorContent] = React.useState("");
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [locationString, setLocationString] = React.useState("");
  const [selectedColor, setSelectedColor] = React.useState("#aabbcc");
  const [savedColors, setSavedColors] = React.useState([]);
  const [selectedStyle, setSelectedStyle] = React.useState([]);

  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(null);

  const { mutate: mutationCreate, isPending } = useCreateDecorService();

  const [selectedSeasons, setSelectedSeasons] = React.useState([]);

  const { data: dataOfferingNStyle, isFetching: isFetchingOfferingNStyle } =
    useGetOfferingNStyle();

  const offerings = dataOfferingNStyle?.offerings;
  const styles = dataOfferingNStyle?.designs;

  const handleDateSelect = (date) => {
    // Create a new date object to avoid timezone issues
    const selectedDate = new Date(date);
    //console.log("Selected date:", selectedDate.toDateString());
    setStartDate(selectedDate);
    setValue("startDate", selectedDate);
    setShowCalendar(false);
  };

  const handleImageUpload = (files) => {
    const imageFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(imageFiles);
  };

  const handleImageDelete = (indexToRemove) => {
    setImages(prevImages => {
      // Revoke the URL of the image being removed
      if (prevImages[indexToRemove]?.preview) {
        URL.revokeObjectURL(prevImages[indexToRemove].preview);
      }
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  };

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const CategoryOptions =
    dataCategory?.map((category) => ({
      value: category.id,
      label: category.categoryName,
    })) || [];

  //console.log("Dropdown Options:", CategoryOptions);

  const handleCategoryChange = (selected) => {
    if (selected) {
      setSelectedCategory(selected);
      setSelectedCategoryId(selected.value);
      setValue("categoryId", selected.value);
      // console.log("Selected Category ID:", selected.value);
    }
  };

  const handleServiceOffersChange = (event, newValue) => {
    setSelectedServiceOffers(newValue);
    setValue("serviceOffers", newValue);
    // console.log("Selected Service Offers:", newValue);
  };

  const handleStyleChange = (event, newValue) => {
    setSelectedStyle(newValue);
    setValue("serviceStyle", newValue);
    //console.log("Selected Style:", newValue);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      images: [],
      //name: "",
      description: "",
      province: "",
      categoryId: "",
      seasonIds: [],
      startDate: new Date(),
      serviceOffers: [],
      serviceStyle: [],
    },
  });

  // Initialize form data on component mount
  React.useEffect(() => {
    // Set default values if they exist
    if (selectedCategoryId) {
      setValue("categoryId", selectedCategoryId);
    }
    if (editorContent) {
      setValue("description", editorContent);
    }
    if (selectedServiceOffers.length > 0) {
      setValue("serviceOffers", selectedServiceOffers);
    }
    if (locationString) {
      setValue("province", locationString);
    }
    if (savedColors.length > 0) {
      setValue("themeColors", savedColors);
    }
    if (selectedStyle) {
      setValue("serviceStyle", selectedStyle);
    }
  }, [
    setValue,
    selectedCategoryId,
    editorContent,
    selectedServiceOffers,
    locationString,
    savedColors,
    selectedStyle,
  ]);

  const onSubmit = React.useCallback(
    async (data) => {
      if (!selectedCategoryId) {
        alert("Please select a category before proceeding.");
        return;
      }

      if (images.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      const formData = new FormData();
      formData.append("Style", data.style);
      formData.append("Description", data.description);

      // Province field contains the combined province and district
      // console.log("Sending location to API:", data.province);
      formData.append("Sublocation", data.province);

      formData.append("DecorCategoryId", selectedCategoryId);

      // Add start date to form data
      if (data.startDate) {
        // Fix timezone issue by creating a date with the local date parts
        const localDate = new Date(data.startDate);
        const year = localDate.getFullYear();
        const month = localDate.getMonth() + 1; // getMonth() is 0-indexed
        const day = localDate.getDate();

        // Format as YYYY-MM-DD with proper padding
        const formattedDate = `${year}-${month
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        // console.log("Sending start date to API:", formattedDate);
        formData.append("StartDate", formattedDate);
      }

      // Handle season tags - append each selected season ID
      if (selectedSeasons.length > 0) {
        // console.log("Sending season tags to API:", selectedSeasons);
        selectedSeasons.forEach((seasonIds) => {
          formData.append("SeasonIds", seasonIds);
        });
      }

      // Handle service offers if needed
      if (selectedServiceOffers.length > 0) {
        selectedServiceOffers.forEach((offer) => {
          formData.append(
            "OfferingIds",
            typeof offer === "string" ? offer : offer.id
          );
        });
      }

      // Add colors to form data
      if (savedColors.length > 0) {
        savedColors.forEach((color) => {
          formData.append("ThemeColorNames", color);
        });
      }

      // Handle service style if needed
      if (selectedStyle.length > 0) {
        selectedStyle.forEach((style) => {
          formData.append(
            "StyleIds",
            typeof style === "string" ? style : style.id
          );
        });
      }

      images.forEach((img) => {
        formData.append("Images", img.file);
      });

      mutationCreate(formData, {
        onSuccess: (response) => {
          //console.log("Service created successfully:", response);
          router.push("/seller/service");
        },
        onError: (error) => {
          console.error("Error creating service:", error);
          alert("Failed to create service. Please try again.");
        },
      });
    },
    [
      selectedCategoryId,
      images,
      mutationCreate,
      router,
      selectedSeasons,
      selectedServiceOffers,
      savedColors,
      selectedStyle,
    ]
  );

  const serviceStyle = watch("style");
  const serviceDescription = watch("description");
  const serviceProvince = watch("province");

  // Update editor content state when the form value changes
  React.useEffect(() => {
    if (serviceDescription) {
      setEditorContent(serviceDescription);
    }
  }, [serviceDescription]);

  // Extract province and district from the form value when it changes
  React.useEffect(() => {
    if (serviceProvince) {
      setLocationString(serviceProvince);

      // Try to extract province and district
      const parts = serviceProvince.split(",").map((part) => part.trim());
      if (parts.length >= 1) {
        setSelectedProvince(parts[0]);
      }
      if (parts.length >= 2) {
        setSelectedDistrict(parts[1]);
      }
    }
  }, [serviceProvince]);

  // Validation function for Step 1
  const validateStep = (step) => {
    if (step === 1) {
      if (
        !serviceStyle?.trim() ||
        !serviceProvince?.trim() ||
        !selectedCategoryId ||
        selectedStyle.length === 0
      ) {
        console.log(
          "Validation failed",
          serviceStyle,
          serviceProvince,
          selectedCategoryId,
          selectedStyle
        );
        toast.warning("Please fill in all fields before proceeding.");
        return false;
      }
    }

    if (step === 2) {
      if (!serviceDescription?.trim() || !startDate || images.length === 0) {
        toast.warning("Please fill in all fields before proceeding.");
        return false;
      }
    }
    return true;
  };

  const handleSeasonChange = (selectedIds) => {
    setSelectedSeasons(selectedIds);
    setValue("seasonTagsId", selectedIds);
    //console.log("Selected Season IDs:", selectedIds);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditorChange = (html) => {
    setValue("description", html);
    setEditorContent(html);
  };

  // Handler for location changes
  const handleLocationChange = (location) => {
    if (typeof location === "string") {
      setLocationString(location);
      setValue("province", location);
      console.log("Combined location set to:", location);
    } else if (location && typeof location === "object") {
      // Handle separate province/district object
      const province = location.province || "";
      const district = location.district || "";
      setSelectedProvince(province);
      setSelectedDistrict(district);

      // Create combined string
      const combined = district ? `${province}, ${district}` : province;
      setLocationString(combined);
      setValue("province", combined);
    }
  };

  // Function to add a color to the list
  const addColor = () => {
    // Check if this color already exists in the list
    if (!savedColors.includes(selectedColor)) {
      const updatedColors = [...savedColors, selectedColor];
      setSavedColors(updatedColors);
      setValue("themeColors", updatedColors);
    } else {
      toast.warning("This color is already in your list");
    }
  };

  // Function to remove a color from the list
  const removeColor = (colorToRemove) => {
    const updatedColors = savedColors.filter(
      (color) => color !== colorToRemove
    );
    setSavedColors(updatedColors);
    setValue("themeColors", updatedColors);
  };

  return (
    <SellerWrapper>
      <BodyTypo bodylabel="Provide service details" fontWeight="bold" />
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        backButtonText="Previous"
        nextButtonText="Next"
        validateStep={validateStep}
      >
        <Step validateStep={validateStep}>
          <div className="step-1 form-detail">
            <BodyTypo bodylabel="Basic service information" fontWeight="bold" />
            <div className="space-y-10 mt-3">
              <div className="form flex items-center gap-5">
                <FootTypo footlabel="Service Title" className="w-auto" />
                <Input
                  id="style"
                  placeholder="Service's title"
                  required
                  className="pl-3 w-full"
                  register={register}
                />
              </div>
              <Divider
                textAlign="left"
                sx={{
                  "&::before, &::after": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <FootTypo footlabel="Description" fontWeight="bold" />
              </Divider>
              <div className="form inline-flex items-start w-full h-full my-5 gap-5">
                <FootTypo footlabel="Descriptions " className="w-auto" />
                <div className="w-full">
                  <Field>
                    <TipTapEditor
                      id="description"
                      register={register}
                      value={editorContent}
                      onChange={handleEditorChange}
                      placeholder="Service descriptions..."
                    />
                  </Field>
                </div>
              </div>
              <Divider
                textAlign="left"
                sx={{
                  "&::before, &::after": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <FootTypo footlabel="Location & Category" fontWeight="bold" />
              </Divider>

              <div className="form flex items-center gap-5">
                <FootTypo footlabel="Available at " className="w-auto" />
                <div className="w-[300px]">
                  <ProvinceDistrictWardSelect
                    setValue={setValue}
                    register={register}
                    combineAsString={true}
                    onChange={handleLocationChange}
                    defaultProvince={selectedProvince}
                    defaultDistrict={selectedDistrict}
                  />
                </div>
              </div>
              <div className="form flex items-center w-full my-5 gap-9">
                <FootTypo footlabel="Category " className="w-auto" />
                <div className="w-[300px]">
                  <DropdownSelectReturnObj
                    options={CategoryOptions}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    labelKey="label"
                    valueKey="value"
                    returnObject={true}
                    lisboxClassName="mt-10"
                  />
                </div>
              </div>
              <Divider
                textAlign="left"
                sx={{
                  "&::before, &::after": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <FootTypo
                  footlabel="Service Offers & Styles"
                  fontWeight="bold"
                />
              </Divider>
              <div>
                <FootTypo
                  footlabel="✅ Select all the features, amenities, and services available at your property. These help guests know what to expect and filter listings that match their needs.."
                  fontWeight="bold"
                />
                <Autocomplete
                  sx={{ my: 3, width: 500 }}
                  multiple
                  options={offerings || []}
                  value={selectedServiceOffers}
                  onChange={handleServiceOffersChange}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.name
                  }
                  isOptionEqualToValue={(option, value) =>
                    (option.id && value.id && option.id === value.id) ||
                    option === value ||
                    option.name === value.name
                  }
                  disableCloseOnSelect
                  className="dark:bg-white"
                  loading={isFetchingOfferingNStyle}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Service Offerings"
                      placeholder="Select offerings"
                    />
                  )}
                  renderOption={(props, option, { selected }) => {
                    const OfferingIcon = getOfferingIcon(option.name);
                    const { key, ...rest } = props;
                    return (
                      <MenuItem
                        key={key}
                        {...rest}
                        value={option.id}
                        sx={{ justifyContent: "space-between" }}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <OfferingIcon size={16} />
                          <span>{option.name}</span>
                        </div>
                        {selected ? (
                          <FaCheck color="info" className="ml-2" />
                        ) : null}
                      </MenuItem>
                    );
                  }}
                />

                <FootTypo
                  footlabel="Design styles of your service"
                  fontWeight="bold"
                />
                {styles ? (
                  <Autocomplete
                    sx={{ my: 3, width: 500 }}
                    multiple
                    options={styles || []}
                    value={selectedStyle}
                    onChange={handleStyleChange}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.name
                    }
                    disableCloseOnSelect
                    className="dark:bg-white"
                    loading={isFetchingOfferingNStyle}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Service Styles"
                        placeholder="Select styles"
                      />
                    )}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...rest } = props;
                      return (
                        <MenuItem
                          key={key}
                          {...rest}
                          value={option.id}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <div className="flex flex-row items-center gap-2">
                            <span>{option.name}</span>
                          </div>
                          {selected ? (
                            <FaCheck color="info" className="ml-2" />
                          ) : null}
                        </MenuItem>
                      );
                    }}
                  />
                ) : (
                  <div className="py-2 text-gray-500">
                    Loading decoration styles...
                  </div>
                )}
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <Divider
            textAlign="left"
            sx={{
              "&::before, &::after": {
                borderColor: "primary.main",
              },
            }}
          >
            <FootTypo footlabel="Service Configuration" fontWeight="bold" />
          </Divider>
          <div className="form inline-flex items-center w-full h-full my-5 gap-5">
            <FootTypo footlabel="Season Tags" className="w-auto" />
            <div>
              {dataSeason ? (
                <MultiSelectChip
                  options={dataSeason.map((season) => ({
                    id: season.id,
                    name: season.seasonName,
                  }))}
                  onChange={handleSeasonChange}
                  label=""
                />
              ) : (
                <p>Loading seasons...</p>
              )}
            </div>
          </div>
          <div className="form inline-flex items-center w-full h-full my-5 gap-5">
            <FootTypo footlabel="Start Date" className="w-auto" />
            <div className="relative w-[300px]">
              <div
                className="cursor-pointer border border-gray-300 rounded-md p-2 flex justify-between items-center"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <span>{formatDate(startDate)}</span>
                <span>📅</span>
              </div>
              {showCalendar && (
                <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md">
                  <Calendar
                    date={startDate}
                    onChange={handleDateSelect}
                    minDate={new Date()}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <div className="form inline-flex items-start w-full h-full my-5 gap-5">
              <FootTypo footlabel="Main Theme" className="w-auto" />
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-row space-x-4 items-center">
                    <HexColorPicker
                      color={selectedColor}
                      onChange={setSelectedColor}
                      className="w-full h-full"
                    />

                    <div className="flex flex-col space-y-2">
                      <div
                        className="w-12 h-12 rounded-full border border-gray-300"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <div className="text-sm font-medium">{selectedColor}</div>
                      <Button
                        label="Add Theme"
                        type="button"
                        onClick={addColor}
                        icon={<FaPlus size={14} />}
                      />
                    </div>
                  </div>
                </div>

                {savedColors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">
                      Saved Themes:
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {savedColors.map((color, index) => (
                        <div
                          key={`${color}-${index}`}
                          className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full pl-1 pr-2 py-1"
                        >
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs">{color}</span>
                          <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="text-red ml-1 hover:text-opacity-80"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {savedColors.length === 0 && (
                  <FootTypo
                    footlabel="No themes added yet. Choose a theme and click 'Add Theme' to create your palette."
                    fontStyle="italic"
                  />
                )}
              </div>
            </div>
            <div className="flex items-start justify-start gap-2">
              <FaCircleInfo size={14} />
              <FootTypo
                footlabel="Choose the main themes that define this decor style or setup. These will help clients quickly understand the visual vibe and aesthetic of your service (e.g., white & gold, blush pink, rustic green)."
                fontStyle="italic"
                className="max-w-lg break-after-all"
              />
            </div>
          </div>

          <Divider
            textAlign="left"
            sx={{
              "&::before, &::after": {
                borderColor: "primary.main",
              },
            }}
          >
            <FootTypo footlabel="Images" fontWeight="bold" />
          </Divider>
          <div className="form inline-flex items-center w-full h-full my-5 gap-5">
            <FootTypo footlabel="Images " className="w-auto" />
            <ImageUpload 
              onImageChange={handleImageUpload}
              onImageDelete={handleImageDelete}
              existingImages={images.map(img => ({
                dataURL: img.preview,
                file: img.file
              }))}
            />
          </div>
        </Step>
        <Step>
          <div className="step-3 form flex flex-col items-center justify-center p-5">
            <FootTypo
              footlabel="Our Policy for Creating a Decor Service"
              className="text-2xl font-semibold border-b-[1px] pt-10 pb-5"
            />

            {/* Policy Content */}
            <div className="bg-transparent p-5 rounded-lg w-full shadow-md space-y-5">
              <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
              <FootTypo footlabel="Before creating a decor service, please ensure that:" />
              <ul className="list-disc text-sm ml-5 mt-2 space-y-3">
                <li>Your service complies with all legal regulations.</li>
                <li>All provided information is accurate and up to date.</li>
                <li>You agree to follow marketplace policies.</li>
                <li>Failure to comply may result in account suspension.</li>
              </ul>
            </div>

            {/* Policy Agreement Checkbox */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                {...register("agreePolicy", {
                  required: "You must agree to the policy before proceeding.",
                })}
                className="mr-2 w-5 h-5"
              />
              <FootTypo footlabel="I have read and agree to the marketplace policies." />
            </div>

            {errors.agreePolicy && (
              <FootTypo
                footlabel="You must agree to proceed."
                className="text-red"
              />
            )}

            <Button2
              onClick={handleSubmit(onSubmit)}
              label="Accept & Procceed"
              btnClass="my-10"
              loading={isPending}
            />
          </div>
        </Step>
      </Stepper>
    </SellerWrapper>
  );
};

export default ServiceCreate;
