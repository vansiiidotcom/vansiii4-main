const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure Cloudinary using CLOUDINARY_URL
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint to fetch projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      prefix: 'portfolio/images', // Adjust folder as needed
      context: true,
      max_results: 100,
    });
    const projects = result.resources.map((resource) => ({
      id: resource.asset_id,
      title: resource.context?.custom?.title || 'Untitled',
      category: resource.context?.custom?.category || '',
      images: [resource.secure_url],
      description: resource.context?.custom?.description || '',
      client: resource.context?.custom?.client || '',
      year: resource.context?.custom?.year || '',
      role: resource.context?.custom?.role || '',
      aspect_ratio: resource.context?.custom?.aspect_ratio || '1/1',
    }));
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Endpoint to fetch artworks
app.get('/api/artworks', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      prefix: 'portfolio/artworks',
      context: true,
      max_results: 100,
    });
    const artworks = result.resources.map((resource) => ({
      id: resource.asset_id,
      title: resource.context?.custom?.title || 'Untitled',
      artist: resource.context?.custom?.artist || '',
      image: resource.secure_url,
      description: resource.context?.custom?.description || '',
      year: resource.context?.custom?.year || '',
      medium: resource.context?.custom?.medium || '',
      dimensions: resource.context?.custom?.dimensions || '',
      status: resource.context?.custom?.status || 'approved',
    }));
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// Endpoint to fetch blog posts
app.get('/api/blog-posts', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      resource_type: 'image',
      prefix: 'portfolio/blog/',
      context: true,
      max_results: 100
    });
    const blogPosts = result.resources.map(resource => ({
      id: resource.asset_id,
      title: resource.context?.custom?.title || ''
    }));
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add POST endpoint for projects
app.post('/api/projects', async (req, res) => {
  const project = req.body;
  try {
    // Update image metadata in Cloudinary
    const publicId = project.images[0].split('/').pop()?.split('.')[0];
    const result = await cloudinary.uploader.explicit(`portfolio/images/${publicId}`, {
      type: 'upload',
      context: `custom|title=${project.title}|category=${project.category}|description=${project.description}|client=${project.client || ''}|year=${project.year || ''}|role=${project.role || ''}|aspect_ratio=${project.aspect_ratio || '1/1'}`,
    });
    const newProject = {
      id: result.asset_id,
      title: project.title,
      category: project.category,
      images: [result.secure_url],
      description: project.description,
      client: project.client,
      year: project.year,
      role: project.role,
      aspect_ratio: project.aspect_ratio,
    };
    res.json(newProject);
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// Add POST endpoint for artworks
app.post('/api/artworks', async (req, res) => {
  const artwork = req.body;
  try {
    const publicId = artwork.image.split('/').pop()?.split('.')[0];
    const result = await cloudinary.uploader.explicit(`portfolio/artworks/${publicId}`, {
      type: 'upload',
      context: `custom|title=${artwork.title}|artist=${artwork.artist}|description=${artwork.description}|year=${artwork.year || ''}|medium=${artwork.medium || ''}|dimensions=${artwork.dimensions || ''}|status=${artwork.status}`,
    });
    const newArtwork = {
      id: result.asset_id,
      title: artwork.title,
      artist: artwork.artist,
      image: result.secure_url,
      description: artwork.description,
      year: artwork.year,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      status: artwork.status,
    };
    res.json(newArtwork);
  } catch (error) {
    console.error('Error saving artwork:', error);
    res.status(500).json({ error: 'Failed to save artwork' });
  }
});

// Add POST endpoint for blog posts
app.post('/api/blog-posts', async (req, res) => {
  const blogPost = req.body;
  try {
    const publicId = blogPost.image.split('/').pop()?.split('.')[0];
    const result = await cloudinary.uploader.explicit(`portfolio/blog/${publicId}`, {
      type: 'upload',
      context: `custom|title=${blogPost.title}|date=${blogPost.date}|tags=${blogPost.tags.join(',')}|readTime=${blogPost.readTime || ''}|excerpt=${blogPost.excerpt || ''}|content=${blogPost.content || ''}`,
    });
    const newBlogPost = {
      id: result.asset_id,
      title: blogPost.title,
      date: blogPost.date,
      tags: blogPost.tags,
      readTime: blogPost.readTime,
      excerpt: blogPost.excerpt,
      image: result.secure_url,
      content: blogPost.content,
    };
    res.json(newBlogPost);
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ error: 'Failed to save blog post' });
  }
});

// Add PUT endpoint for approving artworks
app.put('/api/artworks/:id', async (req, res) => {
  const artwork = req.body;
  const { id } = req.params;
  try {
    const publicId = artwork.image.split('/').pop()?.split('.')[0];
    const result = await cloudinary.uploader.explicit(`portfolio/artworks/${publicId}`, {
      type: 'upload',
      context: `custom|title=${artwork.title}|artist=${artwork.artist}|description=${artwork.description}|year=${artwork.year || ''}|medium=${artwork.medium || ''}|dimensions=${artwork.dimensions || ''}|status=${artwork.status}`,
    });
    res.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    res.status(500).json({ error: 'Failed to update artwork' });
  }
});

// Add DELETE endpoint for projects
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the asset to get its public_id
    const result = await cloudinary.api.resource_by_asset_id(id);
    await cloudinary.uploader.destroy(result.public_id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add DELETE endpoint for artworks
app.delete('/api/artworks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cloudinary.api.resource_by_asset_id(id);
    await cloudinary.uploader.destroy(result.public_id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ error: 'Failed to delete artwork' });
  }
});

// Add DELETE endpoint for blog posts
app.delete('/api/blog-posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cloudinary.api.resource_by_asset_id(id);
    await cloudinary.uploader.destroy(result.public_id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});