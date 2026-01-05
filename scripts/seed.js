// Script to seed database with initial data from constants.js
import dbConnect from "../lib/db/mongoose.js";
import Bio from "../lib/db/models/Bio.js";
import Skill from "../lib/db/models/Skill.js";
import Experience from "../lib/db/models/Experience.js";
import Education from "../lib/db/models/Education.js";
import Project from "../lib/db/models/Project.js";
import Admin from "../lib/db/models/Admin.js";

// Import data from constants
const bioData = {
  name: "SHANTO KUMAR",
  roles: ["Front-End Developer", "Web Designer", "Programmer"],
  description:
    "I am a motivated and versatile individual, always eager to take on new challenges. With a passion for learning I am dedicated to delivering high-quality results. With a positive attitude and a growth mindset, I am ready to make a meaningful contribution and achieve great things.",
  github: "https://github.com/CodeCommandBD",
  resume: "",
  linkedin: "https://www.linkedin.com/in/shanto-das-hello//",
  twitter: "https://x.com/FlicKShoT12398",
  insta: "https://www.instagram.com/shanto__kumar__das/",
  facebook: "https://www.facebook.com/helloword5000/",
};

const skillsData = [
  {
    title: "Frontend",
    skills: [
      {
        name: "React Js",
        image:
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K",
      },
      {
        name: "HTML",
        image: "https://www.w3.org/html/logo/badge/html5-badge-h-solo.png",
      },
      {
        name: "CSS",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png",
      },
      {
        name: "JavaScript",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png",
      },
      {
        name: "Bootstrap",
        image:
          "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png",
      },
      {
        name: "Tailwind CSS",
        image:
          "https://imgs.search.brave.com/oG3o98QjKAbPSLZPTOvPhupljLwbNmIQ42GfRq2TFXw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9k/L2Q1L1RhaWx3aW5k/X0NTU19Mb2dvLnN2/Zw",
      },
    ],
    order: 0,
  },
  {
    title: "Others",
    skills: [
      {
        name: "Git",
        image:
          "https://e7.pngegg.com/pngimages/713/558/png-clipart-computer-icons-pro-git-github-logo-text-logo-thumbnail.png",
      },
      {
        name: "GitHub",
        image:
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      },
      {
        name: "Netlify",
        image:
          "https://seeklogo.com/images/N/netlify-logo-BD8F8A77E2-seeklogo.com.png",
      },
      {
        name: "VS Code",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png?20210804221519",
      },
      {
        name: "Figma",
        image:
          "https://s3-alpha.figma.com/hub/file/1481185752/fa4cd070-6a79-4e1b-b079-8b9b76408595-cover.png",
      },
      {
        name: "Jira",
        image: "https://i.ibb.co.com/4gfnZgbT/jira.png",
      },
    ],
    order: 1,
  },
];

const experiencesData = [
  {
    img: "https://i.ibb.co.com/rGgq3xfh/company.png",
    role: "Frontend Internship",
    company: "BitQuintet",
    date: "Dec 2023 - Nov 2024",
    desc: "At BitQuintet (Dec 2023 – Nov 2024), I expanded my frontend development skills by working with technologies like HTML, CSS, JavaScript, Vue, Bootstrap, and Tailwind CSS. I contributed to building responsive layouts and improving UI components across different projects. This internship allowed me to deepen my understanding of frontend frameworks and styling libraries, while gaining practical experience in writing cleaner, more efficient code and collaborating with a team.",
    skills: ["HTML", "CSS", "Bootstrap", "Tailwind CSS", "vue", "JavaScript"],
    doc: "https://firebasestorage.googleapis.com/v0/b/flexi-coding.appspot.com/o/1696514649120.jpeg?alt=media&token=e7f6757b-edfa-4138-a692-d6709eeef3e2",
    order: 0,
  },
  {
    img: "https://i.ibb.co.com/81ZfCSW/company2.png",
    role: "Frontend Intern",
    company: "TiketX",
    date: "Dec 2023 - April 2024",
    desc: "During my Frontend Internship at TiketX (Dec 2023 – April 2024), I took my first steps into real-world web development. I worked with HTML, CSS, and JavaScript to help build simple yet responsive UI components. I learned how to follow design guidelines, write clean code, and collaborate with a development team. This experience gave me a strong foundation in frontend basics and boosted my confidence in working on real projects.",
    skills: ["HTML", "CSS", "JavaScript"],
    doc: "https://firebasestorage.googleapis.com/v0/b/flexi-coding.appspot.com/o/Screenshot%20from%202024-01-25%2022-38-31.png?alt=media&token=2785903f-1a4e-41f5-afd2-6adcfe56d058",
    order: 1,
  },
];

