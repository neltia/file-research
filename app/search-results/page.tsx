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
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setFiles(data)
      } catch (error) {
        console.error("Error fetching results:", error)
        setError("An error occurred while fetching search results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (loading) return <SkeletonUI />
  if (error) return <p className="text-center text-red-500">{error}</p>
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

