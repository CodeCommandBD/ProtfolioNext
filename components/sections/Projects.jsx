"use client";

import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "@/lib/redux/slices/filterSlice";
import { useProjects } from "@/lib/tanstack/queries/useProjects";
import ProjectCard from "../cards/ProjectCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  position: relative;
  z-index: 1;
  align-items: center;
  margin-top: 40px;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media screen and (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media screen and (max-width: 960px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media screen and (max-width: 960px) {
    font-size: 16px;
  }
`;

const ToggleButtonGroup = styled.div`
  display: flex;
  border: 1.5px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  border-radius: 12px;
  font-weight: 500;
  margin: 22px 0;
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ToggleButton = styled.div`
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
  @media screen and (max-width: 768px) {
    border-radius: 4px;
    padding: 6px 8px;
  }
  ${({ $active, theme }) =>
    $active &&
    `
    background: ${theme.primary + 20}
  `}
`;

const Divider = styled.div`
  width: 1.5px;
  background: ${({ theme }) => theme.primary};
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 100%;
  gap: 25px;
  justify-items: center;
`;

const Projects = () => {
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state) => state.filter);
  const { data: projects = [], isLoading, error } = useProjects();

  const handleToggle = (category) => {
    dispatch(setCategory(category));
  };

  if (isLoading) return <Desc>Loading projects...</Desc>;
  if (error) return <Desc>Error loading projects: {error.message}</Desc>;

  return (
    <Container id="Project">
      <Wrapper>
        <Title>Projects</Title>
        <Desc style={{ marginBottom: "40px" }}>
          I have worked on a wide range of projects. Here are some of my
          projects.
        </Desc>
        <ToggleButtonGroup>
          <ToggleButton
            $active={selectedCategory === "all"}
            onClick={() => handleToggle("all")}
          >
            All
          </ToggleButton>
          <Divider />
          <ToggleButton
            $active={selectedCategory === "static"}
            onClick={() => handleToggle("static")}
          >
            Static / Interactive
          </ToggleButton>
          <Divider />
          <ToggleButton
            $active={selectedCategory === "live"}
            onClick={() => handleToggle("live")}
          >
            Live Demo
          </ToggleButton>
        </ToggleButtonGroup>
        <CardContainer>
          {selectedCategory === "all" &&
            projects.map((project, index) => (
              <ProjectCard key={`project-${index}`} project={project} />
            ))}
          {selectedCategory !== "all" &&
            projects
              .filter((item) => item.category === selectedCategory)
              .map((project, index) => (
                <ProjectCard key={`project-${index}`} project={project} />
              ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Projects;
