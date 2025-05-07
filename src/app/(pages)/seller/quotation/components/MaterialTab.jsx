"use client";

import React from "react";
import { MdAdd } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoIosRemove } from "react-icons/io";
import Input from "@/app/components/ui/Inputs/Input";
import { formatCurrency } from "@/app/helpers";
import { AiOutlineStop } from "react-icons/ai";
import { Textarea } from "@headlessui/react";

const MaterialTab = ({
  materials,
  onMaterialChange,
  onAddMaterial,
  onRemoveMaterial,
  calculateMaterialTotal,
  register,
  control,
}) => {
  // Register all materials with react-hook-form
  React.useEffect(() => {
    materials.forEach((material, index) => {
      Object.keys(material).forEach((key) => {
        register(`materials.${index}.${key}`);
      });
    });
  }, [materials, register]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Quantity <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Cost <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <tr key={`material-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`materials.${index}.materialName`}
                        name={`materials.${index}.materialName`}
                        value={material.materialName || ""}
                        onChange={(e) =>
                          onMaterialChange(
                            index,
                            "materialName",
                            e.target.value
                          )
                        }
                        className={`pl-3 ${
                          !material.materialName ? "border-red" : ""
                        }`}
                        placeholder="Material name"
                        required
                        register={() => ({})}
                      />
                      {!material.materialName && (
                        <p className="text-red text-xs mt-1">Required field</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Textarea
                        id={`materials.${index}.note`}
                        name={`materials.${index}.note`}
                        value={material.note || ""}
                        onChange={(e) =>
                          onMaterialChange(index, "note", e.target.value)
                        }
                        className="pl-3 w-full p-2 border rounded"
                        placeholder="Add detail notes"
                        rows={3}
                        required
                        //register={() => ({})}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`materials.${index}.quantity`}
                        name={`materials.${index}.quantity`}
                        value={material.quantity || 0}
                        onChange={(e) =>
                          onMaterialChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={`pl-3 ${
                          material.quantity <= 0 ? "border-red" : ""
                        }`}
                        min="1"
                        placeholder="0"
                        required
                        register={() => ({})}
                      />
                      {material.quantity <= 0 && (
                        <p className="text-red text-xs mt-1">
                          Must be greater than 0
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`materials.${index}.cost`}
                        name={`materials.${index}.cost`}
                        type="text"
                        value={material.cost}
                        onChange={(e) => {
                          // Store the raw input value without parsing
                          const rawValue = e.target.value;
                          //console.log(`Setting material ${index} cost to:`, rawValue);
                          onMaterialChange(index, "cost", rawValue);
                        }}
                        className={`pl-3 ${
                          !material.cost || parseFloat(material.cost) <= 0
                            ? "border-red"
                            : ""
                        }`}
                        placeholder="0"
                        required
                        register={() => ({})}
                        control={control}
                      />
                      {(!material.cost || parseFloat(material.cost) <= 0) && (
                        <p className="text-red text-xs mt-1">
                          Must be greater than 0
                        </p>
                      )}
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
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
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
          icon={<MdAdd size={20} />}
        />

        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            Total Materials Cost:
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(calculateMaterialTotal())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
