"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import FileList from "../components/FileList"
import { Navigation } from "../components/Navigation"
import SkeletonUI from "../components/SkeletonUI"
import { ThemeProvider } from "../components/ThemeContext"

interface FileInfo {
  filename: string
  sha256: string
  filesize: number
}

function SearchResults() {
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get all possible search parameters
        const filename = searchParams.get("filename")
        const sha256 = searchParams.get("sha256")
        const md5 = searchParams.get("md5")
        const sha1 = searchParams.get("sha1")
        const extension = searchParams.get("extension")

        // Find the first non-null parameter
        let searchQuery = ""
        if (filename) searchQuery = `filename=${encodeURIComponent(filename)}`
        else if (sha256) searchQuery = `sha256=${encodeURIComponent(sha256)}`
        else if (md5) searchQuery = `md5=${encodeURIComponent(md5)}`
        else if (sha1) searchQuery = `sha1=${encodeURIComponent(sha1)}`
        else if (extension) searchQuery = `extension=${encodeURIComponent(extension)}`

        if (!searchQuery) {
          setError("No valid search parameter provided")
          setLoading(false)
          return
        }

        console.log("Fetching from URL:", `/api/search?${searchQuery}`)
        const response = await fetch(`/api/search?${searchQuery}`)

        if (response.status === 404) {
          setFiles([])
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Received data:", data)
        setFiles(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching results:", error)
        setError(
          `An error occurred while fetching search results: ${error instanceof Error ? error.message : String(error)}`,
        )
        setFiles([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchParams])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main className="container mx-auto px-4 pt-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Search Results</h1>
          {loading ? (
            <SkeletonUI />
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">No results found.</p>
          ) : (
            <FileList files={files} />
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SkeletonUI />}>
      <SearchResults />
    </Suspense>
  )
}

