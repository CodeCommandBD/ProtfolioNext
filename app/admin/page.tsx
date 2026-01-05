'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiAward, FiBriefcase, FiBook, FiFolder } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1400px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #f2f3f4;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #b1b2b3;
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #854ce6;
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${({ color }) => color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};

  svg {
    font-size: 28px;
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #b1b2b3;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #f2f3f4;
`;

const QuickActions = styled.div`
  background: #0f0f14;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #f2f3f4;
  margin-bottom: 16px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ActionButton = styled.a`
  background: rgba(133, 76, 230, 0.1);
  border: 1px solid rgba(133, 76, 230, 0.3);
  border-radius: 8px;
  padding: 16px;
  text-decoration: none;
  color: #854ce6;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(133, 76, 230, 0.2);
    transform: translateY(-2px);
  }
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    experience: 0,
    education: 0,
    projects: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [skills, experience, education, projects] = await Promise.all([
          fetch('/api/skills').then((r) => r.json()),
          fetch('/api/experience').then((r) => r.json()),
          fetch('/api/education').then((r) => r.json()),
          fetch('/api/projects').then((r) => r.json()),
        ]);

        setStats({
          skills: skills.length || 0,
          experience: experience.length || 0,
          education: education.length || 0,
          projects: projects.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container>
      <Title>Dashboard</Title>
      <Subtitle>Welcome back! Here's an overview of your portfolio.</Subtitle>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#854ce6">
            <FiAward />
          </StatIcon>
          <StatInfo>
            <StatLabel>Skill Categories</StatLabel>
            <StatValue>{stats.skills}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#3b82f6">
            <FiBriefcase />
          </StatIcon>
          <StatInfo>
            <StatLabel>Work Experience</StatLabel>
            <StatValue>{stats.experience}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#10b981">
            <FiBook />
          </StatIcon>
          <StatInfo>
            <StatLabel>Education</StatLabel>
            <StatValue>{stats.education}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59e0b">
            <FiFolder />
          </StatIcon>
          <StatInfo>
            <StatLabel>Projects</StatLabel>
            <StatValue>{stats.projects}</StatValue>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionGrid>
          <ActionButton href="/admin/bio">Manage Profile</ActionButton>
          <ActionButton href="/admin/skills">Add Skills</ActionButton>
          <ActionButton href="/admin/experience">Add Experience</ActionButton>
          <ActionButton href="/admin/education">Add Education</ActionButton>
          <ActionButton href="/admin/projects">Add Project</ActionButton>
          <ActionButton href="/" target="_blank">
            View Live Site
          </ActionButton>
        </ActionGrid>
      </QuickActions>
    </Container>
  );
}
