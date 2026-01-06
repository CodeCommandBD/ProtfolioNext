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
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Reuse styled components from Skills page
const Container = styled.div`
  max-width: 1200px;
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

const Grid = styled.div`
  display: grid;
  gap: 24px;
`;

const Card = styled.div`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
`;

const CardImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #f2f3f4;
  margin-bottom: 4px;
`;

const CardSubtitle = styled.div`
  font-size: 14px;
  color: #b1b2b3;
  margin-bottom: 4px;
`;

const CardDate = styled.div`
  font-size: 12px;
  color: #854ce6;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #b1b2b3;
  line-height: 1.6;
  margin-bottom: 12px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: #854ce6;
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
  max-width: 700px;
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

const experienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  date: z.string().min(1, "Date is required"),
  desc: z.string().min(10, "Description must be at least 10 characters"),
  doc: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function ExperienceManagementPage() {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [companyImage, setCompanyImage] = useState("");
  const [skills, setSkills] = useState([""]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      reset(item);
      setCompanyImage(item.img);
      setSkills(item.skills.length > 0 ? item.skills : [""]);
    } else {
      setEditingItem(null);
      reset({
        role: "",
        company: "",
        date: "",
        desc: "",
        doc: "",
      });
      setCompanyImage("");
      setSkills([""]);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio/experience");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        setCompanyImage(data.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!companyImage) {
      alert("Please upload a company logo");
      return;
    }

    const payload = {
      ...data,
      img: companyImage,
      skills: skills.filter((s) => s.trim() !== ""),
      order: editingItem?.order ?? experiences.length,
    };

    try {
      const url = editingItem
        ? `/api/experience/${editingItem._id}`
        : "/api/experience";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchExperiences();
        setIsModalOpen(false);
      } else {
        alert("Failed to save experience");
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Failed to save experience");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchExperiences();
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Experience Management</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus />
          Add Experience
        </AddButton>
      </Header>

      <Grid>
        {experiences.map((exp) => (
          <Card key={exp._id}>
            <CardImage src={exp.img} alt={exp.company} />
            <CardContent>
              <CardHeader>
                <div>
                  <CardTitle>{exp.role}</CardTitle>
                  <CardSubtitle>{exp.company}</CardSubtitle>
                  <CardDate>{exp.date}</CardDate>
                </div>
                <ActionButtons>
                  <IconButton onClick={() => handleOpenModal(exp)}>
                    <FiEdit2 />
                  </IconButton>
                  <IconButton
                    variant="delete"
                    onClick={() => handleDelete(exp._id)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </ActionButtons>
              </CardHeader>
              <CardDescription>{exp.desc}</CardDescription>
              {exp.skills.length > 0 && (
                <TagsContainer>
                  {exp.skills.map((skill, idx) => (
                    <Tag key={idx}>{skill}</Tag>
                  ))}
                </TagsContainer>
              )}
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingItem ? "Edit" : "Add"} Experience</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FiX size={24} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>Company Logo</Label>
              <ImageUploadButton
                type="button"
                onClick={() =>
                  document.getElementById("company-image")?.click()
                }
              >
                <FiUpload />
                {isUploading
                  ? "Uploading..."
                  : companyImage
                  ? "Change Image"
                  : "Upload Image"}
              </ImageUploadButton>
              {companyImage && (
                <img
                  src={companyImage}
                  alt="Preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                />
              )}
              <input
                id="company-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </FormGroup>

            <FormGroup>
              <Label>Role *</Label>
              <Input placeholder="Frontend Developer" {...register("role")} />
              {errors.role && (
                <ErrorMessage>{errors.role.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Company *</Label>
              <Input placeholder="Company Name" {...register("company")} />
              {errors.company && (
                <ErrorMessage>{errors.company.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Date *</Label>
              <Input placeholder="Jan 2023 - Present" {...register("date")} />
              {errors.date && (
                <ErrorMessage>{errors.date.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe your role and responsibilities..."
                {...register("desc")}
              />
              {errors.desc && (
                <ErrorMessage>{errors.desc.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Skills</Label>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px" }}>
                  <Input
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...skills];
                      newSkills[idx] = e.target.value;
                      setSkills(newSkills);
                    }}
                    placeholder="e.g., React, TypeScript"
                  />
                  {skills.length > 1 && (
                    <IconButton
                      type="button"
                      variant="delete"
                      onClick={() =>
                        setSkills(skills.filter((_, i) => i !== idx))
                      }
                    >
                      <FiTrash2 />
                    </IconButton>
                  )}
                </div>
              ))}
              <ImageUploadButton
                type="button"
                onClick={() => setSkills([...skills, ""])}
              >
                + Add Skill
              </ImageUploadButton>
            </FormGroup>

            <FormGroup>
              <Label>Document URL (Optional)</Label>
              <Input
                placeholder="https://example.com/certificate.pdf"
                {...register("doc")}
              />
              {errors.doc && <ErrorMessage>{errors.doc.message}</ErrorMessage>}
            </FormGroup>

            <SubmitButton type="submit">
              <FiSave />
              Save Experience
            </SubmitButton>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
}
