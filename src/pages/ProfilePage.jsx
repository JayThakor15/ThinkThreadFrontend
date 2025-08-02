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
} from "react-icons/fa";
import {
  DEFAULT_IMAGES,
  getImageWithFallback,
  generateAvatarUrl,
} from "../utils/defaultImages";
import { useNavigate, Link } from "react-router-dom";

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
        "http://localhost:5000/api/user/profile",
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

      if (editedUser.profileImgFile) {
        formData.append("profileImg", editedUser.profileImgFile);
      }

      if (editedUser.coverImgFile) {
        formData.append("coverImg", editedUser.coverImgFile);
      }

      const response = await axios.put(
        "http://localhost:5000/api/user/profile",
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
      const response = await axios.get("http://localhost:5000/api/posts/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        `http://localhost:5000/api/posts/${postId}`,
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold   text-blue-600">TalentThread</h1>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                <FaHome size={16} />
                Home
              </Link>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <FaEdit size={16} />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FaSignOutAlt size={16} />
                Logout
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
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={getImageWithFallback(
                isEditing ? editedUser.coverImg : user.coverImg,
                "cover"
              )}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_IMAGES.cover;
              }}
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  id="coverImgUpload"
                />
                <label
                  htmlFor="coverImgUpload"
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition cursor-pointer"
                >
                  <FaCamera size={16} />
                </label>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
              <div className="relative">
                <img
                  src={getImageWithFallback(
                    isEditing ? editedUser.profileImg : user.profileImg,
                    "profile"
                  )}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = generateAvatarUrl(user.name);
                  }}
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                      id="profileImgUpload"
                    />
                    <label
                      htmlFor="profileImgUpload"
                      className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer"
                    >
                      <FaCamera size={14} />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded px-3 py-1 w-full"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.title}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, title: e.target.value })
                  }
                  className="text-lg text-gray-600 bg-gray-50 border border-gray-300 rounded px-3 py-1 w-full"
                />
              ) : (
                <p className="text-lg text-gray-600">{user.title}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.location}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, location: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Your location"
                  />
                ) : (
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt size={14} />
                    {user.location}
                  </span>
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={editedUser.bio}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, bio: e.target.value })
                  }
                  className="w-full mt-4 p-3 bg-gray-50 border border-gray-300 rounded resize-none"
                  rows="3"
                  placeholder="Write about yourself"
                />
              ) : (
                <p className="text-gray-700 mt-4">{user.bio}</p>
              )}

              {isEditing && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Your Posts
          </h3>

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
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-600">{user.title}</p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-gray-400 hover:text-red-500 transition p-2 rounded-lg hover:bg-gray-100"
                      title="Delete post"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>

                  <p className="text-gray-800 mb-3">{post.content}</p>

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg mb-3 object-cover max-h-96"
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
