import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaUsers,
  FaBriefcase,
  FaRegBell,
  FaCog,
  FaSignOutAlt,
  FaHeart,
  FaComment,
  FaShare,
  FaProjectDiagram,
} from "react-icons/fa";
import CreatePostDialog from "../components/CreatePostDialog";
import {
  generateAvatarUrl,
  getImageWithFallback,
} from "../utils/defaultImages";
import { getFullImageUrl } from "../utils/imageClean";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Show success message
    toast.success("Logged out successfully");

    // Redirect to login
    navigate("/login");
  };

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
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://thinkthreadbackend.onrender.com/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUserProfile();
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://thinkthreadbackend.onrender.com/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Post created!",
          "Your post has been shared successfully"
        );
        setPosts([response.data.post, ...posts]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post", "Please try again");
      throw error;
    }
  };

  const menuItems = [{ icon: FaHome, label: "Home", path: "/dashboard" }];

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

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://thinkthreadbackend.onrender.com/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: response.data.isLiked
                    ? [...(post.likes || []), user._id]
                    : (post.likes || []).filter((id) => id !== user._id),
                  likesCount: response.data.likesCount,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post", "Please try again");
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://thinkthreadbackend.onrender.com/api/posts/${postId}/comment`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: [...(post.comments || []), response.data.comment],
                  commentsCount: response.data.commentsCount,
                }
              : post
          )
        );
        toast.success("Comment added!", "Your comment has been posted");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment", "Please try again");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-400">TalentThread</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-gray-700 transition"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: isExpanded ? 256 : 64 }}
        animate={{ width: isExpanded ? 256 : 74 }}
        className={`${
          isExpanded ? "fixed inset-0 z-50 lg:relative lg:z-auto" : "hidden"
        } lg:flex bg-gray-800 transition-all duration-300 flex-col lg:w-auto`}
      >
        {/* Mobile overlay */}
        {isExpanded && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}

        <div
          className={`${
            isExpanded ? "relative z-50 w-64" : ""
          } lg:w-auto bg-gray-800 h-full flex flex-col`}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2
                className={`text-xl font-bold text-blue-400 ${
                  !isExpanded && "lg:hidden"
                }`}
              >
                TalentThread
              </h2>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-gray-700 transition"
              >
                {isExpanded ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition"
                    onClick={() =>
                      window.innerWidth < 1024 && setIsExpanded(false)
                    }
                  >
                    <item.icon className="text-xl flex-shrink-0" />
                    <span className={`${!isExpanded && "lg:hidden"}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}

              <li>
                <CreatePostDialog
                  trigger={
                    <div className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition cursor-pointer">
                      <FaProjectDiagram className="text-xl flex-shrink-0" />
                      <span className={`${!isExpanded && "lg:hidden"}`}>
                        Create Post
                      </span>
                    </div>
                  }
                  onPostCreate={handleCreatePost}
                />
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition w-full"
            >
              <FaSignOutAlt className="text-xl text-red-500 flex-shrink-0" />
              <span className={`text-red-500 ${!isExpanded && "lg:hidden"}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700/50"
              : "bg-gray-900 shadow-sm border-b border-gray-700"
          } p-4 lg:p-6`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold">
              Welcome, <span className="text-blue-400">{userName}</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <CreatePostDialog onPostCreate={handleCreatePost} />
              </div>
              <FaRegBell className="text-gray-400 text-xl cursor-pointer hover:text-white transition" />
              <Link to="/profile">
                <img
                  src={
                    user.profileImg
                      ? getFullImageUrl(user.profileImg)
                      : generateAvatarUrl(user.name || userName)
                  }
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-400 object-cover"
                  onError={(e) => {
                    e.target.src = generateAvatarUrl(user.name || userName);
                  }}
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {posts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No posts yet. Create your first post!
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg"
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        post.user.profileImg
                          ? getFullImageUrl(post.user.profileImg)
                          : generateAvatarUrl(post.user.name)
                      }
                      alt={post.user.name}
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = generateAvatarUrl(post.user.name);
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-white text-sm lg:text-base">
                        {post.user.name}
                      </h4>
                      <p className="text-xs lg:text-sm text-gray-400">
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-300 mb-4 text-sm lg:text-base">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg object-cover max-h-64 lg:max-h-96"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 transition text-sm lg:text-base ${
                          post.likes?.includes(user._id)
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <FaHeart
                          className={
                            post.likes?.includes(user._id) ? "fill-current" : ""
                          }
                        />
                        <span>
                          {post.likesCount || post.likes?.length || 0}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition text-sm lg:text-base">
                        <FaComment />
                        <span>
                          {post.commentsCount || post.comments?.length || 0}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {post.comments.slice(0, 2).map((comment, idx) => (
                        <div key={idx} className="flex gap-3">
                          <img
                            src={
                              comment.user.profileImg
                                ? getFullImageUrl(comment.user.profileImg)
                                : generateAvatarUrl(comment.user.name)
                            }
                            alt={comment.user.name}
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 bg-gray-700 rounded-lg p-3">
                            <h5 className="font-semibold text-white text-xs lg:text-sm">
                              {comment.user.name}
                            </h5>
                            <p className="text-gray-300 text-xs lg:text-sm">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="mt-4 flex gap-3">
                    <img
                      src={
                        user.profileImg
                          ? getFullImageUrl(user.profileImg)
                          : generateAvatarUrl(user.name || userName)
                      }
                      alt="Your profile"
                      className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const content = e.target.comment.value.trim();
                        if (content) {
                          handleComment(post._id, content);
                          e.target.comment.value = "";
                        }
                      }}
                      className="flex-1 flex gap-2"
                    >
                      <input
                        name="comment"
                        type="text"
                        placeholder="Write a comment..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-3 lg:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm lg:text-base"
                      />
                      <button
                        type="submit"
                        className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm lg:text-base"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
