import React from 'react'

interface AnalysisResultProps {
  filename: string
  result: string
  status: string
}

export default function AnalysisResult({ filename, result, status }: AnalysisResultProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
      <p className="mb-2"><strong>Filename:</strong> {filename}</p>
      <p className="mb-2"><strong>Status:</strong> {status}</p>
      {status === 'completed' ? (
        <p><strong>Result:</strong> {result}</p>
      ) : (
        <p>Analysis in progress...</p>
      )}
    </div>
  )
}

