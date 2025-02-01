"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import FileList from "../components/FileList"
import SkeletonUI from "../components/SkeletonUI"

interface FileInfo {
  filename: string
  sha256: string
  filesize: number
}

// Test data
const testData: FileInfo[] = [
  {
    filename: "document1.pdf",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    filesize: 1024 * 1024 * 2.5, // 2.5 MB
  },
  {
    filename: "image1.jpg",
    sha256: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    filesize: 1024 * 512, // 512 KB
  },
  {
    filename: "spreadsheet1.xlsx",
    sha256: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
    filesize: 1024 * 1024 * 1.2, // 1.2 MB
  },
]

function SearchResults() {
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const query = searchParams.get("query")

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let url = `/api/file/list`
        if (query) {
          url += `?query=${encodeURIComponent(query)}`
        }
        console.log("Fetching from URL:", url) // Log the URL being fetched
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Received data:", data) // Log the received data
        setFiles(data.length > 0 ? data : testData) // Use test data if no results
      } catch (error) {
        console.error("Error fetching results:", error)
        setError(
          `An error occurred while fetching search results: ${error instanceof Error ? error.message : String(error)}`,
        )
        setFiles(testData) // Use test data in case of error
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (loading) return <SkeletonUI />
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <p className="mt-4">Displaying test data:</p>
        <FileList files={files} />
      </div>
    )
  if (files.length === 0) return <p className="text-center">No results found.</p>

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Search Results</h1>
      <FileList files={files} />
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SkeletonUI />}>
      <SearchResults />
    </Suspense>
  )
}

