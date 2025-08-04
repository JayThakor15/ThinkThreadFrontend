import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaArrowRight,
  FaUsers,
  FaBriefcase,
  FaNetworkWired,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import Footer from "./Footer";

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-blue-400"
        >
          TalentThread
        </motion.div>
        <div className="hidden sm:flex ">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link
              to="/login"
              className=" px-6 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
        <div className="flex md:hidden">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              {isOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>
          </motion.div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl absolute right-4 top-16 min-w-[200px] shadow-xl z-50"
          >
            <div className="p-4 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200"
              >
                <FaUser className="text-sm" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <FaUserPlus className="text-sm" />
                <span>Sign Up</span>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Mobile Menu */}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Connect Your
              <span className="text-blue-400"> Professional</span> Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals building meaningful connections,
              sharing insights, and advancing their careers on TalentThread.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started <FaArrowRight />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Professional networking"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose TalentThread?
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to grow your professional network
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FaUsers,
              title: "Build Connections",
              description:
                "Connect with like-minded professionals and expand your network",
            },
            {
              icon: FaBriefcase,
              title: "Career Growth",
              description:
                "Discover opportunities and showcase your professional journey",
            },
            {
              icon: FaNetworkWired,
              title: "Industry Insights",
              description:
                "Stay updated with industry trends and professional insights",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center hover:bg-gray-750 transition"
            >
              <feature.icon className="text-4xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
