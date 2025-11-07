import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import './CreateBlog.css';

const CreateBlog = ({ user, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: [],
    images: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'College Life',
    'Projects',
    'Career Guidance',
    'Technical Skills',
    'Interview Preparation',
    'Study Tips',
    'Industry Insights',
    'Personal Development'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set fixed aspect ratio (16:9)
          const targetWidth = 800;
          const targetHeight = 450;
          const targetRatio = targetWidth / targetHeight;
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Calculate crop dimensions
          const imgRatio = img.width / img.height;
          let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
          
          if (imgRatio > targetRatio) {
            // Image is wider, crop width
            sourceWidth = img.height * targetRatio;
            sourceX = (img.width - sourceWidth) / 2;
          } else {
            // Image is taller, crop height
            sourceHeight = img.width / targetRatio;
            sourceY = (img.height - sourceHeight) / 2;
          }
          
          // Draw cropped image
          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
          
          // Convert to base64
          const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
          
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, croppedImage]
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_BASE_URL}/blogs`, {
        mentorId: user.id,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Blog created successfully!');
      onBack();
    } catch (error) {
      console.error('Failed to create blog:', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog">
      <div className="create-blog-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Create New Blog</h2>
      </div>

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter blog title..."
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of your blog..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button type="button" onClick={handleAddTag}>Add</button>
          </div>
          <div className="tags-list">
            {formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          <div className="images-preview">
            {formData.images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image} alt={`Preview ${index + 1}`} />
                <button type="button" onClick={() => handleRemoveImage(index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your blog content here..."
            rows="15"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
