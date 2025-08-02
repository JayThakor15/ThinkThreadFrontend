import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      profileImg: "https://randomuser.me/api/portraits/women/1.jpg",
      postImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      content: "Excited to share that I've just completed my certification in Full Stack Development! 🎉",
      timestamp: "2024-01-15T10:30:00Z",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      user: "Mike Chen",
      profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Just finished an amazing project using React and Node.js. The learning never stops! 💻",
      timestamp: "2024-01-14T15:45:00Z",
      likes: 18,
      comments: 5,
    },
  ]);

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

  const handleCreatePost = async (formData) => {
    try {
      console.log("Creating post with data:", formData);
      
      const newPost = {
        id: posts.length + 1,
        user: userName,
        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
        postImg: formData.get('postImage') ? URL.createObjectURL(formData.get('postImage')) : null,
        content: formData.get('caption'),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
      };
      
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const menuItems = [
    { icon: FaHome, label: "Home", path: "/dashboard" },

  ];

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
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.profileImg}
                    alt={post.user}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{post.user}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4">{post.content}</p>

                {/* Post Image */}
                {post.postImg && (
                  <img
                    src={post.postImg}
                    alt="Post content"
                    className="w-full rounded-lg mb-4 object-cover max-h-96"
                  />
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition">
                      <FaHeart />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition">
                      <FaComment />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition">
                      <FaShare />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
