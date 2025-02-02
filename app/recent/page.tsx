"use client"

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

function RecentFiles() {
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/file/recent`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Received data:", data)
        setFiles(data)
      } catch (error) {
        console.error("Error fetching recent files:", error)
        setError(
          `An error occurred while fetching recent files: ${error instanceof Error ? error.message : String(error)}`,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main className="container mx-auto px-4 pt-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Recent Files</h1>
          {loading ? (
            <SkeletonUI />
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">No recent files found.</p>
          ) : (
            <FileList files={files} context="recent" />
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default function RecentFilesPage() {
  return (
    <Suspense fallback={<SkeletonUI />}>
      <RecentFiles />
    </Suspense>
  )
}

