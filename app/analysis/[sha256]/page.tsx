"use client"

import { Navigation } from "@/app/components/Navigation"
import SkeletonUI from "@/app/components/SkeletonUI"
import { ThemeProvider } from "@/app/components/ThemeContext"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

interface FileInfo {
  filename: string
  filesize: number
  extension: string
  sha256: string
  md5: string
  sha1: string
  latitude: number | null
  longitude: number | null
  file_metadata: Record<string, any>
  created_at: string
}

export default function AnalysisPage() {
  const [loading, setLoading] = useState(true)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { sha256 } = useParams()

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await fetch(`/api/file/${sha256}`)
        if (response.status === 404) {
          setError(
            "The requested file could not be found in our system. Please check the file identifier and try again.",
          )
          setLoading(false)
          return
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: FileInfo = await response.json()
        setFileInfo(data)
      } catch (err) {
        console.error("Error fetching file info:", err)
        setError("An error occurred while fetching the file information. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchFileInfo()
  }, [sha256])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
    else return (bytes / 1073741824).toFixed(2) + " GB"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const renderContent = () => {
    if (loading) return <SkeletonUI />
    if (error)
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">File Not Found</h1>
          <p className="text-red-500">{error}</p>
          <p className="mt-4">
            <a href="/" className="text-blue-500 hover:underline">
              Return to home page
            </a>
          </p>
        </div>
      )
    if (!fileInfo) return <p className="text-center">No file information found.</p>

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">File Analysis</h1>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 break-all">{fileInfo.sha256}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Filename:</strong> {fileInfo.filename}
              </p>
              <p>
                <strong>Size:</strong> {formatFileSize(fileInfo.filesize)}
              </p>
              <p>
                <strong>Extension:</strong> {fileInfo.extension}
              </p>
              <p>
                <strong>Created at:</strong> {formatDate(fileInfo.created_at)}
              </p>
            </div>
            <div>
              <p>
                <strong>MD5:</strong> {fileInfo.md5}
              </p>
              <p>
                <strong>SHA1:</strong> {fileInfo.sha1}
              </p>
            </div>
          </div>
          {fileInfo.latitude && fileInfo.longitude && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p>
                <strong>Latitude:</strong> {fileInfo.latitude}
              </p>
              <p>
                <strong>Longitude:</strong> {fileInfo.longitude}
              </p>
            </div>
          )}
          {Object.keys(fileInfo.file_metadata).length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Additional Metadata</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(fileInfo.file_metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navigation />
        <main className="container mx-auto px-4 pt-12">{renderContent()}</main>
      </div>
    </ThemeProvider>
  )
}

