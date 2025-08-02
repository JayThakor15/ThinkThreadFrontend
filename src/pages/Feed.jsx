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
// import CreatePostDialog from "../components/CreatePostDialog";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [posts] = useState([
    {
      id: 1,
      user: "Sarah Johnson",
      title: "Product Manager at Google",
      profileImg: "https://randomuser.me/api/portraits/women/1.jpg",
      postImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      content: "Excited to announce that our team just launched a new feature that will help millions of users worldwide! 🚀",
      timestamp: "2024-01-15T10:30:00Z",
      likes: 124,
      comments: 28,
    },
    {
      id: 2,
      user: "Mike Chen",
      title: "Senior Software Engineer",
      profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Just finished reading 'Clean Code' by Robert Martin. Highly recommend it to all developers! The principles in this book have completely changed how I approach coding. 📚",
      timestamp: "2024-01-14T15:45:00Z",
      likes: 89,
      comments: 15,
    },
    {
      id: 3,
      user: "Emily Davis",
      title: "UX Designer at Microsoft",
      profileImg: "https://randomuser.me/api/portraits/women/3.jpg",
      postImg: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
      content: "Design thinking workshop was incredible today! Love collaborating with cross-functional teams to solve complex user problems. 🎨",
      timestamp: "2024-01-13T09:20:00Z",
      likes: 156,
      comments: 32,
    },
  ]);

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
      console.log("Creating post:", formData);
      // Add your API call here
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white shadow-sm border-b border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Search */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-600">TalentThread</h1>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition">
                <FaHome size={20} />
                <span className="text-xs">Home</span>
              </Link>
              <Link to="/network" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition">
                <FaUsers size={20} />
                <span className="text-xs">Network</span>
              </Link>
              <Link to="/jobs" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition">
                <FaBriefcase size={20} />
                <span className="text-xs">Jobs</span>
              </Link>
              <Link to="/notifications" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition">
                <FaRegBell size={20} />
                <span className="text-xs">Notifications</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition">
                <FaUser size={20} />
                <span className="text-xs">Me</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {["#ReactJS", "#WebDevelopment", "#TechCareers", "#AI", "#RemoteWork"].map((topic, index) => (
                  <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <CreatePostDialog 
                  trigger={
                    <button className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition">
                      What's on your mind?
                    </button>
                  }
                  onPostCreate={handleCreatePost}
                />
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                      <img
                        src={post.profileImg}
                        alt={post.user}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.user}</h4>
                        <p className="text-sm text-gray-600">{post.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <FaEllipsisH className="text-gray-400 cursor-pointer" />
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-800 mb-4">{post.content}</p>

                  {/* Post Image */}
                  {post.postImg && (
                    <img
                      src={post.postImg}
                      alt="Post content"
                      className="w-full rounded-lg mb-4 object-cover max-h-96"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
                        <FaHeart />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
                        <FaComment />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition">
                        <FaShare />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Suggested Connections</h3>
              <div className="space-y-4">
                {[
                  { name: "Alice Smith", title: "Frontend Developer", img: "https://randomuser.me/api/portraits/women/4.jpg" },
                  { name: "Bob Wilson", title: "Data Scientist", img: "https://randomuser.me/api/portraits/men/5.jpg" },
                  { name: "Carol Brown", title: "Product Designer", img: "https://randomuser.me/api/portraits/women/6.jpg" },
                ].map((person, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{person.name}</h4>
                      <p className="text-xs text-gray-600">{person.title}</p>
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>You have 3 new connection requests</p>
                <p>Sarah Johnson liked your post</p>
                <p>New job opportunity in your area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;