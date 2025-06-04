"use client";

import { BorderBox } from "../BorderBox";
import { FootTypo } from "../Typography";
import { MdOutlineEdit } from "react-icons/md";
import Image from "next/image";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { formatDateTime } from "@/app/helpers";
import { LuCalendarClock } from "react-icons/lu";
import { Box, TextField, Button } from "@mui/material";

const TrackingCard = ({ note, task, imageUrls, createdAt, editClick, removeClick }) => {
  return (
    <BorderBox>
      <Box 
        position="absolute" 
        top={0} 
        right={2.5} 
        display="flex" 
        alignItems="center" 
        gap={2}
      >
        <Button
          onClick={editClick}
          startIcon={<MdOutlineEdit />}
          className="bg-action text-white hover:bg-gray-200 hover:text-black"
          label="Edit Tracking"
        />
        <Button
          onClick={removeClick}
          startIcon={<MdOutlinePlaylistRemove />}
          className="bg-red text-white hover:bg-gray-200 hover:text-black"
          label="Remove Tracking"
        />
      </Box>

      <Box 
        position="absolute"
        top={-35}
        left={0}
        px={2}
        py={1}
        borderRadius="8px 8px 0 0"
        display="flex"
        alignItems="center"
        gap={1}
        className="dark:bg-transparent"
      >
        <LuCalendarClock className="text-primary" size={16} />
        {createdAt ? 
          (() => {
            const { date, time } = formatDateTime(createdAt);
            return (
              <Box component="span" fontSize="sm">
                <Box component="span" fontWeight="medium">{date}</Box>
                <Box component="span" mx={1}>•</Box>
                <Box component="span" className="text-gray-600 dark:text-gray-300">{time}</Box>
              </Box>
            );
          })() 
        : <Box component="span" fontSize="sm" color="text.secondary">No date available</Box>}
      </Box>

      {/* Task Section */}
      <Box display="flex" flexDirection="column" pt={3}>
        <FootTypo footlabel="Task" className="mb-4" />
        <TextField
          fullWidth
          multiline
          rows={2}
          value={task}
          placeholder="No task available"
          disabled
          variant="outlined"
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.100',
              borderRadius: 2,
              '& fieldset': {
                border: 'none'
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.100',
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'inherit'
                }
              }
            }
          }}
        />
      </Box>

      {/* Note Section */}
      <Box display="flex" flexDirection="column" mb={4}>
        <FootTypo footlabel="Note" className="mb-4" />
        <TextField
          fullWidth
          multiline
          rows={5}
          value={note}
          placeholder="No notes available"
          disabled
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.100',
              borderRadius: 2,
              '& fieldset': {
                border: 'none'
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.100',
                '& .MuiOutlinedInput-input': {
                  color: 'text.primary',
                  WebkitTextFillColor: 'inherit'
                }
              }
            }
          }}
        />
      </Box>

      {/* Images Gallery */}
      <Box>
        <FootTypo footlabel="Images" className="mb-2" />
        <Box mt={2}>
          {Array.isArray(imageUrls) && imageUrls.length > 0 ? (
            <Box 
              display="grid" 
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)'
              }}
              gap={2}
            >
              {imageUrls.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    aspectRatio: '1/1',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 1,
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Image
                    src={typeof image === 'string' ? image : (image.imageUrl || image.imageURL || image.url || '')}
                    alt={`Progress image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized={false}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box 
              textAlign="center" 
              py={3} 
              bgcolor="grey.50"
              borderRadius={2}
            >
              <FootTypo
                footlabel="No images available."
                sx={{ color: 'text.secondary' }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </BorderBox>
  );
};

export default TrackingCard;
