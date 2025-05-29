import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Plus, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  image: string;
  description: string;
  year: string;
  medium: string;
  dimensions: string;
  status: 'pending' | 'approved';
}

const ArtworkModal = ({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-vansiii-black/90"
      style={{ zIndex: 10002 }}
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-vansiii-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-vansiii-white/20 transition-colors"
        onClick={onClose}
      >
        <X className="w-6 h-6 text-vansiii-white" />
      </motion.button>

      <div
        className="h-screen flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-[1600px] h-[80vh] flex gap-8">
          <div className="flex-1 flex items-center justify-center bg-vansiii-black/50 rounded-2xl overflow-hidden">
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              src={artwork.image}
              alt={artwork.title}
              className="max-h-full max-w-full object-contain rounded-xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-[400px] bg-vansiii-white rounded-2xl p-8 overflow-y-auto"
          >
            <h2 className="text-4xl font-bold mb-2">{artwork.title}</h2>
            <p className="accent-text mb-6">{artwork.artist}</p>
            <p className="text-gray-600 mb-8">{artwork.description}</p>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Year</h3>
                <p className="font-medium">{artwork.year}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Medium</h3>
                <p className="font-medium">{artwork.medium}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Dimensions</h3>
                <p className="font-medium">{artwork.dimensions}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const SubmitArtworkModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (artwork: Artwork) => void }) => {
  const [newArtwork, setNewArtwork] = useState<Artwork>({
    id: Date.now(),
    title: '',
    artist: '',
    image: '',
    description: '',
    year: new Date().getFullYear().toString(),
    medium: '',
    dimensions: '',
    status: 'pending',
  });
  const [isDragging, setIsDragging] = useState(false);
  const { isAuthenticated } = useAuth();

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
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('cloud_name', 'vansiii');

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    uploadImageToCloudinary(file).then(url => {
      if (url) {
        setNewArtwork(prev => ({ ...prev, image: url }));
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'image/jpeg' || file.type === 'image/png'
    );
    if (files.length === 0) {
      alert('Please drop only JPEG or PNG images.');
      return;
    }
    uploadImageToCloudinary(files[0]).then(url => {
      if (url) {
        setNewArtwork(prev => ({ ...prev, image: url }));
      }
    });
  };

  const handleSubmit = () => {
    if (!newArtwork.title || !newArtwork.artist || !newArtwork.image) {
      alert('Please fill in title, artist, and upload an image.');
      return;
    }
    onSubmit(newArtwork);
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-vansiii-black/90"
        style={{ zIndex: 10002 }}
        onClick={onClose}
      >
        <div
          className="h-screen flex items-center justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-vansiii-white rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Please Log In</h2>
            <p className="text-gray-600 mb-6">You must be logged in to submit artwork.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-vansiii-black"
              >
                Cancel
              </button>
              <a
                href="/login"
                className="flex items-center justify-center gap-2 accent-bg text-vansiii-white px-6 py-2 rounded-lg hover:accent-bg transition-colors"
              >
                Log In
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-vansiii-black/90"
      style={{ zIndex: 10002 }}
      onClick={onClose}
    >
      <div
        className="h-screen flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-vansiii-white rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Submit Your Artwork</h2>

          <div className="grid gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
              <input
                type="text"
                value={newArtwork.artist}
                onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (JPEG, PNG)</label>
              <div
                className={`w-full px-3 py-8 border-2 border-dashed rounded-lg text-center text-gray-500 transition-colors cursor-pointer mb-4 ${
                  isDragging ? 'border-vansiii-accent bg-vansiii-accent/10' : 'border-gray-300 hover:accent-border'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                Drag and drop your image here
              </div>
              <label
                htmlFor="artwork-upload"
                className="flex items-center justify-center gap-2 accent-bg text-vansiii-white px-4 py-2 rounded-lg hover:accent-bg transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Choose Image
              </label>
              <input
                id="artwork-upload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileSelect}
              />
              {newArtwork.image && (
                <div className="mt-4">
                  <img src={newArtwork.image} alt="Preview" className="w-full h-24 object-cover rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newArtwork.description}
                onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                placeholder="Describe your artwork"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  value={newArtwork.year}
                  onChange={(e) => setNewArtwork({ ...newArtwork, year: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Year"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
                <input
                  type="text"
                  value={newArtwork.medium}
                  onChange={(e) => setNewArtwork({ ...newArtwork, medium: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Medium used"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={newArtwork.dimensions}
                  onChange={(e) => setNewArtwork({ ...newArtwork, dimensions: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 1920x1080 px"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-vansiii-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 accent-bg text-vansiii-white px-6 py-2 rounded-lg hover:accent-bg transition-colors"
              >
                Submit Artwork
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ArtGallery = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isSubmitModalOpen, setIsModalOpen] = useState(false);
  const [artworks] = useState<Artwork[]>(() => {
    const savedArtworks = localStorage.getItem('art_gallery');
    return savedArtworks ? JSON.parse(savedArtworks) : [];
  });
  const [pendingArtworks, setPendingArtworks] = useState<Artwork[]>(() => {
    const savedPending = localStorage.getItem('pending_artworks');
    return savedPending ? JSON.parse(savedPending) : [];
  });
  const { isAdmin } = useAuth();

  const handleSubmitArtwork = (artwork: Artwork) => {
    const updatedPendingArtworks = [...pendingArtworks, artwork];
    setPendingArtworks(updatedPendingArtworks);
    localStorage.setItem('pending_artworks', JSON.stringify(updatedPendingArtworks));
  };

  return (
    <>
      <div className={`min-h-screen bg-[#F8F5F1] pt-20 ${selectedArtwork ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-light tracking-tighter"
            >
              Wall of Art
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-vansiii-black text-vansiii-white px-6 py-3 rounded-full hover:accent-bg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Submit Artwork
            </motion.button>
          </div>

          {isAdmin && pendingArtworks.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Pending Submissions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative cursor-pointer"
                    onClick={() => setSelectedArtwork(artwork)}
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-xl bg-vansiii-white">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-vansiii-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <Eye className="w-8 h-8 text-vansiii-white mb-2 mx-auto" />
                          <div className="text-vansiii-white text-sm font-medium text-center">View Artwork</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium">{artwork.title}</h3>
                      <div className="text-sm text-gray-600">{artwork.artist}</div>
                      <div className="text-sm text-vansiii-accent">Pending Approval</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.filter(artwork => artwork.status === 'approved').map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-vansiii-white">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-vansiii-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Eye className="w-8 h-8 text-vansiii-white mb-2 mx-auto" />
                      <div className="text-vansiii-white text-sm font-medium text-center">View Artwork</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{artwork.title}</h3>
                  <div className="text-sm text-gray-600">{artwork.artist}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
        {isSubmitModalOpen && (
          <SubmitArtworkModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitArtwork}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtGallery;