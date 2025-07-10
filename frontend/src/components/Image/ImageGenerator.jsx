import React, { useEffect, useState } from 'react';
import { Image, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadImageHistory();
  }, []);

  const loadImageHistory = async () => {
    try {
      const response = await api.image.getHistory();
      setHistory(response.images || []);
    } catch (err) {
      console.error('Failed to load image history:', err);
    }
  };

  const generateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const response = await api.image.generate(prompt);
      setGeneratedImage(response.imageUrl);
      setPrompt('');
      loadImageHistory();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Image className="w-5 h-5" /> Image Generator
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={generateImage} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </form>

        {generatedImage && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Generated Image</h3>
            <img
              src={generatedImage}
              alt="Generated"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        <div>
          <h3 className="font-medium mb-4">Recent Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((image, index) => (
              <div key={index} className="border rounded-lg p-4">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600 truncate">{image.prompt}</p>
                <p className="text-xs text-gray-400">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
