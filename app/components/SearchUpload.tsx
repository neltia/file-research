'use client'

import React, { useState } from 'react'
import { Search, Upload } from 'lucide-react'

export default function SearchUpload() {
  const [query, setQuery] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !query) return

    const formData = new FormData()
    if (file) formData.append('file', file)
    if (query) formData.append('query', query)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      console.log(data)
      // Handle the response as needed
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <form onSubmit={handleSubmit} className="relative">
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
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>
      </form>
      {file && (
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">Selected file: {file.name}</p>
      )}
    </div>
  )
}

