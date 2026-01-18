"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import Modal from "@/components/Modal";

export default function SkillsManagementPage() {
  const [skillCategories, setSkillCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    skills: [{ name: "", image: "", percentage: 50 }],
    order: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      const data = await response.json();
      setSkillCategories(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleOpenModal = (category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        title: "",
        skills: [{ name: "", image: "", percentage: 50 }],
        order: skillCategories.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: "", image: "", percentage: 50 }],
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...formData.skills];
    newSkills[index][field] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingCategory
        ? `/api/skills/${editingCategory._id}`
        : "/api/skills";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSkills();
        handleCloseModal();
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: editingCategory
            ? "Skill category updated successfully!"
            : "Skill category added successfully!",
          type: "success",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving skill category:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to save skill category. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Skill Category",
      message:
        "Are you sure you want to delete this skill category? This action cannot be undone.",
      type: "warning",
      showCancel: true,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/skills/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            await fetchSkills();
            setModalConfig({
              isOpen: true,
              title: "Success",
              message: "Skill category deleted successfully!",
              type: "success",
            });
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting skill category:", error);
          setModalConfig({
            isOpen: true,
            title: "Error",
            message: "Failed to delete skill category.",
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
        <h1 className="text-3xl font-bold text-gray-100">Skills Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3 text-sm font-semibold text-white cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
        >
          <FiPlus />
          Add Skill Category
        </button>
      </div>

      <div className="grid gap-6">
        {skillCategories.map((category) => (
          <div
            key={category._id}
            className="bg-[#0f0f14] border border-white/10 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-100">
                {category.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="bg-purple-600/10 border border-purple-600/30 rounded-md p-2 text-purple-600 cursor-pointer transition-all hover:bg-purple-600/20"
                >
                  <FiEdit2 className="text-base" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="bg-red-500/10 border border-red-500/30 rounded-md p-2 text-red-500 cursor-pointer transition-all hover:bg-red-500/20"
                >
                  <FiTrash2 className="text-base" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-purple-600/10 border border-purple-600/30 rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-100"
                >
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="w-5 h-5 object-contain"
                  />
                  {skill.name}
                  {skill.percentage && (
                    <span className="text-gray-400 text-xs bg-white/10 px-1.5 py-0.5 rounded">
                      {skill.percentage}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5">
          <div className="bg-[#0f0f14] border border-white/10 rounded-xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-100">
                {editingCategory ? "Edit" : "Add"} Skill Category
              </h2>
              <button
                onClick={handleCloseModal}
                className="bg-none border-none text-gray-400 cursor-pointer p-1 hover:text-gray-100"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Category Title
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Frontend"
                  required
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Skills
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          value={skill.name}
                          onChange={(e) =>
                            handleSkillChange(index, "name", e.target.value)
                          }
                          placeholder="Skill name"
                          required
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          value={skill.image}
                          onChange={(e) =>
                            handleSkillChange(index, "image", e.target.value)
                          }
                          placeholder="Image URL"
                          required
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                        />
                      </div>
                      <div className="flex-[0.5] flex flex-col gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.percentage || 50}
                          onChange={(e) =>
                            handleSkillChange(
                              index,
                              "percentage",
                              parseInt(e.target.value),
                            )
                          }
                          placeholder="%"
                          title="Proficiency"
                          required
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                        />
                      </div>
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3 text-red-500 text-sm cursor-pointer whitespace-nowrap hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-purple-600/10 border border-purple-600/30 rounded-md px-4 py-3 text-purple-600 text-sm cursor-pointer whitespace-nowrap hover:bg-purple-600/20"
                >
                  + Add Skill
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3.5 text-base font-semibold text-white cursor-pointer flex items-center justify-center gap-2 mt-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave />
                {isLoading ? "Saving..." : "Save Category"}
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
