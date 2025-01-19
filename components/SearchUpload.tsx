'use client'

import React, { useState } from 'react'
import { Search, Upload, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Modal } from './Modal'

export default function SearchUpload() {
  const [query, setQuery] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setQuery(selectedFile.name);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query && !file) {
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
    } else if (file) {
      setIsModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isPublic', isPublic.toString());
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
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center w-full border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 focus:outline-none bg-transparent dark:text-white"
            placeholder="Search or upload a file..."
          />
          <div className="flex items-center">
            <label className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-3 transition-colors duration-200">
              <Upload className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <button type="submit" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              {file ? <Send className="h-5 w-5 text-blue-500" /> : <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
            </button>
          </div>
        </div>
      </form>
      {error && (
        <p className="mt-4 text-red-500 text-center">{error}</p>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">글 공개 여부를 선택해주세요.</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => { setIsPublic(true); handleUpload(); }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            공개
          </button>
          <button
            onClick={() => { setIsPublic(false); handleUpload(); }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            비공개
          </button>
        </div>
      </Modal>
    </div>
  )
}

