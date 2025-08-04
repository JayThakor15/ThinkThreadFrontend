import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaCamera,
  FaPlus,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaEllipsisH,
  FaHeart,
  FaComment,
  FaShare,
  FaSignOutAlt,
  FaHome,
  FaTrash,
  FaEnvelope,
} from "react-icons/fa";
import {
  DEFAULT_IMAGES,
  getImageWithFallback,
  generateAvatarUrl,
} from "../utils/defaultImages";
import { useNavigate, Link } from "react-router-dom";
import { getFullImageUrl } from "../utils/imageClean";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    profileImg: "",
    coverImg: "",
  });

  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://thinkthreadbackend.onrender.com/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const userData = {
          ...response.data,
          connections: response.data.connections || 0,
          followers: response.data.followers || 0,
          joinDate: response.data.createdAt
            ? new Date(response.data.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            : "Recently",
        };
        setUser(userData);
        setEditedUser(userData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", editedUser.name);
      formData.append("title", editedUser.title);
      formData.append("location", editedUser.location);
      formData.append("bio", editedUser.bio);

      if (editedUser.profileImg) {
        formData.append("profileImg", editedUser.profileImgFile);
      }

      if (editedUser.coverImg) {
        formData.append("coverImg", editedUser.coverImgFile);
      }

      const response = await axios.put(
        "https://thinkthreadbackend.onrender.com/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast.success("Profile updated successfully!");
        // Update user data in localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            name: response.data.name,
          })
        );

        // Fetch updated profile data
        await fetchUserProfile();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 413) {
        toast.error("File too large. Please choose a smaller image.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setEditedUser({
        ...editedUser,
        profileImgFile: file,
        profileImg: URL.createObjectURL(file),
      });
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setEditedUser({
        ...editedUser,
        coverImgFile: file,
        coverImg: URL.createObjectURL(file),
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://thinkthreadbackend.onrender.com/api/posts/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to load your posts");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://thinkthreadbackend.onrender.com/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Post deleted successfully!");
        setPosts(posts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        postDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? " backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : " shadow-sm border-b border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-blue-600">
              TalentThread
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm lg:text-base"
              >
                <FaHome size={16} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition text-sm lg:text-base ${
                  isEditing
                    ? "bg-gray-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaEdit size={16} />
                <span className="hidden sm:inline">
                  {isEditing ? "Cancel" : "Edit"}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm lg:text-base"
              >
                <FaSignOutAlt size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
        >
          {/* Cover Photo */}
          <div className="relative h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={getFullImageUrl(editedUser.coverImg)}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGES.cover;
              }}
            />
            {isEditing && (
              <label className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 cursor-pointer transition">
                <FaCamera className="text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-4 lg:px-6 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-12 sm:-mt-16 mb-4">
              <div className="relative mb-4 lg:mb-0">
                <img
                  src={
                    isEditing && editedUser.profileImg
                      ? editedUser.profileImg
                      : user.profileImg
                      ? getFullImageUrl(user.profileImg)
                      : generateAvatarUrl(user.name)
                  }
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = generateAvatarUrl(user.name);
                  }}
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition">
                    <FaCamera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm lg:text-base"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm lg:text-base"
                    >
                      Cancel
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                    className="text-xl lg:text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-3 py-1 w-full"
                  />
                ) : (
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                )}
              </div>

              {/* Email Display */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope size={14} />
                <span className="break-all">{user.email}</span>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.title}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, title: e.target.value })
                  }
                  className="text-base lg:text-lg text-gray-600 bg-gray-50 border border-gray-300 rounded px-3 py-1 w-full"
                  placeholder="Your job title"
                />
              ) : (
                <p className="text-base lg:text-lg text-gray-600">
                  {user.title}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.location}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, location: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-0"
                    placeholder="Your location"
                  />
                ) : (
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt size={14} />
                    {user.location}
                  </span>
                )}
              </div>

              {/* Bio */}
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={editedUser.bio}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, bio: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 text-sm lg:text-base">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {user.connections || 0}
                  </div>
                  <div className="text-gray-600">Connections</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {user.followers || 0}
                  </div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {posts.length}
                  </div>
                  <div className="text-gray-600">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
        >
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">
            Posts
          </h2>

          {isLoadingPosts ? (
            <div className="text-center py-8 text-gray-500">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Share your first post!
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3">
                      <img
                        src={user.profileImg || generateAvatarUrl(user.name)}
                        alt={user.name}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm lg:text-base">
                          {user.name}
                        </h4>
                        <p className="text-xs lg:text-sm text-gray-600 truncate">
                          {user.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-gray-400 hover:text-red-500 transition p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
                      title="Delete post"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  <p className="text-gray-800 mb-3 text-sm lg:text-base break-words">
                    {post.content}
                  </p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg mb-3 object-cover max-h-64 lg:max-h-96"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;


