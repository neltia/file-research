'use client'

import AnalysisResult from '@/app/components/AnalysisResult';
import SkeletonUI from '@/app/components/SkeletonUI';
import { useEffect, useState } from 'react';

interface AnalysisResultData {
  filename: string;
  result: string;
  status: string;
}

export default function AnalysisPage() {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<AnalysisResultData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Replace this with actual API call when ready
        setResult({
          filename: 'example.txt',
          result: 'This is a sample analysis result.',
          status: 'completed'
        })
      } catch (err) {
        console.error('Error fetching analysis result:', err)
        setError('An error occurred while fetching the analysis result. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [])

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">File Analysis</h1>
      {loading ? (
        <SkeletonUI />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : result ? (
        <AnalysisResult filename={result.filename} result={result.result} status={result.status} />
      ) : (
        <p className="text-center">No result found.</p>
      )}
    </div>
  )
}

