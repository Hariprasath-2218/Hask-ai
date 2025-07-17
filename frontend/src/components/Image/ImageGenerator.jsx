import React, { useEffect, useState } from 'react';
import { Image, ImageUp, Loader2, Plus } from 'lucide-react';
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

  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Image className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Image Generator</span>
          <span className="xs:hidden">Images</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className='flex justify-center items-center w-10'>
              <input
                type="file"
                onChange={e => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {selectedFile ? (
                  <Plus className="w-8 h-8 mx-auto mb-2 text-green-600" />
                ) : (
                  <ImageUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                )}
              </label>
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateImage(e)}
              placeholder="Describe the image you want to generate..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {generatedImage && (
          <div className="mb-4 sm:mb-6">
            <h3 className="font-medium mb-2 text-sm sm:text-base">Generated Image</h3>
            <div className="relative">
              <img
                src={generatedImage}
                alt="Generated"
                className='max-w-full h-auto rounded-lg shadow-lg'
              />
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Recent Images</h3>
          {history.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Image className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No images generated yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {history.map((image, index) => (
                <div key={index} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
                  <div className="aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1 sm:mb-2">
                    {image.prompt}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;