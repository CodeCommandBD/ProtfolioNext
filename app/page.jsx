import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import StarsCanvas from "@/components/canvas/Stars";
import ClientWrapper, { Body, Wrapper } from "@/components/ClientWrapper";

// Fetch data on server side
async function getBioData() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/bio`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching bio:", error);
    return null;
  }
}

async function getSkillsData() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/skills`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

async function getExperienceData() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/experience`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

async function getEducationData() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/education`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

async function getProjectsData() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/projects`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  // Fetch all data on server side
  const [bio, skills, experiences, education, projects] = await Promise.all([
    getBioData(),
    getSkillsData(),
    getExperienceData(),
    getEducationData(),
    getProjectsData(),
  ]);

  return (
    <ClientWrapper>
      <Navbar bio={bio} />
      <Body>
        <StarsCanvas />
        <div>
          <Hero bio={bio} />
          <Wrapper>
            <Skills skills={skills} />
            <Experience experiences={experiences} />
          </Wrapper>
          <Projects projects={projects} />
          <Wrapper>
            <Education education={education} />
            <Contact />
          </Wrapper>
          <Footer bio={bio} />
        </div>
      </Body>
    </ClientWrapper>
  );
}
