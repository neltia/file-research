'use client'

import React, { useState } from 'react'
import { Search, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchUpload() {
  const [query, setQuery] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Upload response:', data);
        router.push(`/analysis/${data.file_id}`);
      } catch (error) {
        console.error('Error during file upload:', error);
        setError('An error occurred during file upload. Please try again.');
      }
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      try {
        console.log('Initiating search with query:', query);
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Search response:', data);
        router.push(`/search-results?query=${encodeURIComponent(query)}`);
      } catch (error) {
        console.error('Error during search:', error);
        setError('An error occurred during search. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center w-full border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 ml-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 focus:outline-none bg-transparent dark:text-white"
            placeholder="Search or upload a file..."
          />
          <label className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 transition-colors duration-200">
            <Upload className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </form>
      {error && (
        <p className="mt-4 text-red-500 text-center">{error}</p>
      )}
      {file && (
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">Selected file: {file.name}</p>
      )}
    </div>
  )
}

