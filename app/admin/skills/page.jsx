"use client";

import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiX,
  FiCheck,
  FiEdit2,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { openModal } from "@/lib/redux/slices/modalSlice";
import PageLoader from "@/components/PageLoader";

// Schema for a single skill item
const skillItemSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  image: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  percentage: z.number().min(0).max(100).optional().default(50),
});

export default function SkillsManagementPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // UI State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null); // Category being edited or added to
  const [editingSkillIndex, setEditingSkillIndex] = useState(null); // Index of skill being edited inside activeCategory

  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); // For renaming category

  // Form for Skill Item
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillItemSchema),
    defaultValues: { name: "", image: "", percentage: 50 },
  });

  // --- QUERIES ---

  // Fetch All Categories (which include their skills)
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const data = await api.get("/skills");
      return data || [];
    },
  });

  // --- MUTATIONS ---

  // 1. Create Category
  const createCategoryMutation = useMutation({
    mutationFn: async (title) => {
      return api.post("/skills", {
        title,
        skills: [],
        order: categories.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["skills"]);
      setNewCategoryTitle("");
      setIsCategoryModalOpen(false);
      dispatch(
        openModal({
          title: "Success",
          message: "Category created!",
          type: "success",
        }),
      );
    },
    onError: (err) =>
      dispatch(
        openModal({ title: "Error", message: err.message, type: "error" }),
      ),
  });

  // 2. Update Category (Used for Renaming OR Updating Skills List)
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return api.put(`/skills/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["skills"]);
      setIsSkillModalOpen(false);
      setEditingCategory(null);
      dispatch(
        openModal({
          title: "Success",
          message: "Saved successfully!",
          type: "success",
        }),
      );
    },
    onError: (err) =>
      dispatch(
        openModal({ title: "Error", message: err.message, type: "error" }),
      ),
  });

  // 3. Delete Category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["skills"]);
      dispatch(
        openModal({
          title: "Success",
          message: "Category deleted!",
          type: "success",
        }),
      );
    },
    onError: (err) =>
      dispatch(
        openModal({ title: "Error", message: err.message, type: "error" }),
      ),
  });

  // --- HANDLERS ---

  // Category Handlers
  const handleAddCategory = () => {
    if (!newCategoryTitle.trim()) return;
    createCategoryMutation.mutate(newCategoryTitle);
  };

  const handleDeleteCategory = (id) => {
    dispatch(
      openModal({
        title: "Delete Category",
        message: "Delete this category and all its skills?",
        type: "warning",
        showCancel: true,
        onConfirm: () => deleteCategoryMutation.mutate(id),
        confirmText: "Delete",
      }),
    );
  };

  const handleUpdateCategoryTitle = (category) => {
    if (!category.title.trim()) return;
    updateCategoryMutation.mutate({
      id: category._id,
      data: { title: category.title },
    });
  };

  // Skill Handlers
  const openAddSkillModal = (category) => {
    setActiveCategory(category);
    setEditingSkillIndex(null);
    reset({ name: "", image: "", percentage: 50 });
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (category, skill, index) => {
    setActiveCategory(category);
    setEditingSkillIndex(index);
    reset(skill);
    setIsSkillModalOpen(true);
  };

  const onSubmitSkill = (data) => {
    if (!activeCategory) return;

    let updatedSkills = [...(activeCategory.skills || [])];

    if (editingSkillIndex !== null) {
      // Edit existing
      updatedSkills[editingSkillIndex] = data;
    } else {
      // Add new
      updatedSkills.push(data);
    }

    updateCategoryMutation.mutate({
      id: activeCategory._id,
      data: { skills: updatedSkills },
    });
  };

  const handleDeleteSkill = (category, index) => {
    const updatedSkills = category.skills.filter((_, i) => i !== index);

    dispatch(
      openModal({
        title: "Delete Skill",
        message: "Are you sure?",
        type: "warning",
        showCancel: true,
        confirmText: "Delete",
        onConfirm: () =>
          updateCategoryMutation.mutate({
            id: category._id,
            data: { skills: updatedSkills },
          }),
      }),
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Skills Management</h1>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3 text-sm font-semibold text-white cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
        >
          <FiPlus />
          Add Category
        </button>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-[#0f0f14] border border-white/10 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              {editingCategory === category._id ? (
                <div className="flex gap-2 items-center">
                  <input
                    defaultValue={category.title}
                    onChange={(e) => (category.tempTitle = e.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-3 py-1 text-white"
                  />
                  <button
                    onClick={() =>
                      handleUpdateCategoryTitle({
                        ...category,
                        title: category.tempTitle || category.title,
                      })
                    }
                    className="text-green-500"
                  >
                    <FiCheck size={20} />
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="text-red-500"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-gray-100">
                  {category.title}
                </h2>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openAddSkillModal(category)}
                  className="bg-purple-600/10 border border-purple-600/30 rounded-md p-2 text-purple-600 hover:bg-purple-600/20 flex gap-2 items-center text-sm"
                >
                  <FiPlus /> Add Skill
                </button>
                <button
                  onClick={() => setEditingCategory(category._id)}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-md p-2 text-blue-500 hover:bg-blue-500/20"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500/10 border border-red-500/30 rounded-md p-2 text-red-500 hover:bg-red-500/20"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.skills?.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/5 rounded-lg p-4 flex items-center justify-between group hover:border-purple-600/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-200">
                        {skill.name}
                      </h4>
                      <div className="text-xs text-purple-400">
                        {skill.percentage}% Proficiency
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditSkillModal(category, skill, idx)}
                      className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(category, idx)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
              {(!category.skills || category.skills.length === 0) && (
                <div className="text-gray-500 text-sm italic py-4 col-span-full text-center">
                  No skills added yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a20] p-6 rounded-xl border border-white/10 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              Add New Category
            </h3>
            <input
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              placeholder="Category Name (e.g. Frontend)"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white mb-4 focus:border-purple-500 outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={createCategoryMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                {createCategoryMutation.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a20] p-6 rounded-xl border border-white/10 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingSkillIndex !== null ? "Edit Skill" : "Add Skill"}
            </h3>
            <form
              onSubmit={handleSubmit(onSubmitSkill)}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Skill Name
                </label>
                <input
                  {...register("name")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Icon URL
                </label>
                <input
                  {...register("image")}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                />
                {errors.image && (
                  <span className="text-red-500 text-xs">
                    {errors.image.message}
                  </span>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Proficiency (%)
                </label>
                <input
                  type="number"
                  {...register("percentage", { valueAsNumber: true })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                />
                {errors.percentage && (
                  <span className="text-red-500 text-xs">
                    {errors.percentage.message}
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCategoryMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {updateCategoryMutation.isPending
                    ? "Saving..."
                    : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
