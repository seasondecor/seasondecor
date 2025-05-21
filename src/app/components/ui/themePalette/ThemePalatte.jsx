"use client";

import React from "react";
import { BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import { motion } from "framer-motion";
import { RiPaintFill } from "react-icons/ri";
import { MdCheck } from "react-icons/md";

/**
 * ThemePalette component displays the main theme colors used in a service design
 * @param {Object} props
 * @param {Array} props.colors - Array of color objects with id and colorCode
 * @param {String} props.title - Optional title for the color palette section
 * @param {Boolean} props.selectable - Whether colors are selectable
 * @param {Array} props.selectedColors - Array of selected color IDs
 * @param {Function} props.onSelectColor - Callback when a color is selected
 */
const ThemePalette = ({ 
  colors = [], 
  title = "Theme Colors", 
  selectable = false,
  selectedColors = [],
  onSelectColor
}) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const handleColorClick = (colorId) => {
    if (selectable && onSelectColor) {
      onSelectColor(colorId);
    }
  };

  return (
    <div className="w-full mb-8">
      <BodyTypo bodylabel={title} fontWeight="bold" className="pb-6" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {colors.map((color, index) => {
          const isSelected = selectedColors.includes(color.id, color.colorCode);
          const borderColor = isSelected ? 'border-4 border-primary' : 'border border-gray-200 dark:border-gray-700';
          
          return (
            <motion.div
              key={color.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center"
              onClick={() => handleColorClick(color.id)}
            >
              <div
                className={`w-full aspect-square rounded-lg shadow-md mb-2 hover:shadow-lg transition-all duration-300 ${selectable ? 'cursor-pointer' : ''} relative group overflow-hidden ${borderColor}`}
                style={{ backgroundColor: color.colorCode }}
              >
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                      <MdCheck className="text-primary" size={16} />
                    </div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-white font-medium px-2 py-1 rounded backdrop-blur-sm">
                      {color.colorCode}
                    </span>
                  </div>
                </div>
              </div>
              <FootTypo footlabel={color.colorCode} />
            </motion.div>
          );
        })}
      </div>

      {!selectable && (
        <div className="mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <FootTypo
            footlabel="These colors form the core palette for this design service and will be used throughout your space to create a cohesive aesthetic."
            className="text-gray-600 dark:text-gray-400"
          />
        </div>
      )}
    </div>
  );
};

export default ThemePalette;
