export const DEFAULT_IMAGES = {
  profile: "https://ui-avatars.com/api/?name=User&background=3b82f6&color=ffffff&size=200",
  cover: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&h=400&q=80"
};

export const generateAvatarUrl = (name) => {
  const encodedName = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encodedName}&background=3b82f6&color=ffffff&size=200&rounded=true`;
};

export const getImageWithFallback = (imageUrl, type = 'profile') => {
  if (!imageUrl || imageUrl.trim() === '') {
    return type === 'profile' ? generateAvatarUrl('User') : DEFAULT_IMAGES.cover;
  }
  return imageUrl;
};