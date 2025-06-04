import { 
  MdOutlineEco, 
  MdOutlineChair, 
  MdSupportAgent, 
  MdColorLens,
  MdDesignServices,
  MdHighlight,
  MdOutlineArtTrack
} from "react-icons/md";

/**
 * Map of offering names to their corresponding icon components
 * Used to display consistent icons for each type of offering
 */
export const OFFERING_ICONS = {
  // Service Offerings
  "Eco-friendly Package": MdOutlineEco,
  "Theme Furniture": MdOutlineChair,
  "Consultation Support": MdSupportAgent,
  "Color Palette Matching": MdColorLens,
  "Custom Design": MdDesignServices,
  "Visual Focal Point": MdHighlight,
  "Artwork & Decor Placement": MdOutlineArtTrack,
  
  // Default fallback icon
  "default": MdDesignServices
};

/**
 * Get the icon component for a specific offering
 * @param {string} offeringName - The name of the offering
 * @returns {React.ComponentType} The icon component
 */
export const getOfferingIcon = (offeringName) => {
  return OFFERING_ICONS[offeringName] || OFFERING_ICONS.default;
};
