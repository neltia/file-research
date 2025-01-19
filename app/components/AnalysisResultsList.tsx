import React from 'react'
import Link from 'next/link'

interface AnalysisResult {
  id: string
  filename: string
  status: string
  result: string
}

interface AnalysisResultsListProps {
  results: AnalysisResult[]
}

export default function AnalysisResultsList({ results }: AnalysisResultsListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <ul className="space-y-4">
        {results.map((result) => (
          <li key={result.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <Link href={`/analysis/${result.id}`}>
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="font-semibold">{result.filename}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status: {result.status}</p>
                {result.status === 'completed' && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{result.result.substring(0, 100)}...</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

