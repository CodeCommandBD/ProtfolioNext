"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import Modal from "@/components/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const experienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  date: z.string().min(1, "Date is required"),
  desc: z.string().min(1, "Description is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  doc: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  img: z.string().url("Must be a valid URL"),
});

export default function ExperienceManagementPage() {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [currentSkills, setCurrentSkills] = useState([]);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    confirmText: "OK",
    showCancel: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experience");
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  const handleOpenModal = (exp) => {
    if (exp) {
      setEditingExp(exp);
      setCurrentSkills(exp.skills || []);
      reset(exp);
    } else {
      setEditingExp(null);
      setCurrentSkills([]);
      reset({
        role: "",
        company: "",
        date: "",
        desc: "",
        skills: [],
        doc: "",
        img: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
    setCurrentSkills([]);
    setSkillInput("");
    reset();
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      const newSkills = [...currentSkills, skillInput.trim()];
      setCurrentSkills(newSkills);
      setValue("skills", newSkills);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = currentSkills.filter((skill) => skill !== skillToRemove);
    setCurrentSkills(newSkills);
    setValue("skills", newSkills);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = editingExp
        ? `/api/experience/${editingExp._id}`
        : "/api/experience";
      const method = editingExp ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, skills: currentSkills }),
      });

      if (response.ok) {
        await fetchExperiences();
        handleCloseModal();
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: editingExp
            ? "Experience updated successfully!"
            : "Experience added successfully!",
          type: "success",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to save experience. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Experience",
      message:
        "Are you sure you want to delete this experience? This action cannot be undone.",
      type: "warning",
      showCancel: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/experience/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            await fetchExperiences();
            setModalConfig({
              isOpen: true,
              title: "Success",
              message: "Experience deleted successfully!",
              type: "success",
            });
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting experience:", error);
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "Failed to delete experience.",
            type: "error",
          });
        }
      },
    });
  };

  const closeGlobalModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">
          Experience Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3 text-sm font-semibold text-white cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
        >
          <FiPlus />
          Add Experience
        </button>
      </div>

      <div className="grid gap-6">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="bg-[#0f0f14] border border-white/10 rounded-xl p-6 flex gap-5"
          >
            <img
              src={exp.img}
              alt={exp.company}
              className="w-20 h-20 rounded-[10px] object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {exp.role}
                  </h3>
                  <div className="text-sm text-gray-400 mb-1">
                    {exp.company}
                  </div>
                  <div className="text-xs text-purple-600">{exp.date}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(exp)}
                    className="bg-purple-600/10 border border-purple-600/30 rounded-md p-2 text-purple-600 cursor-pointer transition-all hover:bg-purple-600/20"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="bg-red-500/10 border border-red-500/30 rounded-md p-2 text-red-500 cursor-pointer transition-all hover:bg-red-500/20"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                {exp.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-600/10 border border-purple-600/30 rounded px-2 py-1 text-xs text-purple-600"
                  >
                    {skill}
                  </span>
                ))}
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
                {editingExp ? "Edit" : "Add"} Experience
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
                    Role/Position
                  </label>
                  <input
                    {...register("role")}
                    placeholder="e.g., Senior Developer"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  {errors.role && (
                    <span className="text-red-500 text-sm">
                      {errors.role.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-100">
                    Company
                  </label>
                  <input
                    {...register("company")}
                    placeholder="e.g., Google"
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  {errors.company && (
                    <span className="text-red-500 text-sm">
                      {errors.company.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Date
                </label>
                <input
                  {...register("date")}
                  placeholder="e.g., Jan 2023 - Present"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
                {errors.date && (
                  <span className="text-red-500 text-sm">
                    {errors.date.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Description
                </label>
                <textarea
                  {...register("desc")}
                  rows={4}
                  placeholder="Describe your role and responsibilities..."
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 resize-none"
                />
                {errors.desc && (
                  <span className="text-red-500 text-sm">
                    {errors.desc.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Skills Used
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSkill())
                    }
                    placeholder="Add a skill and press Enter"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-purple-600/10 border border-purple-600/30 rounded-lg px-4 py-3 text-purple-600 cursor-pointer hover:bg-purple-600/20"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-600/10 border border-purple-600/30 rounded px-3 py-1 text-sm text-purple-600 flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.skills && (
                  <span className="text-red-500 text-sm">
                    {errors.skills.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Company Logo URL
                </label>
                <input
                  {...register("img")}
                  placeholder="https://example.com/logo.png"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
                {errors.img && (
                  <span className="text-red-500 text-sm">
                    {errors.img.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Document URL (Optional)
                </label>
                <input
                  {...register("doc")}
                  placeholder="https://example.com/certificate.pdf"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
                {errors.doc && (
                  <span className="text-red-500 text-sm">
                    {errors.doc.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3.5 text-base font-semibold text-white cursor-pointer flex items-center justify-center gap-2 mt-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave />
                {isLoading ? "Saving..." : "Save Experience"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Global Message Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeGlobalModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
      />
    </div>
  );
}
