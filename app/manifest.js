export default function manifest() {
  return {
    name: "Shanto Kumar Portfolio",
    short_name: "Portfolio",
    description: "Front-End Developer, Web Designer, and Programmer portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#854CE6",
    icons: [
      {
        src: "/logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
