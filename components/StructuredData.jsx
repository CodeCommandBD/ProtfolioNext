import Script from "next/script";

export default function StructuredData({ bio }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: bio?.name || "Shanto Kumar",
    jobTitle: bio?.roles?.[0] || "Front-End Developer",
    description:
      bio?.description || "Front-End Developer, Web Designer, and Programmer",
    url: "https://your-domain.com",
    image: bio?.profileImage || "/logo512.png",
    sameAs: [
      bio?.linkedin,
      bio?.github,
      bio?.twitter,
      bio?.facebook,
      bio?.insta,
    ].filter(Boolean),
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Frontend Development",
      "UI/UX Design",
    ],
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
