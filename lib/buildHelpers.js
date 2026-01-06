// Helper to check if we're in build mode
export const isBuildTime = () => {
  return process.env.NEXT_PHASE === "phase-production-build";
};

// Mock session for build time
export const getBuildTimeSession = () => {
  return {
    user: { id: "build-user", email: "build@build.com", name: "Build" },
  };
};
