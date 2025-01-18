'use client'

import AnalysisResult from '@/components/AnalysisResult'
import SkeletonUI from '@/components/SkeletonUI'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AnalysisResultData {
  filename: string;
  result: string;
  status: string;
}

export default function AnalysisPage() {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<AnalysisResultData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/analysis-result/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: AnalysisResultData = await response.json()
        setResult(data)
      } catch (err) {
        console.error('Error fetching analysis result:', err)
        setError('An error occurred while fetching the analysis result. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [id])

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

