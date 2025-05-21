"use client";

import React from "react";
import { MdAdd } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoIosRemove } from "react-icons/io";
import { formatCurrency } from "@/app/helpers";
import { AiOutlineStop } from "react-icons/ai";
import { TextField, Typography } from "@mui/material";

const MaterialTab = ({
  materials,
  onMaterialChange,
  onAddMaterial,
  onRemoveMaterial,
  calculateMaterialTotal,
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
    onMaterialChange(index, field, rawValue);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Quantity <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Cost <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <tr key={`material-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextField
                        fullWidth
                        placeholder="Material name"
                        value={material.materialName || ""}
                        onChange={(e) =>
                          onMaterialChange(index, "materialName", e.target.value)
                        }
                        error={!material.materialName}
                        helperText={!material.materialName && "Required field"}
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
                        value={material.note || ""}
                        onChange={(e) =>
                          onMaterialChange(index, "note", e.target.value)
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
                        value={material.quantity}
                        onChange={(e) =>
                          handleNumberInput(index, "quantity", e.target.value)
                        }
                        error={material.quantity <= 0}
                        helperText={material.quantity <= 0 && "Must be greater than 0"}
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
                        value={formatNumber(material.cost)}
                        onChange={(e) =>
                          handleNumberInput(index, "cost", e.target.value)
                        }
                        error={!material.cost || parseFloat(material.cost) <= 0}
                        helperText={(!material.cost || parseFloat(material.cost) <= 0) && "Must be greater than 0"}
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
                      {materials.length > 1 ? (
                        <Button
                          label="Remove"
                          onClick={() => onRemoveMaterial(index)}
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
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No materials added. Add a new material to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          label="Add Material"
          onClick={onAddMaterial}
          icon={<MdAdd size={18} />}
        />

        <div className="text-right">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Materials Cost:
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {formatCurrency(calculateMaterialTotal())}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
