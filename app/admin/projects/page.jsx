"use client";

import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiCode,
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { openModal } from "@/lib/redux/slices/modalSlice";
import PageLoader from "@/components/PageLoader";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.string().min(1, "Category is required"),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  webapp: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function ProjectsManagementPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [techInput, setTechInput] = useState("");
  const [currentTech, setCurrentTech] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  // Fetch Projects Data
  const { data: projectsList, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data || [];
    },
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = editingProject
        ? `/projects/${editingProject._id}`
        : "/projects";
      const method = editingProject ? "put" : "post";
      return api[method](url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      handleCloseModal();
      dispatch(
        openModal({
          title: "Success",
          message: editingProject
            ? "Project updated successfully!"
            : "Project added successfully!",
          type: "success",
        }),
      );
    },
    onError: (error) => {
      dispatch(
        openModal({
          title: "Error",
          message: error.message || "Failed to save project.",
          type: "error",
        }),
      );
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      dispatch(
        openModal({
          title: "Success",
          message: "Project deleted successfully!",
          type: "success",
        }),
      );
    },
    onError: (error) => {
      dispatch(
        openModal({
          title: "Error",
          message: error.message || "Failed to delete project.",
          type: "error",
        }),
      );
    },
  });

  const handleOpenModal = (project) => {
    if (project) {
      setEditingProject(project);
      setCurrentTech(project.tags || []);
      reset(project);
    } else {
      setEditingProject(null);
      setCurrentTech([]);
      reset({
        title: "",
        date: "",
        description: "",
        image: "",
        tags: [],
        category: "",
        github: "",
        webapp: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setCurrentTech([]);
    setTechInput("");
    reset();
  };

  const handleAddTech = () => {
    if (techInput.trim() && !currentTech.includes(techInput.trim())) {
      const newTech = [...currentTech, techInput.trim()];
      setCurrentTech(newTech);
      setValue("tags", newTech);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tagToRemove) => {
    const newTech = currentTech.filter((tag) => tag !== tagToRemove);
    setCurrentTech(newTech);
    setValue("tags", newTech);
  };

  const onSubmit = (data) => {
    saveMutation.mutate({ ...data, tags: currentTech });
  };

  const handleDelete = (id) => {
    dispatch(
      openModal({
        isOpen: true,
        title: "Delete Project",
        message:
          "Are you sure you want to delete this project? This action cannot be undone.",
        type: "warning",
        showCancel: true,
        confirmText: "Delete",
        onConfirm: () => deleteMutation.mutate(id),
      }),
    );
  };

  const closeGlobalModal = () => {
    // Config handled by Redux now
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-[1400px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">
          Projects Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3 text-sm font-semibold text-white cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
        >
          <FiPlus />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsList?.map((project) => (
          <div
            key={project._id}
            className="bg-[#0f0f14] border border-white/10 rounded-xl overflow-hidden transition-all hover:border-purple-600/50"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {project.title}
                  </h3>
                  <div className="text-xs text-purple-600 mb-2">
                    {project.date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(project)}
                    className="bg-purple-600/10 border border-purple-600/30 rounded-md p-1.5 text-purple-600 cursor-pointer transition-all hover:bg-purple-600/20"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500/10 border border-red-500/30 rounded-md p-1.5 text-red-500 cursor-pointer transition-all hover:bg-red-500/20"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags?.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-600/10 border border-purple-600/30 rounded px-2 py-1 text-xs text-purple-600"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags?.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-purple-600 hover:underline"
                  >
                    <FiGithub /> GitHub
                  </a>
                )}
                {project.webapp && (
                  <a
                    href={project.webapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-purple-600 hover:underline"
                  >
                    <FiExternalLink /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5">
          <div className="bg-[#0f0f14] border border-white/10 rounded-xl p-8 max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-100">
                {editingProject ? "Edit" : "Add"} Project
              </h2>
              <button
                onClick={handleCloseModal}
                className="bg-none border-none text-gray-400 cursor-pointer p-1 hover:text-gray-100"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-100">
                    Project Title
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g., Portfolio Website"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-sm">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-100">
                    Date
                  </label>
                  <input
                    {...register("date")}
                    placeholder="e.g., Jan 2024 - Present"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  {errors.date && (
                    <span className="text-red-500 text-sm">
                      {errors.date.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe your project..."
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 resize-none"
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Image URL
                </label>
                <input
                  {...register("image")}
                  placeholder="https://example.com/project.png"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
                {errors.image && (
                  <span className="text-red-500 text-sm">
                    {errors.image.message}
                  </span>
                )}
              </div>

              <label className="text-sm font-medium text-gray-100">
                Category
              </label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    {...register("category")}
                    placeholder="Type custom or select from below"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("category", "static", { shouldValidate: true })
                    }
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      projectsList?.find((p) => p.category === "static")
                        ? "bg-purple-600/20 border-purple-600 text-purple-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    Static / Interactive
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setValue("category", "live", { shouldValidate: true })
                    }
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      projectsList?.find((p) => p.category === "live")
                        ? "bg-purple-600/20 border-purple-600 text-purple-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    Live Demo
                  </button>

                  {/* Dynamic Categories from existing projects */}
                  {[...new Set(projectsList?.map((p) => p.category))]
                    .filter((c) => c !== "static" && c !== "live" && c)
                    .map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setValue("category", cat, { shouldValidate: true })
                        }
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-purple-600/20 hover:border-purple-600 hover:text-purple-400 transition-all"
                      >
                        {cat}
                      </button>
                    ))}
                </div>
              </div>
              {errors.category && (
                <span className="text-red-500 text-sm">
                  {errors.category.message}
                </span>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTech())
                    }
                    placeholder="Add a tag and press Enter"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="bg-purple-600/10 border border-purple-600/30 rounded-lg px-4 py-3 text-purple-600 cursor-pointer hover:bg-purple-600/20"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTech.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-600/10 border border-purple-600/30 rounded px-3 py-1 text-sm text-purple-600 flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tag)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.tags && (
                  <span className="text-red-500 text-sm">
                    {errors.tags.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-100">
                    GitHub URL (Optional)
                  </label>
                  <input
                    {...register("github")}
                    placeholder="https://github.com/..."
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  {errors.github && (
                    <span className="text-red-500 text-sm">
                      {errors.github.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-100">
                    Live Demo URL (Optional)
                  </label>
                  <input
                    {...register("webapp")}
                    placeholder="https://example.com"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  {errors.webapp && (
                    <span className="text-red-500 text-sm">
                      {errors.webapp.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3.5 text-base font-semibold text-white cursor-pointer flex items-center justify-center gap-2 mt-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave />
                {saveMutation.isPending ? "Saving..." : "Save Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
