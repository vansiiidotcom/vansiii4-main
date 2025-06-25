import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Trash2, Check, X, Plus, Edit2 } from 'lucide-react';

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
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editArtwork, setEditArtwork] = useState<Artwork | null>(null);
  const [editBlogPost, setEditBlogPost] = useState<BlogPost | null>(null);

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
    formData.append('folder', `portfolio/${activeTab.toLowerCase()}`);

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
      if (editProject) {
        setEditProject((prev) => prev ? ({ ...prev, images: [...prev.images, url] }) : null);
      } else {
        setNewProject((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    }
  };

  const handleArtworkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadImageToCloudinary(file);
    if (url) {
      if (editArtwork) {
        setEditArtwork((prev) => prev ? ({ ...prev, image: url }) : null);
      } else {
        setNewArtwork((prev) => ({ ...prev, image: url }));
      }
    }
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = await uploadImageToCloudinary(file);
    if (url) {
      if (editBlogPost) {
        setEditBlogPost((prev) => prev ? ({ ...prev, image: url }) : null);
      } else {
        setNewBlogPost((prev) => ({ ...prev, image: url }));
      }
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

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProject?.title || !editProject?.category || !editProject?.images.length || !editProject?.description) {
      alert('Please fill in title, category, at least one image, and description.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${editProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProject),
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updatedProject = await response.json();
      setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
      setEditProject(null);
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
      alert(`Error updating project: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const handleUpdateArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArtwork?.title || !editArtwork?.artist || !editArtwork?.image || !editArtwork?.description) {
      alert('Please fill in title, artist, image, and description.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/artworks/${editArtwork.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editArtwork),
      });
      if (!response.ok) throw new Error('Failed to update artwork');
      const updatedArtwork = await response.json();
      setArtworks(artworks.map((a) => (a.id === updatedArtwork.id ? updatedArtwork : a)));
      setEditArtwork(null);
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
      alert(`Error updating artwork: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const handleUpdateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBlogPost?.title || !editBlogPost?.content || !editBlogPost?.image) {
      alert('Please fill in title, content, and image.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/blog-posts/${editBlogPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBlogPost),
      });
      if (!response.ok) throw new Error('Failed to update blog post');
      const updatedBlogPost = await response.json();
      setBlogPosts(blogPosts.map((p) => (p.id === updatedBlogPost.id ? updatedBlogPost : p)));
      setEditBlogPost(null);
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
      alert(`Error updating blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      setArtworks(artworks.filter((a) => a.id !== artworkId));
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

  const handleEditProject = (project: Project) => {
    setEditProject(project);
    setNewProject(project);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditArtwork(artwork);
    setNewArtwork(artwork);
  };

  const handleEditBlogPost = (blogPost: BlogPost) => {
    setEditBlogPost(blogPost);
    setNewBlogPost(blogPost);
  };

  const cancelEdit = () => {
    setEditProject(null);
    setEditArtwork(null);
    setEditBlogPost(null);
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
                <h2 className="text-2xl font-semibold mb-6">
                  {editProject ? 'Edit Portfolio Project' : 'Add Portfolio Project'}
                </h2>
                <form onSubmit={editProject ? handleUpdateProject : handleAddProject} className="bg-vansiii-white p-6 rounded-lg shadow space-y-4 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, title: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, title: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={newProject.category}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, category: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, category: value }));
                      }}
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
                    {(editProject?.images || newProject.images).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(editProject?.images || newProject.images).map((image, index) => (
                          <img key={index} src={image} alt="Preview" className="w-24 h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, description: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, description: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Enter project description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input
                      type="text"
                      value={newProject.client || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, client: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, client: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={newProject.year || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, year: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, year: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={newProject.role || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, role: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, role: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Lead Designer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                    <input
                      type="text"
                      value={newProject.aspect_ratio || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editProject) {
                          setEditProject((prev) => prev ? ({ ...prev, aspect_ratio: value }) : null);
                        }
                        setNewProject((prev) => ({ ...prev, aspect_ratio: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 1/1, 4/5"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg hover:accent-bg transition-colors"
                    >
                      <Plus className="w-5 h-5" /> {editProject ? 'Update Project' : 'Add Project'}
                    </button>
                    {editProject && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-2 bg-gray-500 text-vansiii-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" /> Cancel
                      </button>
                    )}
                  </div>
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
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="flex items-center gap-2 bg-vansiii-gray text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Artwork Tab */}
            {activeTab === 'Artwork' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {editArtwork ? 'Edit Artwork' : 'Add Artwork'}
                </h2>
                <form onSubmit={editArtwork ? handleUpdateArtwork : handleAddArtwork} className="bg-vansiii-white p-6 rounded-lg shadow space-y-4 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newArtwork.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editArtwork) {
                          setEditArtwork((prev) => prev ? ({ ...prev, title: value }) : null);
                        }
                        setNewArtwork((prev) => ({ ...prev, title: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter artwork title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                    <input
                      type="text"
                      value={newArtwork.artist}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editArtwork) {
                          setEditArtwork((prev) => prev ? ({ ...prev, artist: value }) : null);
                        }
                        setNewArtwork((prev) => ({ ...prev, artist: value }));
                      }}
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
                    {(editArtwork?.image || newArtwork.image) && (
                      <img src={editArtwork?.image || newArtwork.image} alt="Preview" className="w-full h-24 object-cover rounded mt-2" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newArtwork.description}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editArtwork) {
                          setEditArtwork((prev) => prev ? ({ ...prev, description: value }) : null);
                        }
                        setNewArtwork((prev) => ({ ...prev, description: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Enter artwork description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={newArtwork.year || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editArtwork) {
                          setEditArtwork((prev) => prev ? ({ ...prev, year: value }) : null);
                        }
                        setNewArtwork((prev) => ({ ...prev, year: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
                    <input
                      type="text"
                      value={newArtwork.medium || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editArtwork) {
                          setEditArtwork((prev) => prev ? ({ ...prev, medium: value }) : null);
                        }
                        setNewArtwork((prev) => ({ ...prev, medium: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Oil on Canvas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={newArtwork.dimensions || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editArtwork) {
                          setEditArtwork((prev) => prev ? ({ ...prev, dimensions: value }) : null);
                        }
                        setNewArtwork((prev) => ({ ...prev, dimensions: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 24x36 in"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg hover:accent-bg transition-colors"
                    >
                      <Plus className="w-5 h-5" /> {editArtwork ? 'Update Artwork' : 'Add Artwork'}
                    </button>
                    {editArtwork && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-2 bg-gray-500 text-vansiii-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" /> Cancel
                      </button>
                    )}
                  </div>
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
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleEditArtwork(artwork)}
                            className="flex items-center gap-2 bg-vansiii-gray text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleRejectArtwork(artwork.id)}
                            className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blog Tab */}
            {activeTab === 'Blog' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  {editBlogPost ? 'Edit Blog Post' : 'Add Blog Post'}
                </h2>
                <form onSubmit={editBlogPost ? handleUpdateBlogPost : handleAddBlogPost} className="bg-vansiii-white p-6 rounded-lg shadow space-y-4 mb-12">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newBlogPost.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editBlogPost) {
                          setEditBlogPost((prev) => prev ? ({ ...prev, title: value }) : null);
                        }
                        setNewBlogPost((prev) => ({ ...prev, title: value }));
                      }}
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
                    {(editBlogPost?.image || newBlogPost.image) && (
                      <img src={editBlogPost?.image || newBlogPost.image} alt="Preview" className="w-full h-24 object-cover rounded mt-2" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <textarea
                      value={newBlogPost.excerpt}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editBlogPost) {
                          setEditBlogPost((prev) => prev ? ({ ...prev, excerpt: value }) : null);
                        }
                        setNewBlogPost((prev) => ({ ...prev, excerpt: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Enter blog excerpt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                    <textarea
                      value={newBlogPost.content}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editBlogPost) {
                          setEditBlogPost((prev) => prev ? ({ ...prev, content: value }) : null);
                        }
                        setNewBlogPost((prev) => ({ ...prev, content: value }));
                      }}
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
                      onChange={(e) => {
                        const value = e.target.value.split(',').map((tag) => tag.trim());
                        if (editBlogPost) {
                          setEditBlogPost((prev) => prev ? ({ ...prev, tags: value }) : null);
                        }
                        setNewBlogPost((prev) => ({ ...prev, tags: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., tech, design, art"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={newBlogPost.readTime || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (editBlogPost) {
                          setEditBlogPost((prev) => prev ? ({ ...prev, readTime: value }) : null);
                        }
                        setNewBlogPost((prev) => ({ ...prev, readTime: value }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 5 min read"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg hover:accent-bg transition-colors"
                    >
                      <Plus className="w-5 h-5" /> {editBlogPost ? 'Update Blog Post' : 'Add Blog Post'}
                    </button>
                    {editBlogPost && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-2 bg-gray-500 text-vansiii-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" /> Cancel
                      </button>
                    )}
                  </div>
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
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={() => handleEditBlogPost(post)}
                            className="flex items-center gap-2 bg-vansiii-gray text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="flex items-center gap-2 bg-vansiii-accent text-vansiii-white px-4 py-2 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
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