"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  date: z.string().min(1, "Date is required"),
  grade: z.string().optional(),
  desc: z.string().min(1, "Description is required"),
  img: z.string().url("Must be a valid URL"),
});

export default function EducationManagementPage() {
  const [educationList, setEducationList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationSchema),
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/education");
      const data = await response.json();
      setEducationList(data);
    } catch (error) {
      console.error("Error fetching education:", error);
    }
  };

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      reset(item);
    } else {
      setEditingItem(null);
      reset({
        school: "",
        degree: "",
        date: "",
        grade: "",
        desc: "",
        img: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const url = editingItem
        ? `/api/education/${editingItem._id}`
        : "/api/education";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchEducation();
        handleCloseModal();
      } else {
        alert("Failed to save education");
      }
    } catch (error) {
      console.error("Error saving education:", error);
      alert("Failed to save education");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchEducation();
      } else {
        alert("Failed to delete education");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education");
    }
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">
          Education Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3 text-sm font-semibold text-white cursor-pointer flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
        >
          <FiPlus />
          Add Education
        </button>
      </div>

      <div className="grid gap-6">
        {educationList.map((item) => (
          <div
            key={item._id}
            className="bg-[#0f0f14] border border-white/10 rounded-xl p-6 flex gap-5"
          >
            <img
              src={item.img}
              alt={item.school}
              className="w-20 h-20 rounded-[10px] object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-1">
                    {item.degree}
                  </h3>
                  <div className="text-sm text-gray-400 mb-1">
                    {item.school}
                  </div>
                  <div className="text-xs text-purple-600">{item.date}</div>
                  {item.grade && (
                    <div className="text-sm text-gray-400 mt-1">
                      Grade: {item.grade}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="bg-purple-600/10 border border-purple-600/30 rounded-md p-2 text-purple-600 cursor-pointer transition-all hover:bg-purple-600/20"
                  >
                    <FiEdit2 className="text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500/10 border border-red-500/30 rounded-md p-2 text-red-500 cursor-pointer transition-all hover:bg-red-500/20"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {item.desc}
              </p>
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
                {editingItem ? "Edit" : "Add"} Education
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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  School/University
                </label>
                <input
                  {...register("school")}
                  placeholder="e.g., MIT"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
                {errors.school && (
                  <span className="text-red-500 text-sm">
                    {errors.school.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Degree
                </label>
                <input
                  {...register("degree")}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
                {errors.degree && (
                  <span className="text-red-500 text-sm">
                    {errors.degree.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Date
                </label>
                <input
                  {...register("date")}
                  placeholder="e.g., Sep 2018 - Jun 2022"
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
                  Grade (Optional)
                </label>
                <input
                  {...register("grade")}
                  placeholder="e.g., 3.8 GPA"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-100">
                  Description
                </label>
                <textarea
                  {...register("desc")}
                  rows={4}
                  placeholder="Describe your education..."
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
                  Image URL
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

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3.5 text-base font-semibold text-white cursor-pointer flex items-center justify-center gap-2 mt-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave />
                {isLoading ? "Saving..." : "Save Education"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
