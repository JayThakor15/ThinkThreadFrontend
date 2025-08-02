import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userName = JSON.parse(localStorage.getItem('user'))?.name || "User";

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/posts", {
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
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Post created successfully!");
        // Add new post to the beginning of posts array
        setPosts([response.data.post, ...posts]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      throw error;
    }
  };

  const menuItems = [
    { icon: FaHome, label: "Home", path: "/dashboard" },

  ];

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: isExpanded ? 256 : 64 }}
        animate={{ width: isExpanded ? 256 : 64 }}
        className="bg-gray-800 transition-all duration-300 flex flex-col"
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <h2 className="text-xl font-bold text-blue-400">TalentThread</h2>
            )}
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
                >
                  <item.icon className="text-xl" />
                  {isExpanded && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
            
            <li>
              <CreatePostDialog 
                trigger={
                  <div className="flex items-center gap-3 p-3 text-gray-300 hover:bg-gray-700 rounded-lg transition cursor-pointer">
                    <FaProjectDiagram className="text-xl" />
                    {isExpanded && <span>Create Post</span>}
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
            <FaSignOutAlt className="text-xl text-red-500" />
            {isExpanded && <span className="text-red-500">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700/50' 
            : 'bg-gray-900 shadow-sm border-b border-gray-700'
        } p-6`}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Welcome, <span className="text-blue-400">{userName}</span>
            </h1>
            <div className="flex items-center gap-4">
              <CreatePostDialog onPostCreate={handleCreatePost} />
              <FaRegBell className="text-gray-400 text-xl cursor-pointer hover:text-white transition" />
              <Link to="/profile">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-400"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  className="bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.user.profileImg || "https://randomuser.me/api/portraits/men/1.jpg"}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{post.user.name}</h4>
                      <p className="text-sm text-gray-400">
                        {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-300 mb-4">{post.content}</p>

                  {/* Post Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  )}
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


