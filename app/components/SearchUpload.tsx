"use client"

import { Search, Send, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { AlertModal } from "./AlertModal"
import { Modal } from "./Modal"

export default function SearchUpload() {
  const [query, setQuery] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setQuery(selectedFile.name)
    }
  }

  const determineSearchType = (query: string): { param: string; value: string } | null => {
    // SHA256 (64 characters)
    if (/^[a-fA-F0-9]{64}$/.test(query)) {
      return { param: "sha256", value: query }
    }
    // MD5 (32 characters)
    if (/^[a-fA-F0-9]{32}$/.test(query)) {
      return { param: "md5", value: query }
    }
    // SHA1 (40 characters)
    if (/^[a-fA-F0-9]{40}$/.test(query)) {
      return { param: "sha1", value: query }
    }
    // Extension (starts with dot, 1-10 characters)
    if (/^\.[a-zA-Z0-9]{1,9}$/.test(query)) {
      return { param: "extension", value: query.substring(1) }
    }
    // Filename (1-255 characters)
    if (query.length >= 1 && query.length <= 255) {
      return { param: "filename", value: query }
    }
    return null
  }

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query && !file) {
      try {
        console.log("Initiating search with query:", query)
        const searchType = determineSearchType(query)

        if (!searchType) {
          setAlertMessage("Invalid search query. Please check your input.")
          setIsAlertOpen(true)
          return
        }

        // First, try to fetch the results
        const response = await fetch(`/api/search?${searchType.param}=${encodeURIComponent(searchType.value)}`)

        if (response.status === 404) {
          setAlertMessage("No results found for your search.")
          setIsAlertOpen(true)
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // If successful, navigate to search results
        router.push(`/search-results?${searchType.param}=${encodeURIComponent(searchType.value)}`)
      } catch (error) {
        console.error("Error during search:", error)
        setError("An error occurred during search. Please try again.")
      }
    } else if (file) {
      setIsModalOpen(true)
    }
  }

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("is_public", "true")
      try {
        const response = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        })
        if (response.status === 400) {
          console.log("Received 400 status, showing alert")
          setAlertMessage("Unsupported file type. Please upload a different file.")
          setIsAlertOpen(true)
          setIsModalOpen(false)
          return
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Upload response:", data)
        if (data.sha256) {
          router.push(`/analysis/${data.sha256}`)
        } else {
          setError("Unable to process the uploaded file. Please try again.")
        }
      } catch (error) {
        console.error("Error during file upload:", error)
        setError("An error occurred during file upload. Please try again.")
      }
      setIsModalOpen(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center w-full border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 focus:outline-none bg-transparent dark:text-white"
            placeholder="Search by filename, hash, or extension..."
          />
          <div className="flex items-center">
            <label className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 transition-colors duration-200">
              <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <button
              type="submit"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {file ? (
                <Send className="h-6 w-6 text-blue-500" />
              ) : (
                <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </form>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            현재 비공개 업로드는 지원되지 않습니다.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              className="px-4 py-2 text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              업로드
            </button>
          </div>
        </div>
      </Modal>
      <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} message={alertMessage} />
    </div>
  )
}

