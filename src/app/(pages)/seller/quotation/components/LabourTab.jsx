"use client";

import React from "react";
import { MdAdd } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoIosRemove } from "react-icons/io";
import { formatCurrency } from "@/app/helpers";
import { AiOutlineStop } from "react-icons/ai";
import { TextField, Typography, Select, MenuItem } from "@mui/material";

// Define measurement unit options
const UNIT_OPTIONS = [
  { value: "m2", label: "Square meters (m²)" },
  { value: "m", label: "Meters (m)" },
];

const LabourTab = ({
  constructionTasks,
  onTaskChange,
  onAddTask,
  onRemoveTask,
  calculateConstructionTotal,
  register,
  control,
}) => {
  // Format number with thousand separators
  const formatNumber = (value) => {
    if (!value) return "";
    // Remove any non-digit characters
    const number = value.toString().replace(/\D/g, "");
    // Format with thousand separator
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle number input
  const handleNumberInput = (index, field, value) => {
    // Remove any non-digit characters
    const rawValue = value.replace(/\D/g, "");
    onTaskChange(index, field, rawValue);
  };

  // Register all tasks with react-hook-form
  React.useEffect(() => {
    constructionTasks.forEach((task, index) => {
      Object.keys(task).forEach((key) => {
        register(`constructionTasks.${index}.${key}`);
      });
    });
  }, [constructionTasks, register]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Cost <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Unit <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Area <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {constructionTasks.length > 0 ? (
                constructionTasks.map((task, index) => (
                  <tr key={`task-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextField
                        fullWidth
                        placeholder="Task name"
                        value={task.taskName || ""}
                        onChange={(e) =>
                          onTaskChange(index, "taskName", e.target.value)
                        }
                        error={!task.taskName}
                        helperText={!task.taskName && "Required field"}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E2E8F0",
                          },
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add detail notes"
                        value={task.note || ""}
                        onChange={(e) =>
                          onTaskChange(index, "note", e.target.value)
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E2E8F0",
                          },
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextField
                        fullWidth
                        placeholder="0"
                        value={formatNumber(task.cost)}
                        onChange={(e) =>
                          handleNumberInput(index, "cost", e.target.value)
                        }
                        error={!task.cost || parseFloat(task.cost) <= 0}
                        helperText={(!task.cost || parseFloat(task.cost) <= 0) && "Must be greater than 0"}
                        InputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E2E8F0",
                          },
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        fullWidth
                        value={task.unit || ""}
                        onChange={(e) =>
                          onTaskChange(index, "unit", e.target.value)
                        }
                        error={!task.unit}
                        displayEmpty
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E2E8F0",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select unit
                        </MenuItem>
                        {UNIT_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextField
                        fullWidth
                        placeholder="0"
                        value={formatNumber(task.area)}
                        onChange={(e) =>
                          handleNumberInput(index, "area", e.target.value)
                        }
                        error={!task.area || parseFloat(task.area) <= 0}
                        helperText={(!task.area || parseFloat(task.area) <= 0) && "Must be greater than 0"}
                        InputProps={{
                          inputProps: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E2E8F0",
                          },
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {constructionTasks.length > 1 ? (
                        <Button
                          label="Remove"
                          onClick={() => onRemoveTask(index)}
                          className="bg-red"
                          icon={<IoIosRemove size={18} />}
                        />
                      ) : (
                        <AiOutlineStop size={18} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No construction tasks added. Add a new task to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          label="Add Labour Task"
          onClick={onAddTask}
          icon={<MdAdd size={20} />}
        />

        <div className="text-right">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Labour Cost:
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {formatCurrency(calculateConstructionTotal())}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LabourTab;
