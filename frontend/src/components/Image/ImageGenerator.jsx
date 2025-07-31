import React, { useEffect, useState } from 'react';
import { Image, ImageUp, Loader2, Plus, X } from 'lucide-react';
import api from '../../services/api';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    loadImageHistory();
  }, []);

  useEffect(() => {

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

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
      let response;
      
      if (selectedFile) {
     
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('image', selectedFile);
        
        response = await api.image.generateImageToImage(formData);
      } else {
      
        response = await api.image.generate(prompt);
      }
      
      setGeneratedImage(response.imageUrl);
      setPrompt('');
      setSelectedFile(null);
      setPreviewUrl(null);
      loadImageHistory();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

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
     
          {previewUrl && (
            <div className="mb-4 relative">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-w-48 max-h-48 rounded-lg border border-gray-300 object-cover"
                />
                <button
                  onClick={removeSelectedFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Image-to-image mode: Your image will be modified based on the prompt
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <div className='flex justify-center items-center w-10'>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*"
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
              placeholder={selectedFile ? "Describe how to modify the uploaded image..." : "Describe the image you want to generate..."}
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
                  <span className="hidden sm:inline">
                    {selectedFile ? 'Modifying...' : 'Generating...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{selectedFile ? 'Modify Image' : 'Generate'}</span>
                </>
              )}
            </button>
          </div>
          
          {!selectedFile && (
            <p className="text-xs text-gray-500 mt-2">
              Upload an image to use image-to-image generation, or just enter a prompt for text-to-image
            </p>
          )}
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
                  {image.isImageToImage && (
                    <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1">
                      Image-to-Image
                    </span>
                  )}
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