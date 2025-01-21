import Link from "next/link"

interface FileInfo {
  filename: string
  sha256: string
  filesize: number
}

interface FileListProps {
  files: FileInfo[]
}

export default function FileList({ files }: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
    else return (bytes / 1073741824).toFixed(2) + " GB"
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">File List</h2>
      <ul className="space-y-4">
        {files.map((file) => (
          <li key={file.sha256} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <Link
              href={`/analysis/${file.sha256}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{file.filename}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.filesize)}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">SHA256: {file.sha256}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