const educationData = [
  {
    img: "https://i.ibb.co.com/4Ln5R96/BSC.png",
    school: "Uttara Institute of Business and Technology, Uttara-Dhaka",
    date: "2019 - 2023",
    grade: "70%",
    desc: "I am currently pursuing a Bachelor's degree in Computer Science and Engineering at Uttara Institute of Business and Technology, Uttara-Dhaka, which is affiliated with the National University of Bangladesh. I have completed eight semesters, during which I studied core subjects such as Data Structures, Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, and Computer Networks. I took a two-year break during my studies to focus on self-learning and skill development, and due to the impact of the COVID-19 pandemic. Throughout my academic journey, I have collaborated with a talented team of developers on various exciting projects, allowing me to apply theoretical knowledge to practical challenges and grow as a problem-solver",
    degree: "Bachelor of Science - Bsc, Computer Science and Engineering",
    order: 0,
  },
  {
    img: "https://i.ibb.co.com/gMMY4VdL/ssc.png",
    school: "Uttara High School & College,Dhaka",
    date: "2015 - 2017",
    grade: "85%",
    desc: "I completed my class 12 high school education at Uttara High School & College,Dhaka, where I studied Science with Computer Science.",
    degree: "Science with Computer",
    order: 1,
  },
  {
    img: "https://i.ibb.co.com/ynn24Spc/ssc.png",
    school: "Shaheed Smrity High School, Tongi",
    date: "2013 - 2015",
    grade: "95.6%",
    desc: "I completed my class 10 education at Shaheed Smrity High School, Tongi, where I studied Science with Computer Application.",
    degree: "Science with Computer",
    order: 2,
  },
];

// Only include first 3 projects for brevity
const projectsData = [
  {
    title: "DecisionHub",
    date: "Jan 2024 - Dec 2023",
    description:
      'A Rule Builder application "Decision Hub" that empowers Business Analysts to create, save, and visualize decision strategies. Provide a no-code rule writing experience and visual representation to test these rules in real-time and observe the calculations at each step.',
    image:
      "https://github.com/rishavchanda/DecisionHub/raw/master/assets/testRule.jpg",
    tags: [
      "React Js",
      "PostgressSQL",
      "Node Js",
      "Express Js",
      "Redux",
      "React Flow",
    ],
    category: "web app",
    github: "https://github.com/rishavchanda/DecisionHub",
    webapp: "https://decisionhub.netlify.app/",
    order: 0,
  },
  {
    title: "Trackify",
    date: "Jun 2023 - Jul 2023",
    description:
      "Trackify is a web application designed to streamline task management and enhance productivity in the workplace. It provides a user-friendly interface for employers to keep track of their employees' daily work activities and empowers employees to log their tasks efficiently.",
    image:
      "https://user-images.githubusercontent.com/64485885/255202416-e1f89b04-2788-45b0-abc2-9dec616669e2.png",
    tags: [
      "Docker",
      "AWS",
      "DuckDNS",
      "Eslint",
      "Husky",
      "CI/CD",
      "React Js",
      "MongoDb",
      "Node Js",
      "Express Js",
      "Redux",
    ],
    category: "web app",
    github: "https://github.com/rishavchanda/Trackify",
    webapp: "https://trackify-management.netlify.app/",
    order: 1,
  },
  {
    title: "Podstream",
    date: "Apr 2023 - May 2023",
    description:
      "Developed a full-stack web application that allows users to search for, play, and pause their favorite podcasts on demand and create podcasts. Implemented user authentication using Google Auth and Jwt Auth, made responsive user interface with React JS that provides users with a seamless experience across all devices.",
    image:
      "https://user-images.githubusercontent.com/64485885/234602896-a1bd8bcc-b72b-4821-83d6-8ad885bf435e.png",
    tags: ["React Js", "MongoDb", "Node Js", "Express Js", "Redux"],
    category: "web app",
    github: "https://github.com/rishavchanda/Podstream",
    webapp: "https://podstream.netlify.app/",
    order: 2,
  },
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    // Clear existing data
    await Bio.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Project.deleteMany({});
    await Admin.deleteMany({});
    console.log("Cleared existing data");

    // Seed Bio
    await Bio.create(bioData);
    console.log("✓ Bio data seeded");

    // Seed Skills
    await Skill.insertMany(skillsData);
    console.log("✓ Skills data seeded");

    // Seed Experiences
    await Experience.insertMany(experiencesData);
    console.log("✓ Experience data seeded");

    // Seed Education
    await Education.insertMany(educationData);
    console.log("✓ Education data seeded");

    // Seed Projects
    await Project.insertMany(projectsData);
    console.log("✓ Projects data seeded");

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    await Admin.create({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
    });
    console.log("✓ Admin user created");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
