"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiUpload, FiSave, FiX } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { openModal } from "@/lib/redux/slices/modalSlice";
import PageLoader from "@/components/PageLoader";

const bioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  description: z.string().min(1, "Description is required"),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  resume: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  insta: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  facebook: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function BioManagementPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [currentRoles, setCurrentRoles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bioSchema),
  });

  // Fetch Bio Data
  const { data: bio, isLoading } = useQuery({
    queryKey: ["bio"],
    queryFn: async () => {
      const data = await api.get("/bio");
      return data || null;
    },
  });

  // Update Form when data loads
  useEffect(() => {
    if (bio) {
      reset({
        name: bio.name,
        description: bio.description,
        github: bio.github || "",
        resume: bio.resume || "",
        linkedin: bio.linkedin || "",
        twitter: bio.twitter || "",
        insta: bio.insta || "",
        facebook: bio.facebook || "",
      });
      setCurrentRoles(bio.roles || []);
      setImagePreview(bio.img || "");
    }
  }, [bio, reset]);

  // Mutation for saving bio
  const mutation = useMutation({
    mutationFn: async (data) => {
      return api.put("/bio", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bio"]);
      dispatch(
        openModal({
          title: "Success",
          message: "Bio updated successfully!",
          type: "success",
        }),
      );
    },
    onError: (error) => {
      dispatch(
        openModal({
          title: "Error",
          message: error.message || "Failed to save bio.",
          type: "error",
        }),
      );
    },
  });

  const handleAddRole = () => {
    if (roleInput.trim() && !currentRoles.includes(roleInput.trim())) {
      const newRoles = [...currentRoles, roleInput.trim()];
      setCurrentRoles(newRoles);
      setValue("roles", newRoles);
      setRoleInput("");
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    const newRoles = currentRoles.filter((role) => role !== roleToRemove);
    setCurrentRoles(newRoles);
    setValue("roles", newRoles);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!file) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      dispatch(
        openModal({
          title: "Upload Error",
          message: "Failed to upload image. Please try again.",
          type: "error",
        }),
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    let imageUrl = bio?.img || "";

    if (file) {
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        // If image upload failed, stop the submission
        return;
      }
    }

    const bioData = {
      ...data,
      roles: currentRoles,
      img: imageUrl,
    };

    mutation.mutate(bioData);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-[1000px]">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">
        Bio / Profile Management
      </h1>
      <p className="text-base text-gray-400 mb-8">
        Update your personal information and profile
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#0f0f14] border border-white/10 rounded-xl p-8"
      >
        <div className="grid gap-6">
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-100">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-600"
                />
              )}
              <label className="bg-purple-600/10 border border-purple-600/30 rounded-lg px-4 py-3 text-purple-600 cursor-pointer hover:bg-purple-600/20 flex items-center gap-2">
                <FiUpload />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-100">Name</label>
            <input
              {...register("name")}
              placeholder="Your full name"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 focus:bg-white/8 placeholder:text-gray-400"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Roles */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-100">Roles</label>
            <div className="flex gap-2">
              <input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddRole())
                }
                placeholder="Add a role and press Enter"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="bg-purple-600/10 border border-purple-600/30 rounded-lg px-4 py-3 text-purple-600 cursor-pointer hover:bg-purple-600/20"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="bg-purple-600/10 border border-purple-600/30 rounded px-3 py-1 text-sm text-purple-600 flex items-center gap-2"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
            {errors.roles && (
              <span className="text-red-500 text-sm">
                {errors.roles.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-100">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Tell us about yourself..."
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 focus:bg-white/8 placeholder:text-gray-400 resize-vertical min-h-[120px]"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-100">
                GitHub URL
              </label>
              <input
                {...register("github")}
                placeholder="https://github.com/username"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              {errors.github && (
                <span className="text-red-500 text-sm">
                  {errors.github.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-100">
                Resume URL
              </label>
              <input
                {...register("resume")}
                placeholder="https://example.com/resume.pdf"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              {errors.resume && (
                <span className="text-red-500 text-sm">
                  {errors.resume.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-100">
                LinkedIn URL
              </label>
              <input
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/username"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              {errors.linkedin && (
                <span className="text-red-500 text-sm">
                  {errors.linkedin.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-100">
                Twitter URL
              </label>
              <input
                {...register("twitter")}
                placeholder="https://twitter.com/username"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              {errors.twitter && (
                <span className="text-red-500 text-sm">
                  {errors.twitter.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-100">
                Instagram URL
              </label>
              <input
                {...register("insta")}
                placeholder="https://instagram.com/username"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              {errors.insta && (
                <span className="text-red-500 text-sm">
                  {errors.insta.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-100">
                Facebook URL
              </label>
              <input
                {...register("facebook")}
                placeholder="https://facebook.com/username"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-gray-100 focus:outline-none focus:border-purple-600 placeholder:text-gray-400"
              />
              {errors.facebook && (
                <span className="text-red-500 text-sm">
                  {errors.facebook.message}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending || isUploading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 border-none rounded-lg px-6 py-3.5 text-base font-semibold text-white cursor-pointer flex items-center justify-center gap-2 mt-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave />
            {mutation.isPending || isUploading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
