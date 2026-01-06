"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiUpload,
  FiExternalLink,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Reuse styled components
const Container = styled.div`
  max-width: 1400px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;
const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #f2f3f4;
`;
const AddButton = styled.button`
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(133, 76, 230, 0.3);
  }
`;
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;
const ProjectCard = styled.div`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    border-color: #854ce6;
  }
`;
const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;
const ProjectContent = styled.div`
  padding: 20px;
`;
const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;
const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #f2f3f4;
  margin-bottom: 4px;
`;
const ProjectDate = styled.div`
  font-size: 12px;
  color: #854ce6;
  margin-bottom: 8px;
`;
const ProjectDescription = styled.p`
  font-size: 14px;
  color: #b1b2b3;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;
const Tag = styled.span`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  color: #854ce6;
`;
const CategoryBadge = styled.span`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  color: #10b981;
  display: inline-block;
  margin-bottom: 8px;
`;
const ProjectLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;
const LinkButton = styled.a`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 6px;
  padding: 6px 12px;
  color: #854ce6;
  font-size: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: rgba(133, 76, 230, 0.2);
  }
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;
const IconButton = styled.button`
  background: ${({ variant }) =>
    variant === "delete"
      ? "rgba(255, 107, 107, 0.1)"
      : "rgba(133, 76, 230, 0.1)"};
  border: 1px solid
    ${({ variant }) =>
      variant === "delete"
        ? "rgba(255, 107, 107, 0.3)"
        : "rgba(133, 76, 230, 0.3)"};
  border-radius: 6px;
  padding: 8px;
  color: ${({ variant }) => (variant === "delete" ? "#ff6b6b" : "#854ce6")};
  cursor: pointer;
  &:hover {
    background: ${({ variant }) =>
      variant === "delete"
        ? "rgba(255, 107, 107, 0.2)"
        : "rgba(133, 76, 230, 0.2)"};
  }
`;
const Modal = styled.div`
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;
const ModalContent = styled.div`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 32px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #f2f3f4;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b1b2b3;
  cursor: pointer;
  &:hover {
    color: #f2f3f4;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #f2f3f4;
`;
const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #f2f3f4;
  &:focus {
    outline: none;
    border-color: #854ce6;
  }
`;
const Textarea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #f2f3f4;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #854ce6;
  }
`;
const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  color: #f2f3f4;
  &:focus {
    outline: none;
    border-color: #854ce6;
  }
`;
const ImageUploadButton = styled.button`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #854ce6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  &:hover {
    background: rgba(133, 76, 230, 0.2);
  }
`;
const SubmitButton = styled.button`
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 14px;
`;

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  webapp: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [projectImage, setProjectImage] = useState("");
  const [tags, setTags] = useState([""]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      reset(item);
      setProjectImage(item.image);
      setTags(item.tags.length > 0 ? item.tags : [""]);
    } else {
      setEditingItem(null);
      reset({
        title: "",
        date: "",
        description: "",
        category: "web app",
        github: "",
        webapp: "",
      });
      setProjectImage("");
      setTags([""]);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio/projects");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) setProjectImage(data.url);
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!projectImage) {
      alert("Please upload a project image");
      return;
    }

    const payload = {
      ...data,
      image: projectImage,
      tags: tags.filter((t) => t.trim() !== ""),
      order: editingItem?.order ?? projects.length,
    };

    try {
      const url = editingItem
        ? `/api/projects/${editingItem._id}`
        : "/api/projects";
      const method = editingItem ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchProjects();
        setIsModalOpen(false);
      } else {
        alert("Failed to save project");
      }
    } catch (error) {
      alert("Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (response.ok) await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Projects Management</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus />
          Add Project
        </AddButton>
      </Header>

      <ProjectsGrid>
        {projects.map((project) => (
          <ProjectCard key={project._id}>
            <ProjectImage src={project.image} alt={project.title} />
            <ProjectContent>
              <ProjectHeader>
                <div style={{ flex: 1 }}>
                  <CategoryBadge>{project.category}</CategoryBadge>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDate>{project.date}</ProjectDate>
                </div>
                <ActionButtons>
                  <IconButton onClick={() => handleOpenModal(project)}>
                    <FiEdit2 />
                  </IconButton>
                  <IconButton
                    variant="delete"
                    onClick={() => handleDelete(project._id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </ActionButtons>
              </ProjectHeader>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TagsContainer>
                {project.tags.slice(0, 5).map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
                {project.tags.length > 5 && (
                  <Tag>+{project.tags.length - 5}</Tag>
                )}
              </TagsContainer>
              <ProjectLinks>
                {project.github && (
                  <LinkButton href={project.github} target="_blank">
                    <FiExternalLink size={12} />
                    Code
                  </LinkButton>
                )}
                {project.webapp && (
                  <LinkButton href={project.webapp} target="_blank">
                    <FiExternalLink size={12} />
                    Live
                  </LinkButton>
                )}
              </ProjectLinks>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingItem ? "Edit" : "Add"} Project</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>Project Image</Label>
              <ImageUploadButton
                type="button"
                onClick={() =>
                  document.getElementById("project-image")?.click()
                }
              >
                <FiUpload />
                {isUploading
                  ? "Uploading..."
                  : projectImage
                  ? "Change Image"
                  : "Upload Image"}
              </ImageUploadButton>
              {projectImage && (
                <img
                  src={projectImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                />
              )}
              <input
                id="project-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </FormGroup>

            <FormGroup>
              <Label>Title *</Label>
              <Input placeholder="Project Name" {...register("title")} />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Date *</Label>
              <Input placeholder="Jan 2024 - Mar 2024" {...register("date")} />
              {errors.date && (
                <ErrorMessage>{errors.date.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Category *</Label>
              <Select {...register("category")}>
                <option value="web app">Web App</option>
                <option value="live web app">Live Web App</option>
                <option value="mobile app">Mobile App</option>
              </Select>
              {errors.category && (
                <ErrorMessage>{errors.category.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe your project..."
                {...register("description")}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Tags</Label>
              {tags.map((tag, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px" }}>
                  <Input
                    value={tag}
                    onChange={(e) => {
                      const newTags = [...tags];
                      newTags[idx] = e.target.value;
                      setTags(newTags);
                    }}
                    placeholder="e.g., React, Node.js"
                  />
                  {tags.length > 1 && (
                    <IconButton
                      type="button"
                      variant="delete"
                      onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                    >
                      <FiTrash2 />
                    </IconButton>
                  )}
                </div>
              ))}
              <ImageUploadButton
                type="button"
                onClick={() => setTags([...tags, ""])}
              >
                + Add Tag
              </ImageUploadButton>
            </FormGroup>

            <FormGroup>
              <Label>GitHub URL</Label>
              <Input
                placeholder="https://github.com/username/repo"
                {...register("github")}
              />
              {errors.github && (
                <ErrorMessage>{errors.github.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Live Demo URL</Label>
              <Input
                placeholder="https://example.com"
                {...register("webapp")}
              />
              {errors.webapp && (
                <ErrorMessage>{errors.webapp.message}</ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit">
              <FiSave />
              Save Project
            </SubmitButton>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
}
