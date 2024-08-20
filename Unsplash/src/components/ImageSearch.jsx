import React, { useState, useEffect, useCallback, useRef } from 'react';

const ImageSearch = ({ query }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRandom, setIsRandom] = useState(false);

  const UNSPLASH_ACCESS_KEY = '2t7hAh5br-312Tv-hPGRVg5PxHkd31nnebPr3EJeBNU';

  // Debounce function prev aceess key 2t7hAh5br-312Tv-hPGRVg5PxHkd31nnebPr3EJeBNU
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchImages = useCallback(async (searchQuery = '', page = 1) => {
    if (loadingRef.current) return;
    setIsLoading(true);
    loadingRef.current = true;
    setError(null);

    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&page=${page}`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Network response was not ok: ${response.status} - ${errorDetails.errors}`);
      }

      const data = await response.json();
      setImages((prevImages) => (page === 1 ? data.results : [...prevImages, ...data.results]));
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [UNSPLASH_ACCESS_KEY]);

  const fetchRandomImages = useCallback(async (page = 1) => {
    if (loadingRef.current) return;
    setIsLoading(true);
    loadingRef.current = true;
    setError(null);

    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?count=20`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Network response was not ok: ${response.status} - ${errorDetails.errors}`);
      }

      const data = await response.json();
      setImages((prevImages) => (page === 1 ? data : [...prevImages, ...data]));
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [UNSPLASH_ACCESS_KEY]);

  const debouncedFetchImages = useCallback(debounce(fetchImages, 5000), [fetchImages]);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset page number on new search
    if (searchQuery) {
      debouncedFetchImages(searchQuery, 1);
    } else {
      fetchRandomImages(1);
    }
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10 && !loadingRef.current) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      setIsRandom(false);
      fetchImages(query, page);
    } else if (isRandom) {
      fetchRandomImages(page);
    }
  }, [page, query, isRandom, fetchImages, fetchRandomImages]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex justify-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for images..."
          className="bg-gray-200 py-2 px-4 rounded-l-md focus:outline-none"
        />
        <button type="submit" className="bg-red-700 text-white py-2 px-4 rounded-r-md hover:bg-blue-600">
          Search
        </button>
      </form>
      <div className="text-center mb-4">
        <button onClick={() => { setSearchQuery(''); setIsRandom(true); setPage(1); }} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Fetch Random Images
        </button>
      </div>
      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img src={image.urls.small} alt={image.description} className="w-full h-full object-cover rounded" />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
              <button onClick={() => handleDownload(image.urls.full)} className="bg-white text-black py-2 px-4 rounded">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;
