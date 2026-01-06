"use client";

import { useEffect, useState } from "react";
import { FiUser, FiAward, FiBriefcase, FiBook, FiFolder } from "react-icons/fi";

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
    <div className="max-w-[1400px]">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
      <p className="text-base text-gray-400 mb-8">
        Welcome to your portfolio admin panel
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="bg-[#0f0f14] border border-white/10 rounded-xl p-6 flex items-center gap-4 transition-all hover:border-purple-600 hover:-translate-y-0.5"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <Icon className="text-[28px]" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-[28px] font-bold text-gray-100">
                  {loading ? "..." : counts[stat.key]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0f0f14] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: "/admin/bio", label: "Update Bio", icon: FiUser },
            { href: "/admin/skills", label: "Manage Skills", icon: FiAward },
            {
              href: "/admin/experience",
              label: "Add Experience",
              icon: FiBriefcase,
            },
            { href: "/admin/education", label: "Add Education", icon: FiBook },
            { href: "/admin/projects", label: "Add Project", icon: FiFolder },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg transition-all hover:bg-purple-600/10 hover:border-purple-600 text-gray-100 no-underline"
              >
                <Icon className="text-xl text-purple-600" />
                <span className="font-medium">{action.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
