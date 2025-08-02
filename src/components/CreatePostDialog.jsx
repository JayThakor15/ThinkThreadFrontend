import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaVideo, FaSmile, FaTimes } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const CreatePostDialog = ({ trigger, onPostCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !selectedImage) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('caption', content);
      if (selectedImage) {
        formData.append('postImage', selectedImage);
      }

      await onPostCreate(formData);
      
      // Reset form
      setContent('');
      setSelectedImage(null);
      setImagePreview(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      <FaImage />
      Create Post
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Create Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="font-semibold text-white">{user.name}</h4>
              <p className="text-sm text-gray-400">Public</p>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-gray-900/70 text-white rounded-full hover:bg-gray-900 transition"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Media Options */}
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-300">Add to your post</span>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer p-2 hover:bg-gray-600 rounded-lg transition">
                <FaImage className="text-green-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                className="p-2 hover:bg-gray-600 rounded-lg transition"
              >
                <FaVideo className="text-blue-400" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-600 rounded-lg transition"
              >
                <FaSmile className="text-yellow-400" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={(!content.trim() && !selectedImage) || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;