import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaUser,
  FaUsers,
  FaBriefcase,
  FaRegBell,
  FaHeart,
  FaComment,
  FaShare,
  FaEllipsisH,
} from "react-icons/fa";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";
import CreatePostDialog from "../components/CreatePostDialog";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      toast.error("Failed to load posts", "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

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
        toast.success("Post created successfully!", "Your post is now live");
        setPosts([response.data.post, ...posts]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post", "Please try again");
      throw error;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo & Search */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl lg:text-2xl font-bold text-blue-600">TalentThread</h1>
              <div className="relative hidden sm:block">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-48 lg:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-600 hover:text-blue-600 transition text-sm lg:text-base"
              >
                <FaHome size={18} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 lg:px-4 py-2 text-gray-600 hover:text-blue-600 transition text-sm lg:text-base"
              >
                <FaUser size={18} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <FaBell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Profile"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-blue-400"
              />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-center">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Profile"
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-900">John Doe</h3>
                <p className="text-sm text-gray-600">Senior Full Stack Developer</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile views</span>
                    <span className="text-blue-600 font-semibold">142</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {['React Development', 'AI & Machine Learning', 'Remote Work', 'Startup Culture'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">#{topic}</span>
                    <span className="text-xs text-gray-400">1.2k posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
              <div className="flex gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    rows="3"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition text-sm">
                        <FaImage />
                        <span className="hidden sm:inline">Photo</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition text-sm">
                        <FaVideo />
                        <span className="hidden sm:inline">Video</span>
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm lg:text-base">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No posts available. Be the first to post!
                </div>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <img
                          src={post.user.profileImg || "https://randomuser.me/api/portraits/men/1.jpg"}
                          alt={post.user.name}
                          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{post.user.name}</h4>
                          <p className="text-xs lg:text-sm text-gray-600 truncate">{post.user.title}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <FaEllipsisH />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-4 text-sm lg:text-base break-words">{post.content}</p>

                    {/* Post Image */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-lg mb-4 object-cover max-h-64 lg:max-h-96"
                      />
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition text-sm lg:text-base">
                          <FaHeart />
                          <span>{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition text-sm lg:text-base">
                          <FaComment />
                          <span>{post.comments || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition text-sm lg:text-base">
                          <FaShare />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            {/* Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">People you may know</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://randomuser.me/api/portraits/women/${index + 1}.jpg`}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">Jane Smith</h4>
                        <p className="text-xs text-gray-600">UX Designer</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  "John liked your post",
                  "Sarah commented on your article",
                  "Mike started following you",
                  "New job posting matches your skills"
                ].map((activity, index) => (
                  <div key={index} className="text-sm text-gray-600 py-2 border-b border-gray-100 last:border-b-0">
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;


