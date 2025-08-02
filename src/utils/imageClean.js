// utils/imageHelpers.js or inline
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const cleanedPath = imagePath.replace(/\\/g, "/"); // convert \ to /
  return `http://localhost:5000/${cleanedPath}`;
};
