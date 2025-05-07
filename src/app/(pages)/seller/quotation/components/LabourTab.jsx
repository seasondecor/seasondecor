"use client";

import React from "react";
import { MdAdd } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import Input from "@/app/components/ui/Inputs/Input";
import { IoIosRemove } from "react-icons/io";
import { formatCurrency } from "@/app/helpers";
import { AiOutlineStop } from "react-icons/ai";
import { Textarea } from "@headlessui/react";

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
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Cost <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Unit <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Dimension <span className="text-red">*</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {constructionTasks.length > 0 ? (
                constructionTasks.map((task, index) => (
                  <tr key={`task-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`constructionTasks.${index}.taskName`}
                        name={`constructionTasks.${index}.taskName`}
                        value={task.taskName || ""}
                        onChange={(e) =>
                          onTaskChange(index, "taskName", e.target.value)
                        }
                        className={`pl-3 ${!task.taskName ? "border-red" : ""}`}
                        placeholder="Task name"
                        required
                        register={() => ({})}
                      />
                      {!task.taskName && (
                        <p className="text-red text-xs mt-1">Required field</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Textarea
                        id={`constructionTasks.${index}.note`}
                        name={`constructionTasks.${index}.note`}
                        value={task.note || ""}
                        onChange={(e) =>
                          onTaskChange(index, "note", e.target.value)
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
                        id={`constructionTasks.${index}.cost`}
                        name={`constructionTasks.${index}.cost`}
                        type="text"
                        pattern="^\d+(\.\d{1,2})?$"
                        maxLength="10"
                        value={task.cost}
                        onChange={(e) => {
                          // Store the raw input value without parsing
                          const rawValue = e.target.value;
                          //console.log(`Setting task ${index} cost to:`, rawValue);
                          onTaskChange(index, "cost", rawValue);
                        }}
                        className={`pl-3 ${
                          !task.cost || parseFloat(task.cost) <= 0
                            ? "border-red"
                            : ""
                        }`}
                        placeholder="0"
                        register={() => ({})}
                        control={control}
                        required
                      />
                      {(!task.cost || parseFloat(task.cost) <= 0) && (
                        <p className="text-red text-xs mt-1">
                          Must be greater than 0
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        id={`constructionTasks.${index}.unit`}
                        name={`constructionTasks.${index}.unit`}
                        value={task.unit || ""}
                        onChange={(e) =>
                          onTaskChange(index, "unit", e.target.value)
                        }
                        className={`pl-3 py-2 rounded-md border ${
                          !task.unit ? "border-red" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full`}
                        required
                      >
                        <option value="" disabled>
                          Select unit
                        </option>
                        {UNIT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {!task.unit && (
                        <p className="text-red text-xs mt-1">Required field</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        id={`constructionTasks.${index}.area`}
                        name={`constructionTasks.${index}.area`}
                        value={task.area || 0}
                        onChange={(e) =>
                          onTaskChange(
                            index,
                            "area",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={`pl-3 ${task.area <= 0 ? "border-red" : ""}`}
                        min="1"
                        placeholder="0"
                        required
                        register={() => ({})}
                      />
                      {task.area <= 0 && (
                        <p className="text-red text-xs mt-1">
                          Must be greater than 0
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {constructionTasks.length > 1 ? (
                        <Button
                          label="Remove"
                          onClick={() => onRemoveTask(index)}
                          className="bg-red"
                          icon={<IoIosRemove size={20} />}
                        />
                      ) : (
                        <AiOutlineStop size={20} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
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
          <div className="text-sm text-gray-500 mb-1">Total Labour Cost:</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(calculateConstructionTotal())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourTab;
