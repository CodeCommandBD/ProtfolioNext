"use client";

import { useEffect, useState } from "react";
import { FiUser, FiAward, FiBriefcase, FiBook, FiFolder } from "react-icons/fi";
import Link from "next/link";

const stats = [
  {
    label: "Bio / Profile",
    icon: FiUser,
    color: "#854ce6",
    key: "bio",
  },
  {
    label: "Skills",
    icon: FiAward,
    color: "#4ecdc4",
    key: "skills",
  },
  {
    label: "Experience",
    icon: FiBriefcase,
    color: "#ff6b6b",
    key: "experience",
  },
  {
    label: "Education",
    icon: FiBook,
    color: "#ffd93d",
    key: "education",
  },
  {
    label: "Projects",
    icon: FiFolder,
    color: "#6bcf7f",
    key: "projects",
  },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    bio: 0,
    skills: 0,
    experience: 0,
    education: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [bioRes, skillsRes, expRes, eduRes, projRes] = await Promise.all([
          fetch("/api/bio"),
          fetch("/api/skills"),
          fetch("/api/experience"),
          fetch("/api/education"),
          fetch("/api/projects"),
        ]);

        const [bio, skills, experience, education, projects] =
          await Promise.all([
            bioRes.json(),
            skillsRes.json(),
            expRes.json(),
            eduRes.json(),
            projRes.json(),
          ]);

        setCounts({
          bio: bio ? 1 : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          education: Array.isArray(education) ? education.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-2">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Welcome to your portfolio admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="group bg-[#0f0f14] border border-white/10 rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-purple-600/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/10 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  <Icon className="text-[28px]" />
                </div>
                <div
                  className="text-[36px] font-bold transition-colors"
                  style={{ color: stat.color }}
                >
                  {loading ? "..." : counts[stat.key]}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0f0f14] border border-white/10 rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              href: "/admin/bio",
              label: "Update Bio",
              icon: FiUser,
              color: "#854ce6",
            },
            {
              href: "/admin/skills",
              label: "Manage Skills",
              icon: FiAward,
              color: "#4ecdc4",
            },
            {
              href: "/admin/experience",
              label: "Add Experience",
              icon: FiBriefcase,
              color: "#ff6b6b",
            },
            {
              href: "/admin/education",
              label: "Add Education",
              icon: FiBook,
              color: "#ffd93d",
            },
            {
              href: "/admin/projects",
              label: "Add Project",
              icon: FiFolder,
              color: "#6bcf7f",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-purple-600/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/10 text-gray-100 no-underline"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                  }}
                >
                  <Icon className="text-xl" />
                </div>
                <span className="font-medium group-hover:text-purple-400 transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
