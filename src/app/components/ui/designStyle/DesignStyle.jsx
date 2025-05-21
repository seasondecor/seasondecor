import React from "react";
import { motion } from "framer-motion";
import { FootTypo } from "../Typography";
import { MdCheck } from "react-icons/md";
import { HiMiniHomeModern } from "react-icons/hi2";
import {
  GiGreekTemple,
  GiWaveSurfer,
  GiPineTree,
  GiWoodCabin,
} from "react-icons/gi";
import { FaIndustry } from "react-icons/fa";

/**
 * A beautiful component to display design styles as animated cards
 * @param {Object} props
 * @param {Array} props.styles - Array of style objects with id and name properties
 * @param {String} props.className - Additional CSS classes
 * @param {Boolean} props.selectable - Whether the styles are selectable
 * @param {String} props.selectedStyle - ID of the selected style
 * @param {Function} props.onSelectStyle - Callback when a style is selected
 * @param {Boolean} props.compact - Whether to use compact mode for ServiceCard
 */

const styleIcons = {
  Modern: <HiMiniHomeModern size={24} />,
  Traditional: <GiGreekTemple size={24} />,
  Coastal: <GiWaveSurfer size={24} />,
  Scandinavian: <GiPineTree size={24} />,
  Industrial: <FaIndustry size={24} />,
  Rustic: <GiWoodCabin size={24} />,
};

const DesignStyle = ({
  styles = [],
  className,
  selectable = false,
  selectedStyle = "",
  onSelectStyle,
  compact = false,
}) => {
  const displayStyles = styles;

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  };

  const handleStyleClick = (styleId) => {
    if (selectable && onSelectStyle) {
      onSelectStyle(styleId);
    }
  };

  // Get the appropriate icon for a style
  const getStyleIcon = (styleName) => {
    return styleIcons[styleName] || <GiGreekTemple size={compact ? 16 : 24} />;
  };

  const gridClassName = compact
    ? "grid grid-cols-3 gap-2"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";

  return (
    <div className={`${className || ""}`}>
      <motion.div
        className={gridClassName}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {displayStyles.map((style) => {
          const isSelected = selectedStyle === style.id;

          return (
            <motion.div
              key={style.id}
              variants={itemVariants}
              whileHover={{ scale: compact ? 1.02 : 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStyleClick(style.id)}
              className={`relative ${compact ? 'p-0' : 'p-5'} rounded-xl transition-all duration-300
                ${selectable ? "cursor-pointer" : ""} 
                ${compact ? 'border border-gray-200' : ''}
                ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-100 to-blue-300 border-2 border-blue-500 shadow-md"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
            >
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
                <div className="text-blue-600 dark:text-blue-400">
                  {getStyleIcon(style.name)}
                </div>
                <FootTypo 
                  footlabel={style.name} 
                  fontWeight="bold"
                  className={compact ? "text-xs" : ""}
                />
                {selectable && isSelected && (
                  <span className="text-primary absolute top-2 right-2">
                    <MdCheck size={compact ? 16 : 20} />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DesignStyle;
