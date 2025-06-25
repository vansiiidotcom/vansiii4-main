import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Trash2, Check, X, Plus } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  images: string[];
  description: string;
  client?: string;
  year?: string;
  role?: string;
  aspect_ratio?: string;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  description: string;
  year: string;
  medium: string;
  dimensions: string;
  status: 'pending' | 'approved';
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  excerpt: string;
  image: string;
  content: string;
}

const AdminDashboard = () => {
  const { isAdmin, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Portfolio' | 'Artwork' | 'Blog'>('Portfolio');
  const [projects, setProjects] = useState<Project[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [pendingArtworks, setPendingArtworks] = useState<Artwork[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    id: Date.now().toString(),
    title: '',
    category: '',
    images: [],
    description: '',
    client: '',
    year: new Date().getFullYear().toString(),
    role: '',
    aspect_ratio: '1/1',
  });
  const [newArtwork, setNewArtwork] = useState<Artwork>({
    id: Date.now().toString(),
    title: '',
    artist: '',
    image: '',
    description: '',
    year: new Date().getFullYear().toString(),
    medium: '',
    dimensions: '',
    status: 'approved',
  });
  const [newBlogPost, setNewBlogPost] = useState<BlogPost>({
    id: Date.now().toString(),
    title: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    readTime: '',
    excerpt: '',
    image: '',
    content: '',
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  // Fetch data from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to load projects');
      }
    };

    const fetchArtworks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/artworks');
        if (!response.ok) throw new Error('Failed to fetch artworks');
        const data = await response.json();
        setArtworks(data.filter((a: Artwork) => a.status === 'approved'));
        setPendingArtworks(data.filter((a: Artwork) => a.status === 'pending'));
      } catch (error) {
        console.error('Error fetching artworks:', error);
        alert('Failed to load artworks');
      }
    };

    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blog-posts');
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        alert('Failed to load blog posts');
      }
    };

    fetchProjects();
    fetchArtworks();
    fetchBlogPosts();
  }, []);

  const uploadImageToCloudinary = async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
      alert('Please upload only JPEG or PNG images.');
      return undefined;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB.');
      return undefined;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'portfolio_upload');
    formData.append('folder', `portfolio/${activeTab.toLowerCase()}`); // Store in respective folders

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/vansiii/image/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      const responseJson = await response.json();
      return responseJson.secure_url;
    } catch (error) {
      alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return undefined;
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadImageToCloudinary(file);
    if (url) {
      setNewProject((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const handleArtworkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadImageToCloudinary(file);
    if (url) {
      setNewArtwork((prev) => ({ ...prev, image: url }));
    }
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadImageToCloudinary(file);
    if (url) {
      setNewBlogPost((prev) => ({ ...prev, image: url }));
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.category || !newProject.images.length || !newProject.description) {
      alert('Please fill in title, category, at least one image, and description.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) throw new Error('Failed to save project');
      const savedProject = await response.json();
      setProjects([...projects, savedProject]);
      setNewProject({
        id: Date.now().toString(),
        title: '',
        category: '',
        images: [],
        description: '',
        client: '',
        year: new Date().getFullYear().toString(),
        role: '',
        aspect_ratio: '1/1',
      });
    } catch (error) {
      alert(`Error saving project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtwork.title || !newArtwork.artist || !newArtwork.image || !newArtwork.description) {
      alert('Please fill in title, artist, image, and description.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArtwork),
      });
      if (!response.ok) throw new Error('Failed to save artwork');
      const savedArtwork = await response.json();
      setArtworks([...artworks, savedArtwork]);
      setNewArtwork({
        id: Date.now().toString(),
        title: '',
        artist: '',
        image: '',
        description: '',
        year: new Date().getFullYear().toString(),
        medium: '',
        dimensions: '',
        status: 'approved',
      });
    } catch (error) {
      alert(`Error saving artwork: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogPost.title || !newBlogPost.content || !newBlogPost.image) {
      alert('Please fill in title, content, and image.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlogPost),
      });
      if (!response.ok) throw new Error('Failed to save blog post');
      const savedBlogPost = await response.json();
      setBlogPosts([...blogPosts, savedBlogPost]);
      setNewBlogPost({
        id: Date.now().toString(),
        title: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
        readTime: '',
        excerpt: '',
        image: '',
        content: '',
      });
    } catch (error) {
      alert(`Error saving blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleApproveArtwork = async (artwork: Artwork) => {
    try {
      const updatedArtwork = { ...artwork, status: 'approved' as const };
      const response = await fetch(`http://localhost:5000/api/artworks/${artwork.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArtwork),
      });
      if (!response.ok) throw new Error('Failed to approve artwork');
      setArtworks([...artworks, updatedArtwork]);
      setPendingArtworks(pendingArtworks.filter((a) => a.id !== artwork.id));
    } catch (error) {
      alert(`Error approving artwork: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRejectArtwork = async (artworkId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/artworks/${artworkId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to reject artwork');
      setPendingArtworks(pendingArtworks.filter((a) => a.id !== artworkId));
    } catch (error) {
      alert(`Error rejecting artwork: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (error) {
      alert(`Error deleting project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteBlogPost = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/blog-posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog post');
      setBlogPosts(blogPosts.filter((p) => p.id !== postId));
    } catch (error) {
      alert(`Error deleting blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vansiii-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vansiii-bg pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-light tracking-tighter text-vansiii-black"
          >
            Admin Dashboard
          </motion.h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-full hover:accent-bg transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            {['Portfolio', 'Artwork', 'Blog'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'Portfolio' | 'Artwork' | 'Blog')}
                className={`px-6 py-3 text-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-vansiii-gray text-vansiii-gray'
                    : 'text-gray-600 hover:text-vansiii-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Portfolio Tab */}
            {activeTab === 'Portfolio' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Manage Portfolio Projects</h2>
                <form onSubmit={handleAddProject} className="bg-vansiii-white p-6 rounded-lg shadow space-y-4 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., UI/UX, Marketing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleProjectImageUpload}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {newProject.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newProject.images.map((image, index) => (
                          <img key={index} src={image} alt="Preview" className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input
                      type="text"
                      value={newProject.client}
                      onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={newProject.year}
                      onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={newProject.role}
                      onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Lead Designer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                    <input
                      type="text"
                      value={newProject.aspect_ratio}
                      onChange={(e) => setNewProject({ ...newProject, aspect_ratio: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 1/1, 4/5"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg hover:accent-bg transition-colors"
                  >
                    <Plus className="w-5 h-5" /> Add Project
                  </button>
                </form>

                <h3 className="text-xl font-semibold mb-4">Existing Projects</h3>
                {projects.length === 0 ? (
                  <p className="text-gray-600">No projects available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-vansiii-white p-4 rounded-lg shadow">
                        <img
                          src={project.images[0] || 'https://via.placeholder.com/150'}
                          alt={project.title}
                          className="w-full h-40 object-cover rounded mb-4"
                        />
                        <h3 className="text-lg font-medium text-vansiii-black">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.category}</p>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg mt-4"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Artwork Tab */}
            {activeTab === 'Artwork' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Manage Artwork Submissions</h2>
                <form onSubmit={handleAddArtwork} className="bg-vansiii-white p-6 rounded-lg shadow space-y-4 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newArtwork.title}
                      onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter artwork title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                    <input
                      type="text"
                      value={newArtwork.artist}
                      onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter artist name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleArtworkImageUpload}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {newArtwork.image && (
                      <img src={newArtwork.image} alt="Preview" className="w-full h-24 object-cover rounded mt-2" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newArtwork.description}
                      onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Enter artwork description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={newArtwork.year}
                      onChange={(e) => setNewArtwork({ ...newArtwork, year: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
                    <input
                      type="text"
                      value={newArtwork.medium}
                      onChange={(e) => setNewArtwork({ ...newArtwork, medium: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Oil on Canvas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={newArtwork.dimensions}
                      onChange={(e) => setNewArtwork({ ...newArtwork, dimensions: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 24x36 in"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg hover:accent-bg transition-colors"
                  >
                    <Plus className="w-5 h-5" /> Add Artwork
                  </button>
                </form>

                <h3 className="text-xl font-semibold mb-4">Pending Submissions</h3>
                {pendingArtworks.length === 0 ? (
                  <p className="text-gray-600">No pending artworks.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingArtworks.map((artwork) => (
                      <div key={artwork.id} className="bg-vansiii-white p-4 rounded-lg shadow">
                        <img src={artwork.image} alt={artwork.title} className="w-full h-40 object-cover rounded mb-4" />
                        <h3 className="text-lg font-medium text-vansiii-black">{artwork.title}</h3>
                        <p className="text-sm text-gray-600">{artwork.artist}</p>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleApproveArtwork(artwork)}
                            className="flex items-center gap-2 bg-vansiii-success text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() => handleRejectArtwork(artwork.id)}
                            className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-4 mt-8">Approved Artworks</h3>
                {artworks.length === 0 ? (
                  <p className="text-gray-600">No approved artworks.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artworks.map((artwork) => (
                      <div key={artwork.id} className="bg-vansiii-white p-4 rounded-lg shadow">
                        <img src={artwork.image} alt={artwork.title} className="w-full h-40 object-cover rounded mb-4" />
                        <h3 className="text-lg font-medium text-vansiii-black">{artwork.title}</h3>
                        <p className="text-sm text-gray-600">{artwork.artist}</p>
                        <button
                          onClick={() => handleRejectArtwork(artwork.id)}
                          className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg mt-4"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'Blog' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Manage Blog Posts</h2>
                <form onSubmit={handleAddBlogPost} className="bg-vansiii-white p-6 rounded-lg shadow space-y-4 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newBlogPost.title}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleBlogImageUpload}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    {newBlogPost.image && (
                      <img src={newBlogPost.image} alt="Preview" className="w-full h-24 object-cover rounded mt-2" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <textarea
                      value={newBlogPost.excerpt}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Enter blog excerpt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                    <textarea
                      value={newBlogPost.content}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={6}
                      placeholder="Enter blog content (HTML)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={newBlogPost.tags.join(',')}
                      onChange={(e) =>
                        setNewBlogPost({ ...newBlogPost, tags: e.target.value.split(',').map((tag) => tag.trim()) })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., tech, design, art"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={newBlogPost.readTime}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, readTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 5 min read"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg hover:accent-bg transition-colors"
                  >
                    <Plus className="w-5 h-5" /> Add Blog Post
                  </button>
                </form>

                <h3 className="text-xl font-semibold mb-4">Existing Blog Posts</h3>
                {blogPosts.length === 0 ? (
                  <p className="text-gray-600">No blog posts available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="bg-vansiii-white p-4 rounded-lg shadow">
                        <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded mb-4" />
                        <h3 className="text-lg font-medium text-vansiii-black">{post.title}</h3>
                        <p className="text-sm text-gray-600">{post.date}</p>
                        <button
                          onClick={() => handleDeleteBlogPost(post.id)}
                          className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg mt-4"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;