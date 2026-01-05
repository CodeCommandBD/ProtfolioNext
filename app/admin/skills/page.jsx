"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

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
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(133, 76, 230, 0.3);
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const SkillCard = styled.div`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SkillTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #f2f3f4;
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
  transition: all 0.2s ease;

  &:hover {
    background: ${({ variant }) =>
      variant === "delete"
        ? "rgba(255, 107, 107, 0.2)"
        : "rgba(133, 76, 230, 0.2)"};
  }

  svg {
    font-size: 16px;
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const SkillItem = styled.div`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #f2f3f4;
`;

const Percentage = styled.span`
  color: ${({ theme }) => theme.text_secondary || "#b1b2b3"};
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
`;

const SkillImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
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
  max-width: 600px;
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
  padding: 4px;

  &:hover {
    color: #f2f3f4;
  }

  svg {
    font-size: 24px;
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

const SkillInputGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: end;
`;

const SmallButton = styled.button`
  background: ${({ variant }) =>
    variant === "remove"
      ? "rgba(255, 107, 107, 0.1)"
      : "rgba(133, 76, 230, 0.1)"};
  border: 1px solid
    ${({ variant }) =>
      variant === "remove"
        ? "rgba(255, 107, 107, 0.3)"
        : "rgba(133, 76, 230, 0.3)"};
  border-radius: 6px;
  padding: 12px 16px;
  color: ${({ variant }) => (variant === "remove" ? "#ff6b6b" : "#854ce6")};
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ variant }) =>
      variant === "remove"
        ? "rgba(255, 107, 107, 0.2)"
        : "rgba(133, 76, 230, 0.2)"};
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
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(133, 76, 230, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
      } else {
        alert("Failed to save skill category");
      }
    } catch (error) {
      console.error("Error saving skill category:", error);
      alert("Failed to save skill category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill category?"))
      return;

    try {
      const response = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchSkills();
      } else {
        alert("Failed to delete skill category");
      }
    } catch (error) {
      console.error("Error deleting skill category:", error);
      alert("Failed to delete skill category");
    }
  };

  return (
    <Container>
      <Header>
        <Title>Skills Management</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus />
          Add Skill Category
        </AddButton>
      </Header>

      <SkillsGrid>
        {skillCategories.map((category) => (
          <SkillCard key={category._id}>
            <SkillHeader>
              <SkillTitle>{category.title}</SkillTitle>
              <ActionButtons>
                <IconButton onClick={() => handleOpenModal(category)}>
                  <FiEdit2 />
                </IconButton>
                <IconButton
                  variant="delete"
                  onClick={() => handleDelete(category._id)}
                >
                  <FiTrash2 />
                </IconButton>
              </ActionButtons>
            </SkillHeader>
            <SkillsList>
              {category.skills.map((skill, index) => (
                <SkillItem key={index}>
                  <SkillImage src={skill.image} alt={skill.name} />
                  {skill.name}
                  {skill.percentage && (
                    <Percentage>{skill.percentage}%</Percentage>
                  )}
                </SkillItem>
              ))}
            </SkillsList>
          </SkillCard>
        ))}
      </SkillsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingCategory ? "Edit" : "Add"} Skill Category
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Category Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Frontend"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Skills</Label>
              {formData.skills.map((skill, index) => (
                <div key={index} style={{ marginBottom: "12px" }}>
                  <SkillInputGroup>
                    <FormGroup style={{ flex: 1, margin: 0 }}>
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          handleSkillChange(index, "name", e.target.value)
                        }
                        placeholder="Skill name"
                        required
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: 1, margin: 0 }}>
                      <Input
                        value={skill.image}
                        onChange={(e) =>
                          handleSkillChange(index, "image", e.target.value)
                        }
                        placeholder="Image URL"
                        required
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: 0.5, margin: 0 }}>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.percentage || 50}
                        onChange={(e) =>
                          handleSkillChange(
                            index,
                            "percentage",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="%"
                        title="Proficiency"
                        required
                      />
                    </FormGroup>
                    {formData.skills.length > 1 && (
                      <SmallButton
                        type="button"
                        variant="remove"
                        onClick={() => handleRemoveSkill(index)}
                      >
                        Remove
                      </SmallButton>
                    )}
                  </SkillInputGroup>
                </div>
              ))}
              <SmallButton type="button" onClick={handleAddSkill}>
                + Add Skill
              </SmallButton>
            </FormGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              <FiSave />
              {isLoading ? "Saving..." : "Save Category"}
            </SubmitButton>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
}
