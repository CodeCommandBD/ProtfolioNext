import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import StarsCanvas from "@/components/canvas/StarsWrapper";
import ClientWrapper, { Body, Wrapper } from "@/components/ClientWrapper";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedSection from "@/components/AnimatedSection";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";
import StructuredData from "@/components/StructuredData";
import dbConnect from "@/lib/db/mongoose";
import Bio from "@/lib/db/models/Bio";
import Skill from "@/lib/db/models/Skill";
import ExperienceModel from "@/lib/db/models/Experience";
import EducationModel from "@/lib/db/models/Education";
import Project from "@/lib/db/models/Project";

// Ensure dynamic rendering for instant updates
export const dynamic = "force-dynamic";

// Helper to serialize Mongoose documents
const toJSON = (data) => JSON.parse(JSON.stringify(data));

async function getBioData() {
  try {
    await dbConnect();
    const bio = await Bio.findOne().lean();
    return bio ? toJSON(bio) : null;
  } catch (error) {
    console.error("Error fetching bio:", error);
    return null;
  }
}

async function getSkillsData() {
  try {
    await dbConnect();
    const skills = await Skill.find().sort({ order: 1 }).lean();
    return skills ? toJSON(skills) : [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

async function getExperienceData() {
  try {
    await dbConnect();
    const experiences = await ExperienceModel.find().sort({ date: -1 }).lean(); // Assuming date sort desired
    return experiences ? toJSON(experiences) : [];
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

async function getEducationData() {
  try {
    await dbConnect();
    const education = await EducationModel.find().sort({ order: 1 }).lean();
    return education ? toJSON(education) : [];
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

async function getProjectsData() {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ date: -1 }).lean(); // Assuming date sort desired
    return projects ? toJSON(projects) : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  // Fetch all data directly from DB
  const [bio, skills, experiences, education, projects] = await Promise.all([
    getBioData(),
    getSkillsData(),
    getExperienceData(),
    getEducationData(),
    getProjectsData(),
  ]);

  return (
    <PageLoader>
      <ClientWrapper>
        <ScrollProgress />
        <ScrollToTop />
        <Navbar bio={bio} />
        <StructuredData bio={bio} />
        <Body>
          <StarsCanvas />
          <div>
            <Hero bio={bio} />
            <Wrapper>
              <AnimatedSection delay="0.1s">
                <Skills skills={skills} />
              </AnimatedSection>
              <AnimatedSection delay="0.2s">
                <Experience experiences={experiences} />
              </AnimatedSection>
            </Wrapper>
            <AnimatedSection delay="0.1s">
              <Projects projects={projects} />
            </AnimatedSection>
            <Wrapper>
              <AnimatedSection delay="0.1s">
                <Education education={education} />
              </AnimatedSection>
              <AnimatedSection delay="0.2s">
                <Contact />
              </AnimatedSection>
            </Wrapper>
            <Footer bio={bio} />
          </div>
        </Body>
      </ClientWrapper>
    </PageLoader>
  );
}
